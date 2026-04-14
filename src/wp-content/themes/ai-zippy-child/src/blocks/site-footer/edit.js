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
	TextareaControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const {
		address,
		email,
		phone,
		logoId,
		logoUrl,
		logoAlt,
		socialIcons,
		navLinks,
	} = attributes;

	const blockProps = useBlockProps( { className: 'site-footer site-footer--editor-preview' } );

	const updateSocialIcon = ( index, key, value ) => {
		const updated = socialIcons.map( ( item, i ) =>
			i === index ? { ...item, [ key ]: value } : item
		);
		setAttributes( { socialIcons: updated } );
	};

	const updateNavLink = ( index, key, value ) => {
		const updated = navLinks.map( ( item, i ) =>
			i === index ? { ...item, [ key ]: value } : item
		);
		setAttributes( { navLinks: updated } );
	};

	const addNavLink = () => {
		setAttributes( { navLinks: [ ...navLinks, { label: 'New Link', url: '#' } ] } );
	};

	const removeNavLink = ( index ) => {
		setAttributes( { navLinks: navLinks.filter( ( _, i ) => i !== index ) } );
	};

	const addSocialIcon = () => {
		setAttributes( {
			socialIcons: [ ...socialIcons, { url: '#', imageId: 0, imageUrl: '', imageAlt: '' } ],
		} );
	};

	const removeSocialIcon = ( index ) => {
		setAttributes( { socialIcons: socialIcons.filter( ( _, i ) => i !== index ) } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Contact Info', 'ai-zippy-child' ) } initialOpen={ true }>
					<TextareaControl
						label={ __( 'Address', 'ai-zippy-child' ) }
						value={ address }
						onChange={ ( val ) => setAttributes( { address: val } ) }
						rows={ 3 }
					/>
					<TextControl
						label={ __( 'Email', 'ai-zippy-child' ) }
						value={ email }
						onChange={ ( val ) => setAttributes( { email: val } ) }
					/>
					<TextControl
						label={ __( 'Phone', 'ai-zippy-child' ) }
						value={ phone }
						onChange={ ( val ) => setAttributes( { phone: val } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Footer Logo', 'ai-zippy-child' ) } initialOpen={ false }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => {
								setAttributes( {
									logoId: media.id,
									logoUrl: media.url,
									logoAlt: media.alt || logoAlt,
								} );
							} }
							allowedTypes={ [ 'image' ] }
							value={ logoId }
							render={ ( { open } ) => (
								<div>
									<div className="site-footer__logo-editor" onClick={ open }>
										{ logoUrl ? (
											<img src={ logoUrl } alt={ logoAlt } className="site-footer__logo" />
										) : (
											<div className="site-footer__logo-placeholder">
												<span>{ __( '+ Upload Logo', 'ai-zippy-child' ) }</span>
											</div>
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
						onChange={ ( val ) => setAttributes( { logoAlt: val } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Social Icons', 'ai-zippy-child' ) } initialOpen={ false }>
					{ socialIcons.map( ( icon, i ) => (
						<div key={ i } className="site-footer__social-item-editor">
							<p className="site-footer__label">
								{ __( 'Social Icon', 'ai-zippy-child' ) } { i + 1 }
							</p>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => {
										const updated = socialIcons.map( ( item, idx ) =>
											idx === i
												? { ...item, imageId: media.id, imageUrl: media.url, imageAlt: media.alt || item.imageAlt }
												: item
										);
										setAttributes( { socialIcons: updated } );
									} }
									allowedTypes={ [ 'image' ] }
									value={ icon.imageId }
									render={ ( { open } ) => (
										<div>
											<p className="site-footer__field-label">{ __( 'Icon Image', 'ai-zippy-child' ) }</p>
											<div className="site-footer__social-thumb" onClick={ open }>
												{ icon.imageUrl ? (
													<img src={ icon.imageUrl } alt={ icon.imageAlt } />
												) : (
													<span>{ __( '+ Icon', 'ai-zippy-child' ) }</span>
												) }
											</div>
										</div>
									) }
								/>
							</MediaUploadCheck>
							<TextControl
								label={ __( 'Icon Link URL', 'ai-zippy-child' ) }
								value={ icon.url }
								onChange={ ( val ) => updateSocialIcon( i, 'url', val ) }
							/>
							<TextControl
								label={ __( 'Icon Alt Text', 'ai-zippy-child' ) }
								value={ icon.imageAlt || '' }
								onChange={ ( val ) => updateSocialIcon( i, 'imageAlt', val ) }
							/>
							<Button isDestructive variant="tertiary" onClick={ () => removeSocialIcon( i ) }>
								{ __( 'Remove Social Icon', 'ai-zippy-child' ) }
							</Button>
						</div>
					) ) }
					<Button variant="secondary" onClick={ addSocialIcon }>
						{ __( '+ Add Social Icon', 'ai-zippy-child' ) }
					</Button>
				</PanelBody>

				<PanelBody title={ __( 'Navigation Links', 'ai-zippy-child' ) } initialOpen={ false }>
					{ navLinks.map( ( link, i ) => (
						<div key={ i } className="site-footer__nav-item-editor">
							<p className="site-footer__label">
								{ __( 'Footer Link', 'ai-zippy-child' ) } { i + 1 }
							</p>
							<TextControl
								label={ __( 'Label', 'ai-zippy-child' ) }
								value={ link.label }
								onChange={ ( val ) => updateNavLink( i, 'label', val ) }
							/>
							<TextControl
								label={ __( 'URL', 'ai-zippy-child' ) }
								value={ link.url }
								onChange={ ( val ) => updateNavLink( i, 'url', val ) }
							/>
							<Button isDestructive variant="tertiary" onClick={ () => removeNavLink( i ) }>
								{ __( 'Remove Link', 'ai-zippy-child' ) }
							</Button>
						</div>
					) ) }
					<Button variant="secondary" onClick={ addNavLink }>
						{ __( '+ Add Link', 'ai-zippy-child' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<footer { ...blockProps }>
				<div className="site-footer__inner">
					<div className="site-footer__col site-footer__col--left">
						{ address && <p className="site-footer__address">{ address }</p> }
						{ email && (
							<p className="site-footer__contact">
								E: <span>{ email }</span>
							</p>
						) }
						{ phone && (
							<p className="site-footer__contact">
								T: <span>{ phone }</span>
							</p>
						) }
						{ !! socialIcons.length && (
							<div className="site-footer__socials">
								{ socialIcons.map( ( icon, i ) => (
									<div key={ i } className="site-footer__social-link">
										{ icon.imageUrl ? (
											<img src={ icon.imageUrl } alt={ icon.imageAlt || '' } className="site-footer__social-icon" />
										) : (
											<div className="site-footer__social-thumb">
												<span>{ __( 'Icon', 'ai-zippy-child' ) }</span>
											</div>
										) }
									</div>
								) ) }
							</div>
						) }
					</div>

					<div className="site-footer__col site-footer__col--centre">
						{ logoUrl ? (
							<img src={ logoUrl } alt={ logoAlt } className="site-footer__logo" />
						) : (
							<div className="site-footer__logo-placeholder">
								<span>{ __( 'Footer Logo', 'ai-zippy-child' ) }</span>
							</div>
						) }
					</div>

					<div className="site-footer__col site-footer__col--right">
						{ !! navLinks.length && (
							<nav className="site-footer__nav" aria-label={ __( 'Footer Navigation', 'ai-zippy-child' ) }>
								{ navLinks.map( ( link, i ) => (
									<span key={ i } className="site-footer__nav-link">
										{ link.label }
									</span>
								) ) }
							</nav>
						) }
					</div>
				</div>
			</footer>
		</>
	);
}
