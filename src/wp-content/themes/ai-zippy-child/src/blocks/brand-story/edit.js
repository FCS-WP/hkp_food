import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from "@wordpress/block-editor";
import { PanelBody, Button } from "@wordpress/components";

const ImagePicker = ({
	imageId,
	imageUrl,
	imageAlt,
	setAttributes,
	label,
	idKey,
	urlKey,
	altKey,
	previewStyle = {},
	selectLabel,
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
								...previewStyle,
							}}
						/>
					)}
					<Button onClick={open} variant="secondary">
						{imageUrl
							? __("Replace Image", "ai-zippy-child")
							: selectLabel || __("Select Image", "ai-zippy-child")}
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
		iconId,
		iconUrl,
		iconAlt,
		heading,
		description,
		imageUrl,
		imageId,
		imageAlt,
		contentBackgroundImageId,
		contentBackgroundImageUrl,
		contentBackgroundImageAlt,
	} = attributes;

	const blockProps = useBlockProps();
	const contentStyle = contentBackgroundImageUrl
		? { backgroundImage: `url(${contentBackgroundImageUrl})` }
		: undefined;

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Icon Settings", "ai-zippy-child")} initialOpen={true}>
					<ImagePicker
						imageId={iconId}
						imageUrl={iconUrl}
						imageAlt={iconAlt}
						setAttributes={setAttributes}
						idKey="iconId"
						urlKey="iconUrl"
						altKey="iconAlt"
						selectLabel={__("Select Icon Image", "ai-zippy-child")}
						previewStyle={{ maxWidth: "100px" }}
					/>
				</PanelBody>

				<PanelBody title={__("Image Settings", "ai-zippy-child")} initialOpen={true}>
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
			</InspectorControls>

			<div {...blockProps}>
				<div className="brand-story__container">
					<div className="brand-story__content" style={contentStyle}>
						<div className="brand-story__icon-wrapper">
							{iconUrl ? (
								<img src={iconUrl} alt={iconAlt} className="brand-story__icon-img" />
							) : (
								<div className="brand-story__icon-placeholder">
									<span>{__("Select an icon image", "ai-zippy-child")}</span>
								</div>
							)}
						</div>

						<RichText
							tagName="h2"
							className="brand-story__heading"
							value={heading}
							onChange={(val) => setAttributes({ heading: val })}
							placeholder={__("Handmade Goodness in Every Bite", "ai-zippy-child")}
						/>

						<RichText
							tagName="p"
							className="brand-story__description"
							value={description}
							onChange={(val) => setAttributes({ description: val })}
							placeholder={__(
								"Since 1992, Ho Kee Pau has been serving Singapore handmade buns, dim sum, and local favourites that everyone loves.",
								"ai-zippy-child"
							)}
						/>
					</div>

					<div className="brand-story__media">
						{imageUrl ? (
							<img src={imageUrl} alt={imageAlt} className="brand-story__image" />
						) : (
							<div className="brand-story__image-placeholder">
								<span>{__("Select an image in the sidebar", "ai-zippy-child")}</span>
							</div>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
