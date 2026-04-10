import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { heading } = attributes;
	const blockProps = useBlockProps( { className: 'store-locator' } );

	return (
		<div { ...blockProps }>
			<RichText
				tagName="h2"
				className="store-locator__heading"
				value={ heading }
				onChange={ ( value ) => setAttributes( { heading: value } ) }
				placeholder={ __( 'Enter heading…', 'ai-zippy-child' ) }
			/>
			<div className="store-locator__map-wrapper">
				<div className="store-locator__placeholder">
					<span className="dashicons dashicons-location"></span>
					<p>{ __( '[ASL_STORELOCATOR] — Store locator will render on the frontend.', 'ai-zippy-child' ) }</p>
				</div>
			</div>
		</div>
	);
}
