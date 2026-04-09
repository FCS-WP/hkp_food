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

const FeatureItem = ({
	index,
	iconId,
	iconUrl,
	iconAlt,
	heading,
	description,
	setAttributes,
}) => {
	const prefix = `feature${index}`;

	return (
		<div className="features__item">
			<div className="features__icon-wrapper">
				{iconUrl ? (
					<img
						src={iconUrl}
						alt={iconAlt}
						className="features__icon"
					/>
				) : (
					<div className="features__icon-placeholder">
						<span>{__("Icon", "ai-zippy-child")}</span>
					</div>
				)}
			</div>

			<RichText
				tagName="h3"
				className="features__heading"
				value={heading}
				onChange={(val) => setAttributes({ [`${prefix}Heading`]: val })}
				placeholder={__("Heading", "ai-zippy-child")}
			/>

			<RichText
				tagName="p"
				className="features__description"
				value={description}
				onChange={(val) => setAttributes({ [`${prefix}Description`]: val })}
				placeholder={__("Description", "ai-zippy-child")}
			/>
		</div>
	);
};

const IconControl = ({
	index,
	iconId,
	iconUrl,
	iconAlt,
	setAttributes,
}) => {
	const prefix = `feature${index}`;

	return (
		<MediaUploadCheck>
			<MediaUpload
				onSelect={(media) =>
					setAttributes({
						[`${prefix}IconId`]: media.id,
						[`${prefix}IconUrl`]: media.url,
						[`${prefix}IconAlt`]: media.alt || "",
					})
				}
				allowedTypes={["image"]}
				value={iconId}
				render={({ open }) => (
					<div style={{ marginBottom: "16px" }}>
						<p style={{ marginBottom: "8px", fontWeight: 600 }}>
							{__(`Feature ${index} Icon`, "ai-zippy-child")}
						</p>
						{iconUrl && (
							<img
								src={iconUrl}
								alt={iconAlt}
								style={{
									width: "64px",
									height: "64px",
									objectFit: "cover",
									borderRadius: "50%",
									marginBottom: "8px",
								}}
							/>
						)}
						<div>
							<Button onClick={open} variant="secondary" size="small">
								{iconUrl
									? __("Replace", "ai-zippy-child")
									: __("Select Icon", "ai-zippy-child")}
							</Button>
							{iconUrl && (
								<Button
									onClick={() =>
										setAttributes({
											[`${prefix}IconId`]: 0,
											[`${prefix}IconUrl`]: "",
											[`${prefix}IconAlt`]: "",
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
	const blockProps = useBlockProps();

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={__("Feature 1", "ai-zippy-child")}
					initialOpen={true}
				>
					<IconControl
						index={1}
						iconId={attributes.feature1IconId}
						iconUrl={attributes.feature1IconUrl}
						iconAlt={attributes.feature1IconAlt}
						setAttributes={setAttributes}
					/>
				</PanelBody>

				<PanelBody
					title={__("Feature 2", "ai-zippy-child")}
					initialOpen={false}
				>
					<IconControl
						index={2}
						iconId={attributes.feature2IconId}
						iconUrl={attributes.feature2IconUrl}
						iconAlt={attributes.feature2IconAlt}
						setAttributes={setAttributes}
					/>
				</PanelBody>

				<PanelBody
					title={__("Feature 3", "ai-zippy-child")}
					initialOpen={false}
				>
					<IconControl
						index={3}
						iconId={attributes.feature3IconId}
						iconUrl={attributes.feature3IconUrl}
						iconAlt={attributes.feature3IconAlt}
						setAttributes={setAttributes}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="features__container">
					<FeatureItem
						index={1}
						iconId={attributes.feature1IconId}
						iconUrl={attributes.feature1IconUrl}
						iconAlt={attributes.feature1IconAlt}
						heading={attributes.feature1Heading}
						description={attributes.feature1Description}
						setAttributes={setAttributes}
					/>

					<div className="features__divider" />

					<FeatureItem
						index={2}
						iconId={attributes.feature2IconId}
						iconUrl={attributes.feature2IconUrl}
						iconAlt={attributes.feature2IconAlt}
						heading={attributes.feature2Heading}
						description={attributes.feature2Description}
						setAttributes={setAttributes}
					/>

					<div className="features__divider" />

					<FeatureItem
						index={3}
						iconId={attributes.feature3IconId}
						iconUrl={attributes.feature3IconUrl}
						iconAlt={attributes.feature3IconAlt}
						heading={attributes.feature3Heading}
						description={attributes.feature3Description}
						setAttributes={setAttributes}
					/>
				</div>
			</div>
		</>
	);
}
