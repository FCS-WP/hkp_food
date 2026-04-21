import { useRef, useEffect, useState, useCallback } from "react";
import Pagination from "@shop-filter/Pagination";

const API_BASE = "/wp-json/ai-zippy/v1";

/**
 * Fetch all products for a single category, applying the current non-category filters.
 * Uses per_page=100 to retrieve all products in one shot.
 */
async function fetchCategoryProducts(categorySlug, filters) {
	const params = new URLSearchParams();
	params.set("category", categorySlug);
	params.set("per_page", "100");
	params.set("page", "1");

	// Carry over non-category filters (price, stock, attributes, search, sort)
	const carry = ["min_price", "max_price", "stock_status", "attributes", "search", "orderby", "order"];
	for (const key of carry) {
		const val = filters?.[key];
		if (val !== undefined && val !== "" && val !== 0) {
			params.set(key, val);
		}
	}

	const res = await fetch(`${API_BASE}/products?${params.toString()}`);
	if (!res.ok) throw new Error(`Failed to fetch products for category: ${categorySlug}`);
	const data = await res.json();
	return data.products || [];
}

/**
 * Given a flat list of {slug, name, products[]} sections and a per-page limit,
 * return only the sections (and sliced products) that appear on the given page.
 */
function paginateSections(sections, page, perPage) {
	const start = (page - 1) * perPage;
	const end = start + perPage;
	let cursor = 0;
	const result = [];

	for (const section of sections) {
		const sectionStart = cursor;
		const sectionEnd = cursor + section.products.length;

		// Does this section overlap with [start, end)?
		if (sectionEnd <= start || sectionStart >= end) {
			cursor = sectionEnd;
			continue;
		}

		const sliceFrom = Math.max(0, start - sectionStart);
		const sliceTo = Math.min(section.products.length, end - sectionStart);
		result.push({
			...section,
			products: section.products.slice(sliceFrom, sliceTo),
		});
		cursor = sectionEnd;
	}

	return result;
}

/**
 * Child theme override of ProductGrid.
 *
 * Grouped mode (no category filter active):
 *   - Fires one API request per category from options.categories.
 *   - Paginates globally across all categories (perPage products per page).
 *   - Empty categories are hidden.
 *
 * Filtered mode (category filter active):
 *   - Uses the `products` prop already fetched by ShopFilter (correctly filtered + paginated).
 *   - Shows only sections matching the active filter slugs.
 */
export default function ProductGrid({ products, loading, viewMode, perPage, filters, options }) {
	const containerRef = useRef(null);

	const activeCategories = filters?.category
		? filters.category.split(",").map((s) => s.trim()).filter(Boolean)
		: [];

	const isGroupedMode = activeCategories.length === 0;

	// Per-category data when in grouped mode
	const [allSections, setAllSections] = useState([]);
	const [groupedLoading, setGroupedLoading] = useState(false);
	const [groupedPage, setGroupedPage] = useState(1);

	const pageSize = perPage || 12;

	// Build a stable cache key from non-category filters so we re-fetch when they change
	const filterCacheKey = [
		filters?.min_price,
		filters?.max_price,
		filters?.stock_status,
		filters?.attributes,
		filters?.search,
		filters?.orderby,
		filters?.order,
	].join("|");

	const loadGrouped = useCallback(async (categories, currentFilters) => {
		if (!Array.isArray(categories) || categories.length === 0) return;

		setGroupedLoading(true);
		setGroupedPage(1); // reset to page 1 on re-fetch
		try {
			// Fetch all categories in parallel
			const results = await Promise.all(
				categories.map(async (cat) => ({
					slug: cat.slug,
					name: cat.name,
					products: await fetchCategoryProducts(cat.slug, currentFilters),
				}))
			);
			// Only keep categories that have products
			setAllSections(results.filter((s) => s.products.length > 0));
		} catch (err) {
			console.error("Category fetch error:", err);
		} finally {
			setGroupedLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!isGroupedMode) return;
		const cats = Array.isArray(options?.categories) ? options.categories : [];
		if (cats.length === 0) return;

		// Only fetch leaf categories (no children) to avoid duplicate products.
		const parentIds = new Set(cats.map((c) => c.parent).filter((id) => id !== 0));
		const leafCats = cats.filter((c) => !parentIds.has(c.id));

		loadGrouped(leafCats, filters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isGroupedMode, filterCacheKey, options?.categories?.length]);

	// Preserve container height during loading to prevent layout shift.
	const isLoading = isGroupedMode ? groupedLoading : loading;

	useEffect(() => {
		if (!containerRef.current) return;
		if (isLoading) {
			const h = containerRef.current.offsetHeight;
			if (h > 0) containerRef.current.style.minHeight = `${h}px`;
		} else {
			const timer = setTimeout(() => {
				if (containerRef.current) containerRef.current.style.minHeight = "";
			}, 100);
			return () => clearTimeout(timer);
		}
	}, [isLoading]);

	const skeletonCount = pageSize;

	// ── Grouped mode ──────────────────────────────────────────────────────────
	if (isGroupedMode) {
		if (groupedLoading) {
			return (
				<div ref={containerRef} className="sf__grid-wrap">
					<div className={`sf__grid-loading sf__grid-loading--${viewMode}`}>
						{Array.from({ length: skeletonCount }).map((_, i) => (
							<div key={i} className="sf__skeleton" />
						))}
					</div>
				</div>
			);
		}

		if (allSections.length === 0 && !groupedLoading) {
			return (
				<div ref={containerRef} className="sf__grid-wrap">
					<div className="sf__empty">
						<p>No products found.</p>
					</div>
				</div>
			);
		}

		const totalGroupedProducts = allSections.reduce((sum, s) => sum + s.products.length, 0);
		const totalGroupedPages = Math.ceil(totalGroupedProducts / pageSize);
		const visibleSections = paginateSections(allSections, groupedPage, pageSize);

		return (
			<div ref={containerRef} className="sf__grid-wrap">
				{visibleSections.map((section) => (
					<div key={section.slug} className="sf__cat-section">
						<h3 className="sf__cat-section-title">{section.name}</h3>
						<div className={`sf__grid sf__grid--${viewMode}`}>
							{section.products.map((product) => (
								<ProductCard key={product.id} product={product} viewMode={viewMode} />
							))}
						</div>
					</div>
				))}
				{totalGroupedPages > 1 && (
					<Pagination
						current={groupedPage}
						total={totalGroupedPages}
						onChange={(p) => {
							setGroupedPage(p);
							containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
						}}
					/>
				)}
			</div>
		);
	}

	// ── Filtered mode (category selected) ─────────────────────────────────────
	// Products already filtered by the API — render as a flat grid.
	if (loading) {
		return (
			<div ref={containerRef} className="sf__grid-wrap">
				<div className={`sf__grid-loading sf__grid-loading--${viewMode}`}>
					{Array.from({ length: skeletonCount }).map((_, i) => (
						<div key={i} className="sf__skeleton" />
					))}
				</div>
			</div>
		);
	}

	if (!products || products.length === 0) {
		return (
			<div ref={containerRef} className="sf__grid-wrap">
				<div className="sf__empty">
					<p>No products found matching your filters.</p>
				</div>
			</div>
		);
	}

	// Resolve category names for the active filter slugs
	const allCategories = Array.isArray(options?.categories) ? options.categories : [];

	// If only one category is selected, show a single titled section
	if (activeCategories.length <= 1) {
		const catName = allCategories.find((c) => c.slug === activeCategories[0])?.name;
		return (
			<div ref={containerRef} className="sf__grid-wrap">
				{catName && <h3 className="sf__cat-section-title">{catName}</h3>}
				<div className={`sf__grid sf__grid--${viewMode}`}>
					{products.map((product) => (
						<ProductCard key={product.id} product={product} viewMode={viewMode} />
					))}
				</div>
			</div>
		);
	}

	// Multiple categories selected — group products into per-category sections
	const sections = activeCategories
		.map((slug) => {
			const cat = allCategories.find((c) => c.slug === slug);
			return {
				slug,
				name: cat?.name || slug,
				products: products.filter((p) =>
					(p.categories || []).some((c) => c.slug === slug)
				),
			};
		})
		.filter((s) => s.products.length > 0);

	return (
		<div ref={containerRef} className="sf__grid-wrap">
			{sections.map((section) => (
				<div key={section.slug} className="sf__cat-section">
					<h3 className="sf__cat-section-title">{section.name}</h3>
					<div className={`sf__grid sf__grid--${viewMode}`}>
						{section.products.map((product) => (
							<ProductCard key={product.id} product={product} viewMode={viewMode} />
						))}
					</div>
				</div>
			))}
		</div>
	);
}

// ---------------------------------------------------------------------------
// ProductCard — identical to parent theme version; kept local to avoid a
// cross-theme relative import which would break if the parent path changes.
// ---------------------------------------------------------------------------

function ProductCard({ product, viewMode }) {
	const [activeThumb, setActiveThumb] = useState(0);
	const [wishlisted, setWishlisted] = useState(false);

	const allImages = [product.image, ...(product.gallery || [])].filter(Boolean);
	const currentImage = allImages[activeThumb] || product.image;
	const extraCount = allImages.length > 3 ? allImages.length - 3 : 0;

	const salePercent =
		product.on_sale && product.regular_price && product.sale_price
			? Math.round(
					((product.regular_price - product.sale_price) / product.regular_price) * 100,
				)
			: 0;

	return (
		<div className="sf__card">
			<div className="sf__card-image">
				<a href={product.permalink}>
					<img src={currentImage} alt={product.name} loading="lazy" />
				</a>

				{product.on_sale && salePercent > 0 && (
					<span className="sf__badge sf__badge--sale">{salePercent}% OFF</span>
				)}
				{product.on_sale && salePercent === 0 && (
					<span className="sf__badge sf__badge--sale">Sale</span>
				)}

				{product.stock_status === "outofstock" && (
					<span className="sf__badge sf__badge--oos">Sold Out</span>
				)}

				<button
					className={`sf__card-wish ${wishlisted ? "is-active" : ""}`}
					onClick={() => setWishlisted(!wishlisted)}
					type="button"
					aria-label="Add to wishlist"
				>
					<svg width="18" height="18" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
						<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
					</svg>
				</button>

				{allImages.length > 1 && (
					<div className="sf__card-thumbs">
						{allImages.slice(0, 3).map((img, idx) => (
							<button
								key={idx}
								className={`sf__card-thumb ${idx === activeThumb ? "is-active" : ""}`}
								onMouseEnter={() => setActiveThumb(idx)}
								onClick={() => setActiveThumb(idx)}
								type="button"
							>
								<img src={img} alt="" />
							</button>
						))}
						{extraCount > 0 && (
							<a href={product.permalink} className="sf__card-thumb sf__card-thumb--more">
								+{extraCount}
							</a>
						)}
					</div>
				)}
			</div>

			<div className="sf__card-info">
				{product.categories.length > 0 && (
					<span className="sf__card-cat">{product.categories[0].name}</span>
				)}

				<a href={product.permalink} className="sf__card-title">
					{product.name}
				</a>

				{product.average_rating > 0 && (
					<div className="sf__card-rating">
						<Stars rating={product.average_rating} />
						<span className="sf__card-rating-count">({product.rating_count})</span>
					</div>
				)}

				{product.sku && viewMode === "list" && (
					<span className="sf__card-sku">SKU: {product.sku}</span>
				)}

				{viewMode === "list" && product.short_description && (
					<p className="sf__card-desc">{product.short_description}</p>
				)}

				<div className="sf__card-pricing">
					<span
						className="sf__card-price"
						dangerouslySetInnerHTML={{ __html: product.price_html }}
					/>
				</div>

				<div className="sf__card-actions">
					{product.stock_status === "instock" && (
						<a
							href={product.add_to_cart_url}
							className="sf__card-btn"
							data-product-id={product.id}
						>
							<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
								<circle cx="9" cy="21" r="1" />
								<circle cx="20" cy="21" r="1" />
								<path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
							</svg>
							ADD TO CART
						</a>
					)}
					<button
						className={`sf__card-wish-sm ${wishlisted ? "is-active" : ""}`}
						onClick={() => setWishlisted(!wishlisted)}
						type="button"
						aria-label="Add to wishlist"
					>
						<svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
							<path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}

function Stars({ rating }) {
	const full = Math.floor(rating);
	const half = rating % 1 >= 0.5 ? 1 : 0;
	const empty = 5 - full - half;

	return (
		<span className="sf__stars">
			{"★".repeat(full)}
			{half ? "½" : ""}
			{"☆".repeat(empty)}
		</span>
	);
}
