import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	MediaUpload,
	MediaUploadCheck,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	TextControl,
	Notice,
} from '@wordpress/components';
import './editor.scss';

const IconUploader = ( { id, url, alt, label, onSelect } ) => (
	<div className="site-header-editor__icon-uploader">
		<p className="site-header-editor__label">{ label }</p>
		<MediaUploadCheck>
			<MediaUpload
				onSelect={ onSelect }
				allowedTypes={ [ 'image' ] }
				value={ id }
				render={ ( { open } ) => (
					<div className="site-header-editor__icon-thumb" onClick={ open }>
						{ url ? (
							<img src={ url } alt={ alt } />
						) : (
							<span>{ __( '+ Upload', 'ai-zippy-child' ) }</span>
						) }
					</div>
				) }
			/>
		</MediaUploadCheck>
	</div>
);

export default function Edit( { attributes, setAttributes } ) {
	const {
		logoId,
		logoUrl,
		logoAlt,
		searchIconId,
		searchIconUrl,
		searchIconAlt,
		cartIconId,
		cartIconUrl,
		cartIconAlt,
		accountIconId,
		accountIconUrl,
		accountIconAlt,
		cartUrl,
		accountUrl,
		searchUrl,
	} = attributes;

	const blockProps = useBlockProps( { className: 'site-header site-header--editor-preview' } );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Logo', 'ai-zippy-child' ) } initialOpen={ true }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									logoId: media.id,
									logoUrl: media.url,
									logoAlt: media.alt || logoAlt,
								} )
							}
							allowedTypes={ [ 'image' ] }
							value={ logoId }
							render={ ( { open } ) => (
								<div>
									<div className="site-header-editor__logo-thumb" onClick={ open }>
										{ logoUrl ? (
											<img src={ logoUrl } alt={ logoAlt } />
										) : (
											<span>{ __( '+ Upload Logo', 'ai-zippy-child' ) }</span>
										) }
									</div>
									<div style={ { marginTop: '12px' } }>
										<Button variant="secondary" onClick={ open }>
											{ logoUrl ? __( 'Replace Logo', 'ai-zippy-child' ) : __( 'Select Logo', 'ai-zippy-child' ) }
										</Button>
									</div>
								</div>
							) }
						/>
					</MediaUploadCheck>
					<TextControl
						label={ __( 'Logo Alt Text', 'ai-zippy-child' ) }
						value={ logoAlt }
						onChange={ ( value ) => setAttributes( { logoAlt: value } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Navigation Menu', 'ai-zippy-child' ) } initialOpen={ false }>
					<Notice status="info" isDismissible={ false }>
						{ __( 'This header now uses the WordPress Navigation menu from Appearance → Editor → Navigation. Manage menu items there instead of in this block.', 'ai-zippy-child' ) }
					</Notice>
				</PanelBody>

				<PanelBody title={ __( 'Action Icons', 'ai-zippy-child' ) } initialOpen={ false }>
					<div className="site-header-editor__icons-row">
						<IconUploader
							id={ searchIconId }
							url={ searchIconUrl }
							alt={ searchIconAlt }
							label={ __( 'Search Icon', 'ai-zippy-child' ) }
							onSelect={ ( media ) =>
								setAttributes( {
									searchIconId: media.id,
									searchIconUrl: media.url,
									searchIconAlt: media.alt || searchIconAlt,
								} )
							}
						/>
						<IconUploader
							id={ cartIconId }
							url={ cartIconUrl }
							alt={ cartIconAlt }
							label={ __( 'Cart Icon', 'ai-zippy-child' ) }
							onSelect={ ( media ) =>
								setAttributes( {
									cartIconId: media.id,
									cartIconUrl: media.url,
									cartIconAlt: media.alt || cartIconAlt,
								} )
							}
						/>
						<IconUploader
							id={ accountIconId }
							url={ accountIconUrl }
							alt={ accountIconAlt }
							label={ __( 'Account Icon', 'ai-zippy-child' ) }
							onSelect={ ( media ) =>
								setAttributes( {
									accountIconId: media.id,
									accountIconUrl: media.url,
									accountIconAlt: media.alt || accountIconAlt,
								} )
							}
						/>
					</div>
					<TextControl
						label={ __( 'Search URL', 'ai-zippy-child' ) }
						value={ searchUrl }
						onChange={ ( val ) => setAttributes( { searchUrl: val } ) }
					/>
					<TextControl
						label={ __( 'Cart URL', 'ai-zippy-child' ) }
						value={ cartUrl }
						onChange={ ( val ) => setAttributes( { cartUrl: val } ) }
					/>
					<TextControl
						label={ __( 'Account URL', 'ai-zippy-child' ) }
						value={ accountUrl }
						onChange={ ( val ) => setAttributes( { accountUrl: val } ) }
					/>
				</PanelBody>
			</InspectorControls>

			<header { ...blockProps }>
				<div className="site-header__inner">
					<div className="site-header__logo-wrap">
						<div className="site-header__logo-link">
							{ logoUrl ? (
								<img src={ logoUrl } alt={ logoAlt } className="site-header__logo" />
							) : (
								<div className="site-header-editor__logo-thumb">
									<span>{ __( 'Logo', 'ai-zippy-child' ) }</span>
								</div>
							) }
						</div>
					</div>

					<button type="button" className="site-header__menu-toggle" aria-label={ __( 'Open menu', 'ai-zippy-child' ) }>
						<span></span>
						<span></span>
						<span></span>
					</button>

					<nav className="site-header__nav" aria-label={ __( 'Main Navigation', 'ai-zippy-child' ) }>
						<span className="site-header__nav-link">{ __( 'Navigation menu preview', 'ai-zippy-child' ) }</span>
					</nav>

					<div className="site-header__actions">
						{ searchIconUrl && (
							<button type="button" className="site-header__action-link site-header__search-toggle" aria-label={ searchIconAlt }>
								<img src={ searchIconUrl } alt={ searchIconAlt } className="site-header__action-icon" />
							</button>
						) }

						{ cartIconUrl && (
							<div className="site-header__action-link site-header__action-link--cart" aria-label={ cartIconAlt }>
								<img src={ cartIconUrl } alt={ cartIconAlt } className="site-header__action-icon" />
								<span className="site-header__cart-badge" data-cart-count>
									2
								</span>
							</div>
						) }

						{ accountIconUrl && (
							<button type="button" className="site-header__action-link site-header__account-toggle" aria-label={ accountIconAlt }>
								<img src={ accountIconUrl } alt={ accountIconAlt } className="site-header__action-icon" />
							</button>
						) }
					</div>
				</div>
			</header>
		</>
	);
}
