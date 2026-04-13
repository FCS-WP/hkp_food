import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, Button } from "@wordpress/components";

function ImageControl({ imageId, imageUrl, imageAlt, setAttributes }) {
	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={(media) =>
					setAttributes({
						imageId: media.id,
						imageUrl: media.url,
						imageAlt: media.alt || "",
					})
				}
				allowedTypes={["image"]}
				value={imageId}
				render={({ open }) => (
					<div>
						<p style={{ marginBottom: "8px", fontWeight: 600 }}>
							{__("Story Image", "ai-zippy-child")}
						</p>
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
							{imageUrl
								? __("Replace Image", "ai-zippy-child")
								: __("Select Image", "ai-zippy-child")}
						</Button>
						{imageUrl && (
							<Button
								onClick={() =>
									setAttributes({
										imageId: 0,
										imageUrl: "",
										imageAlt: "",
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
}

export default function Edit({ attributes, setAttributes }) {
	const { imageId, imageUrl, imageAlt, heading, paragraphOne, paragraphTwo, paragraphThree } =
		attributes;

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Image Settings", "ai-zippy-child")} initialOpen={true}>
					<ImageControl
						imageId={imageId}
						imageUrl={imageUrl}
						imageAlt={imageAlt}
						setAttributes={setAttributes}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="our-story__container">
					<div className="our-story__media">
						{imageUrl ? (
							<img src={imageUrl} alt={imageAlt} className="our-story__image" />
						) : (
							<div className="our-story__image-placeholder">
								<span>{__("Select an image in the sidebar", "ai-zippy-child")}</span>
							</div>
						)}
					</div>

					<div className="our-story__content">
						<RichText
							tagName="h2"
							className="our-story__heading"
							value={heading}
							onChange={(value) => setAttributes({ heading: value })}
							placeholder={__("Our Story heading", "ai-zippy-child")}
						/>

						<RichText
							tagName="p"
							className="our-story__paragraph"
							value={paragraphOne}
							onChange={(value) => setAttributes({ paragraphOne: value })}
							placeholder={__("First paragraph", "ai-zippy-child")}
						/>

						<RichText
							tagName="p"
							className="our-story__paragraph"
							value={paragraphTwo}
							onChange={(value) => setAttributes({ paragraphTwo: value })}
							placeholder={__("Second paragraph", "ai-zippy-child")}
						/>

						<RichText
							tagName="p"
							className="our-story__paragraph"
							value={paragraphThree}
							onChange={(value) => setAttributes({ paragraphThree: value })}
							placeholder={__("Third paragraph", "ai-zippy-child")}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
