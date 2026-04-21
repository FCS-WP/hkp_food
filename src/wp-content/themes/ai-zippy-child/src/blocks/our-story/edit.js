import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	MediaUpload,
	MediaUploadCheck,
	InnerBlocks,
	InspectorControls,
} from "@wordpress/block-editor";
import { Button, PanelBody, RangeControl } from "@wordpress/components";

const TEMPLATE = [
	[ "core/heading", { level: 2, placeholder: __( "Our Story heading", "ai-zippy-child" ), className: "our-story__heading" } ],
	[ "core/paragraph", { placeholder: __( "First paragraph…", "ai-zippy-child" ), className: "our-story__paragraph" } ],
	[ "core/paragraph", { placeholder: __( "Second paragraph…", "ai-zippy-child" ), className: "our-story__paragraph" } ],
	[ "core/paragraph", { placeholder: __( "Third paragraph…", "ai-zippy-child" ), className: "our-story__paragraph" } ],
];

export default function Edit({ attributes, setAttributes }) {
	const { imageId, imageUrl, imageAlt, leftWidth, rightWidth } = attributes;

	const blockProps = useBlockProps({
		style: {
			"--os-left-width": `${leftWidth}%`,
			"--os-right-width": `${rightWidth}%`,
		},
	});

	return (
		<>
			<InspectorControls>
				<PanelBody title={__( "Column Widths", "ai-zippy-child" )} initialOpen={true}>
					<RangeControl
						label={__( "Left column (%)", "ai-zippy-child" )}
						value={leftWidth}
						onChange={( val ) => setAttributes({ leftWidth: val, rightWidth: 100 - val })}
						min={10}
						max={90}
						step={5}
					/>
					<RangeControl
						label={__( "Right column (%)", "ai-zippy-child" )}
						value={rightWidth}
						onChange={( val ) => setAttributes({ rightWidth: val, leftWidth: 100 - val })}
						min={10}
						max={90}
						step={5}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				<div className="our-story__container">

					{/* Left column — inline image picker */}
					<div className="our-story__media">
						<MediaUploadCheck>
							<MediaUpload
								onSelect={( media ) =>
									setAttributes({
										imageId: media.id,
										imageUrl: media.url,
										imageAlt: media.alt || "",
									})
								}
								allowedTypes={[ "image" ]}
								value={imageId}
								render={({ open }) =>
									imageUrl ? (
										<div className="our-story__image-wrap">
											<img
												src={imageUrl}
												alt={imageAlt}
												className="our-story__image"
											/>
											<div className="our-story__image-actions">
												<Button onClick={open} variant="secondary" size="small">
													{__( "Replace", "ai-zippy-child" )}
												</Button>
												<Button
													onClick={() =>
														setAttributes({ imageId: 0, imageUrl: "", imageAlt: "" })
													}
													variant="secondary"
													size="small"
													isDestructive
												>
													{__( "Remove", "ai-zippy-child" )}
												</Button>
											</div>
										</div>
									) : (
										<button
											type="button"
											className="our-story__image-placeholder"
											onClick={open}
										>
											<span>{__( "Click to select image", "ai-zippy-child" )}</span>
										</button>
									)
								}
							/>
						</MediaUploadCheck>
					</div>

					{/* Right column — free-form InnerBlocks */}
					<div className="our-story__content">
						<InnerBlocks
							template={TEMPLATE}
							templateLock={false}
						/>
					</div>

				</div>
			</div>
		</>
	);
}
