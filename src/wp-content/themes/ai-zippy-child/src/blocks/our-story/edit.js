import { __ } from "@wordpress/i18n";
import {
	useBlockProps,
	MediaPlaceholder,
	MediaReplaceFlow,
	BlockControls,
	InnerBlocks,
	InspectorControls,
} from "@wordpress/block-editor";
import {
	Button,
	PanelBody,
	RangeControl,
	ToolbarGroup,
	ToolbarButton,
} from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import apiFetch from "@wordpress/api-fetch";

const TEMPLATE = [
	[ "core/heading", { level: 2, placeholder: __( "Our Story heading", "ai-zippy-child" ), className: "our-story__heading" } ],
	[ "core/paragraph", { placeholder: __( "First paragraph…", "ai-zippy-child" ), className: "our-story__paragraph" } ],
	[ "core/paragraph", { placeholder: __( "Second paragraph…", "ai-zippy-child" ), className: "our-story__paragraph" } ],
	[ "core/paragraph", { placeholder: __( "Third paragraph…", "ai-zippy-child" ), className: "our-story__paragraph" } ],
];

export default function Edit({ attributes, setAttributes }) {
	const { imageId, imageUrl, imageAlt, leftWidth, rightWidth } = attributes;

	// Check whether the stored attachment still exists in the media library.
	// If the file was deleted from uploads, we want to fall back to the picker UI.
	const [ imageMissing, setImageMissing ] = useState( false );

	useEffect(() => {
		if ( ! imageId ) {
			setImageMissing( false );
			return;
		}

		let cancelled = false;
		apiFetch( { path: `/wp/v2/media/${ imageId }` } )
			.then(() => { if ( ! cancelled ) setImageMissing( false ); })
			.catch(( err ) => {
				if ( cancelled ) return;
				if ( err && ( err.code === "rest_post_invalid_id" || err.code === "rest_not_found" || err.status === 404 ) ) {
					setImageMissing( true );
				}
			});

		return () => { cancelled = true; };
	}, [ imageId ]);

	const onSelectImage = ( media ) => {
		if ( ! media || ! media.url ) {
			return;
		}
		setAttributes({
			imageId: media.id,
			imageUrl: media.url,
			imageAlt: media.alt || "",
		});
		setImageMissing( false );
	};

	const onRemoveImage = () => {
		setAttributes({ imageId: 0, imageUrl: "", imageAlt: "" });
		setImageMissing( false );
	};

	const hasUsableImage = !! imageUrl && ! imageMissing;

	const blockProps = useBlockProps({
		style: {
			"--os-left-width": `${leftWidth}%`,
			"--os-right-width": `${rightWidth}%`,
		},
	});

	return (
		<>
			{ hasUsableImage && (
				<BlockControls>
					<ToolbarGroup>
						<MediaReplaceFlow
							mediaId={imageId}
							mediaURL={imageUrl}
							allowedTypes={[ "image" ]}
							accept="image/*"
							onSelect={onSelectImage}
							name={__( "Replace", "ai-zippy-child" )}
						/>
						<ToolbarButton
							icon="trash"
							label={__( "Remove image", "ai-zippy-child" )}
							onClick={onRemoveImage}
						/>
					</ToolbarGroup>
				</BlockControls>
			) }

			<InspectorControls>
				<PanelBody title={__( "Image", "ai-zippy-child" )} initialOpen={true}>
					{ imageMissing && (
						<p style={{ color: "#cc1818", margin: "0 0 12px" }}>
							{__( "The previously selected image is no longer in the media library. Choose a new image below.", "ai-zippy-child" )}
						</p>
					) }
					<MediaReplaceFlow
						mediaId={imageId}
						mediaURL={imageUrl}
						allowedTypes={[ "image" ]}
						accept="image/*"
						onSelect={onSelectImage}
						name={ hasUsableImage
							? __( "Replace image", "ai-zippy-child" )
							: __( "Select image", "ai-zippy-child" ) }
					/>
					{ hasUsableImage && (
						<Button
							onClick={onRemoveImage}
							variant="secondary"
							isDestructive
							style={{ marginTop: 8 }}
						>
							{__( "Remove image", "ai-zippy-child" )}
						</Button>
					) }
				</PanelBody>
				<PanelBody title={__( "Column Widths", "ai-zippy-child" )} initialOpen={false}>
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

					{/* Left column — image picker */}
					<div className="our-story__media">
						{ hasUsableImage ? (
							<img
								src={imageUrl}
								alt={imageAlt}
								className="our-story__image"
							/>
						) : (
							<MediaPlaceholder
								icon="format-image"
								labels={{
									title: __( "Our Story image", "ai-zippy-child" ),
									instructions: imageMissing
										? __( "The previously selected image was deleted. Upload a new one or pick from the media library.", "ai-zippy-child" )
										: __( "Upload an image or pick one from your media library.", "ai-zippy-child" ),
								}}
								onSelect={onSelectImage}
								accept="image/*"
								allowedTypes={[ "image" ]}
							/>
						) }
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
