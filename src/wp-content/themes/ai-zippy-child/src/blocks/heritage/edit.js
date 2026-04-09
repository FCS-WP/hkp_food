import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from "@wordpress/block-editor";
import {
	PanelBody,
	Button,
} from "@wordpress/components";

const ImageControl = ({
	index,
	imageId,
	imageUrl,
	imageAlt,
	setAttributes,
	label,
}) => {
	const prefix = `image${index}`;

	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={(media) =>
					setAttributes({
						[`${prefix}Id`]: media.id,
						[`${prefix}Url`]: media.url,
						[`${prefix}Alt`]: media.alt || "",
					})
				}
				allowedTypes={["image"]}
				value={imageId}
				render={({ open }) => (
					<div style={{ marginBottom: "16px" }}>
						<p style={{ marginBottom: "8px", fontWeight: 600 }}>
							{label}
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
						<div>
							<Button onClick={open} variant="secondary" size="small">
								{imageUrl
									? __("Replace", "ai-zippy-child")
									: __("Select Image", "ai-zippy-child")}
							</Button>
							{imageUrl && (
								<Button
									onClick={() =>
										setAttributes({
											[`${prefix}Id`]: 0,
											[`${prefix}Url`]: "",
											[`${prefix}Alt`]: "",
										})
									}
									variant="link"
									isDestructive
									size="small"
									style={{ marginLeft: "8px" }}
								>
									{__("Remove", "ai-zippy-child")}
								</Button>
							)}
						</div>
					</div>
				)}
			/>
		</MediaUploadCheck>
	);
};

export default function Edit({ attributes, setAttributes }) {
	const {
		image1Id,
		image1Url,
		image1Alt,
		image2Id,
		image2Url,
		image2Alt,
		heading,
		description,
	} = attributes;

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__("Images", "ai-zippy-child")}
					initialOpen={true}
				>
					<ImageControl
						index={1}
						imageId={image1Id}
						imageUrl={image1Url}
						imageAlt={image1Alt}
						setAttributes={setAttributes}
						label={__("Image 1 (Left/Back)", "ai-zippy-child")}
					/>
					<ImageControl
						index={2}
						imageId={image2Id}
						imageUrl={image2Url}
						imageAlt={image2Alt}
						setAttributes={setAttributes}
						label={__("Image 2 (Right/Front)", "ai-zippy-child")}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="heritage__container">
					{/* Left column - Images */}
					<div className="heritage__images">
						<div className="heritage__image-wrapper heritage__image-wrapper--1">
							{image1Url ? (
								<img
									src={image1Url}
									alt={image1Alt}
									className="heritage__image heritage__image--1"
								/>
							) : (
								<div className="heritage__image-placeholder">
									<span>{__("Select Image 1", "ai-zippy-child")}</span>
								</div>
							)}
						</div>
						<div className="heritage__image-wrapper heritage__image-wrapper--2">
							{image2Url ? (
								<img
									src={image2Url}
									alt={image2Alt}
									className="heritage__image heritage__image--2"
								/>
							) : (
								<div className="heritage__image-placeholder">
									<span>{__("Select Image 2", "ai-zippy-child")}</span>
								</div>
							)}
						</div>
					</div>

					{/* Right column - Content */}
					<div className="heritage__content">
						<RichText
							tagName="h2"
							className="heritage__heading"
							value={heading}
							onChange={(val) => setAttributes({ heading: val })}
							placeholder={__("A Singapore Favourite Since 1992", "ai-zippy-child")}
						/>

						<RichText
							tagName="p"
							className="heritage__description"
							value={description}
							onChange={(val) => setAttributes({ description: val })}
							placeholder={__(
								"From classic steamed buns to flavourful dim sum — authentic tastes made fresh, perfect for every meal and moment.",
								"ai-zippy-child"
							)}
						/>
					</div>
				</div>
			</div>
		</>
	);
}
