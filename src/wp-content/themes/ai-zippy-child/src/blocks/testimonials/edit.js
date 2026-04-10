import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, Button, TextControl } from "@wordpress/components";
import { useState } from "@wordpress/element";

const StarRating = ({ rating, onChange, readonly = false }) => {
	return (
		<div className={`testimonials__rating${readonly ? "" : "-input"}`}>
			{[1, 2, 3, 4, 5].map((star) => (
				<button
					key={star}
					type="button"
					className={star <= rating ? "is-active" : ""}
					onClick={() => !readonly && onChange && onChange(star)}
					disabled={readonly}
					aria-label={`${star} stars`}
				>
					★
				</button>
			))}
		</div>
	);
};

const ImagePicker = ({
	imageId,
	imageUrl,
	imageAlt,
	setAttributes,
	label,
	idKey,
	urlKey,
	altKey,
}) => (
	<MediaUploadCheck>
		<MediaUpload
			onSelect={(media) =>
				setAttributes({
					[idKey]: media.id,
					[urlKey]: media.url,
					[altKey]: media.alt || "",
				})
			}
			allowedTypes={["image"]}
			value={imageId}
			render={({ open }) => (
				<div>
					{label && <p style={{ marginBottom: "8px", fontWeight: 600 }}>{label}</p>}
					{imageUrl && (
						<img
							src={imageUrl}
							alt={imageAlt}
							style={{
								maxWidth: "100%",
								marginBottom: "8px",
								borderRadius: "8px",
							}}
						/>
					)}
					<Button onClick={open} variant="secondary">
						{imageUrl ? __("Replace Image", "ai-zippy-child") : __("Select Image", "ai-zippy-child")}
					</Button>
					{imageUrl && (
						<Button
							onClick={() =>
								setAttributes({
									[idKey]: 0,
									[urlKey]: "",
									[altKey]: "",
								})
							}
							variant="link"
							isDestructive
							style={{ marginLeft: "8px" }}
						>
							{__("Remove", "ai-zippy-child")}
						</Button>
					)}
				</div>
			)}
		/>
	</MediaUploadCheck>
);

export default function Edit({ attributes, setAttributes }) {
	const {
		heading,
		imageId,
		imageUrl,
		imageAlt,
		contentBackgroundImageId,
		contentBackgroundImageUrl,
		contentBackgroundImageAlt,
		testimonials,
	} = attributes;
	const [currentSlide, setCurrentSlide] = useState(0);

	const blockProps = useBlockProps();
	const contentStyle = contentBackgroundImageUrl
		? { backgroundImage: `url(${contentBackgroundImageUrl})` }
		: undefined;

	const updateTestimonial = (index, field, value) => {
		const newTestimonials = [...testimonials];
		newTestimonials[index] = {
			...newTestimonials[index],
			[field]: value,
		};
		setAttributes({ testimonials: newTestimonials });
	};

	const addTestimonial = () => {
		setAttributes({
			testimonials: [...testimonials, { quote: "", rating: 5, author: "" }],
		});
		setCurrentSlide(testimonials.length);
	};

	const removeTestimonial = (index) => {
		const newTestimonials = testimonials.filter((_, i) => i !== index);
		setAttributes({ testimonials: newTestimonials });
		if (currentSlide >= newTestimonials.length) {
			setCurrentSlide(Math.max(0, newTestimonials.length - 1));
		}
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Image", "ai-zippy-child")} initialOpen={true}>
					<ImagePicker
						imageId={imageId}
						imageUrl={imageUrl}
						imageAlt={imageAlt}
						setAttributes={setAttributes}
						idKey="imageId"
						urlKey="imageUrl"
						altKey="imageAlt"
					/>
				</PanelBody>

				<PanelBody title={__("Content Background", "ai-zippy-child")} initialOpen={false}>
					<ImagePicker
						imageId={contentBackgroundImageId}
						imageUrl={contentBackgroundImageUrl}
						imageAlt={contentBackgroundImageAlt}
						setAttributes={setAttributes}
						label={__("Content Background Image", "ai-zippy-child")}
						idKey="contentBackgroundImageId"
						urlKey="contentBackgroundImageUrl"
						altKey="contentBackgroundImageAlt"
					/>
				</PanelBody>

				<PanelBody title={__(`Testimonial ${currentSlide + 1} of ${testimonials.length}`, "ai-zippy-child")} initialOpen={true}>
					<div className="testimonials__slide-editor">
						<TextControl
							label={__("Author Name", "ai-zippy-child")}
							value={testimonials[currentSlide]?.author || ""}
							onChange={(val) => updateTestimonial(currentSlide, "author", val)}
						/>
						<p style={{ marginBottom: "4px" }}>{__("Rating", "ai-zippy-child")}</p>
						<StarRating
							rating={testimonials[currentSlide]?.rating || 5}
							onChange={(val) => updateTestimonial(currentSlide, "rating", val)}
						/>
						<RichText
							tagName="div"
							label={__("Quote", "ai-zippy-child")}
							value={testimonials[currentSlide]?.quote || ""}
							onChange={(val) => updateTestimonial(currentSlide, "quote", val)}
							placeholder={__("Enter testimonial quote...", "ai-zippy-child")}
							style={{
								minHeight: "100px",
								padding: "8px",
								border: "1px solid #ddd",
								borderRadius: "4px",
								marginTop: "8px",
							}}
						/>
						<div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
							<Button
								onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
								disabled={currentSlide === 0}
								variant="secondary"
								size="small"
							>
								← {__("Prev", "ai-zippy-child")}
							</Button>
							<Button
								onClick={() => setCurrentSlide(Math.min(testimonials.length - 1, currentSlide + 1))}
								disabled={currentSlide === testimonials.length - 1}
								variant="secondary"
								size="small"
							>
								{__("Next", "ai-zippy-child")} →
							</Button>
							<Button
								onClick={() => removeTestimonial(currentSlide)}
								variant="link"
								isDestructive
								size="small"
								disabled={testimonials.length <= 1}
							>
								{__("Remove", "ai-zippy-child")}
							</Button>
						</div>
					</div>
				</PanelBody>

				<PanelBody title={__("Add Testimonial", "ai-zippy-child")} initialOpen={false}>
					<Button onClick={addTestimonial} variant="primary">
						{__("+ Add New Testimonial", "ai-zippy-child")}
					</Button>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="testimonials__container">
					<div className="testimonials__image-col">
						{imageUrl ? (
							<img src={imageUrl} alt={imageAlt} className="testimonials__image" />
						) : (
							<div className="testimonials__image-placeholder">
								<span>{__("Select an image in the sidebar", "ai-zippy-child")}</span>
							</div>
						)}
					</div>

					<div className="testimonials__content-col" style={contentStyle}>
						<RichText
							tagName="h2"
							className="testimonials__heading"
							value={heading}
							onChange={(val) => setAttributes({ heading: val })}
							placeholder={__("Happy Customers", "ai-zippy-child")}
						/>

						<div className="testimonials__slider">
							{testimonials.length > 0 && (
								<div className="testimonials__slide">
									<p className="testimonials__quote">{testimonials[currentSlide]?.quote}</p>
									<StarRating rating={testimonials[currentSlide]?.rating || 5} readonly />
									<p className="testimonials__author">{testimonials[currentSlide]?.author}</p>
								</div>
							)}

							{testimonials.length > 1 && (
								<div className="testimonials__nav">
									<button
										className="testimonials__nav-btn testimonials__nav-btn--prev"
										onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
										disabled={currentSlide === 0}
										aria-label={__("Previous testimonial", "ai-zippy-child")}
									>
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<polyline points="15 18 9 12 15 6" />
										</svg>
									</button>
									<button
										className="testimonials__nav-btn testimonials__nav-btn--next"
										onClick={() => setCurrentSlide(Math.min(testimonials.length - 1, currentSlide + 1))}
										disabled={currentSlide === testimonials.length - 1}
										aria-label={__("Next testimonial", "ai-zippy-child")}
									>
										<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<polyline points="9 18 15 12 9 6" />
										</svg>
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
