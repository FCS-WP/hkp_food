import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	RichText,
	InspectorControls,
} from "@wordpress/block-editor";
import {
	PanelBody,
	TextControl,
	FormTokenField,
} from "@wordpress/components";
import { useSelect } from "@wordpress/data";
import { useState, useEffect } from "@wordpress/element";

export default function Edit({ attributes, setAttributes }) {
	const {
		heading,
		description,
		productIds,
		buttonText,
		buttonUrl,
	} = attributes;

	const blockProps = useBlockProps();

	// Fetch products for the token field suggestions
	const products = useSelect((select) => {
		const { getEntityRecords } = select("core");
		return getEntityRecords("postType", "product", {
			per_page: 50,
			_status: "publish",
		});
	}, []);

	// Create product suggestions map
	const productMap = {};
	const productNames = [];
	if (products) {
		products.forEach((product) => {
			productMap[product.title.rendered] = product.id;
			productNames.push(product.title.rendered);
		});
	}

	// Convert product IDs to names for display
	const [selectedNames, setSelectedNames] = useState([]);

	useEffect(() => {
		if (products && productIds.length > 0) {
			const names = productIds
				.map((id) => {
					const product = products.find((p) => p.id === id);
					return product ? product.title.rendered : null;
				})
				.filter(Boolean);
			setSelectedNames(names);
		}
	}, [products, productIds]);

	const handleProductChange = (newNames) => {
		setSelectedNames(newNames);
		const newIds = newNames
			.map((name) => productMap[name])
			.filter((id) => id !== undefined);
		setAttributes({ productIds: newIds });
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__("Products", "ai-zippy-child")}
					initialOpen={true}
				>
					<FormTokenField
						label={__("Select Products", "ai-zippy-child")}
						value={selectedNames}
						suggestions={productNames}
						onChange={handleProductChange}
						placeholder={__("Type product name...", "ai-zippy-child")}
						help={__("Select up to 4 products to display", "ai-zippy-child")}
						maxLength={4}
					/>
				</PanelBody>

				<PanelBody
					title={__("Button", "ai-zippy-child")}
					initialOpen={false}
				>
					<TextControl
						label={__("Button Text", "ai-zippy-child")}
						value={buttonText}
						onChange={(val) => setAttributes({ buttonText: val })}
					/>
					<TextControl
						label={__("Button URL", "ai-zippy-child")}
						value={buttonUrl}
						onChange={(val) => setAttributes({ buttonUrl: val })}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="product-showcase__container">
					{/* Header */}
					<div className="product-showcase__header">
						<RichText
							tagName="h2"
							className="product-showcase__heading"
							value={heading}
							onChange={(val) => setAttributes({ heading: val })}
							placeholder={__("Explore Our Favourites", "ai-zippy-child")}
						/>
						<RichText
							tagName="p"
							className="product-showcase__description"
							value={description}
							onChange={(val) => setAttributes({ description: val })}
							placeholder={__(
								"A selection of our most-loved paus and dim sum...",
								"ai-zippy-child"
							)}
						/>
					</div>

					{/* Products Grid */}
					<div className="product-showcase__grid">
						{productIds.length > 0 ? (
							productIds.map((productId, index) => (
								<ProductPreview
									key={productId}
									productId={productId}
									index={index}
								/>
							))
						) : (
							<div className="product-showcase__product-placeholder">
								<div className="product-showcase__product-placeholder-image" />
								<p>{__("Select products in the sidebar", "ai-zippy-child")}</p>
							</div>
						)}
					</div>

					{/* CTA Button */}
					<div className="product-showcase__cta">
						<RichText
							tagName="span"
							className="product-showcase__button"
							value={buttonText}
							onChange={(val) => setAttributes({ buttonText: val })}
							placeholder={__("Shop Now", "ai-zippy-child")}
						/>
					</div>
				</div>
			</div>
		</>
	);
}

function ProductPreview({ productId, index }) {
	const product = useSelect(
		(select) => {
			const { getEntityRecord } = select("core");
			return getEntityRecord("postType", "product", productId);
		},
		[productId]
	);

	if (!product) {
		return (
			<div className="product-showcase__product-placeholder">
				<div className="product-showcase__product-placeholder-image" />
				<p>{__("Loading...", "ai-zippy-child")}</p>
			</div>
		);
	}

	const title = product.title.rendered;
	const excerpt = product.excerpt?.rendered
		?.replace(/<[^>]+>/g, "")
		?.substring(0, 120) + "...";

	return (
		<div className="product-showcase__product">
			<div className="product-showcase__product-image-wrapper">
				<div className="product-showcase__product-image-placeholder" />
			</div>
			<h3 className="product-showcase__product-title">{title}</h3>
			{excerpt && (
				<p className="product-showcase__product-excerpt">{excerpt}</p>
			)}
		</div>
	);
}
