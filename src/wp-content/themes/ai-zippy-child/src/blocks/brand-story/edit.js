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
	} = attributes;

	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__("Icon Settings", "ai-zippy-child")}
					initialOpen={true}
				>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={(media) =>
								setAttributes({
									iconId: media.id,
									iconUrl: media.url,
									iconAlt: media.alt || "",
								})
							}
							allowedTypes={["image"]}
							value={iconId}
							render={({ open }) => (
								<div>
									{iconUrl && (
										<img
											src={iconUrl}
											alt={iconAlt}
											style={{
												maxWidth: "100px",
												marginBottom: "8px",
												borderRadius: "8px",
											}}
										/>
									)}
									<Button onClick={open} variant="secondary">
										{iconUrl
											? __("Replace Icon", "ai-zippy-child")
											: __("Select Icon Image", "ai-zippy-child")}
									</Button>
									{iconUrl && (
										<Button
											onClick={() =>
												setAttributes({
													iconId: 0,
													iconUrl: "",
													iconAlt: "",
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
				</PanelBody>

				<PanelBody
					title={__("Image Settings", "ai-zippy-child")}
					initialOpen={true}
				>
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
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="brand-story__container">
					{/* Left column - Content */}
					<div className="brand-story__content">
						<div className="brand-story__icon-wrapper">
							{iconUrl ? (
								<img
									src={iconUrl}
									alt={iconAlt}
									className="brand-story__icon-img"
								/>
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

					{/* Right column - Image */}
					<div className="brand-story__media">
						{imageUrl ? (
							<img
								src={imageUrl}
								alt={imageAlt}
								className="brand-story__image"
							/>
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
