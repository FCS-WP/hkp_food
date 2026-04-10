import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, TextControl, TextareaControl } from '@wordpress/components';
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

	const blockProps = useBlockProps( { className: 'site-footer' } );

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
		<footer { ...blockProps }>
			<div className="site-footer__inner">

				{/* Left column – contact + socials */}
				<div className="site-footer__col site-footer__col--left">
					<TextareaControl
						label={ __( 'Address', 'ai-zippy-child' ) }
						value={ address }
						onChange={ ( val ) => setAttributes( { address: val } ) }
						rows={ 2 }
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

					<p className="site-footer__label">{ __( 'Social Icons (PNG images)', 'ai-zippy-child' ) }</p>
					<div className="site-footer__socials-editor">
						{ socialIcons.map( ( icon, i ) => (
							<div key={ i } className="site-footer__social-item-editor">
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
											<div className="site-footer__social-thumb" onClick={ open }>
												{ icon.imageUrl ? (
													<img src={ icon.imageUrl } alt={ icon.imageAlt } />
												) : (
													<span>{ __( '+ Icon', 'ai-zippy-child' ) }</span>
												) }
											</div>
										) }
									/>
								</MediaUploadCheck>
								<TextControl
									placeholder={ __( 'Link URL', 'ai-zippy-child' ) }
									value={ icon.url }
									onChange={ ( val ) => updateSocialIcon( i, 'url', val ) }
								/>
								<Button
									isDestructive
									variant="tertiary"
									onClick={ () => removeSocialIcon( i ) }
								>
									✕
								</Button>
							</div>
						) ) }
						<Button variant="secondary" onClick={ addSocialIcon }>
							{ __( '+ Add Social Icon', 'ai-zippy-child' ) }
						</Button>
					</div>
				</div>

				{/* Centre column – logo */}
				<div className="site-footer__col site-footer__col--centre">
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
								<div className="site-footer__logo-editor" onClick={ open }>
									{ logoUrl ? (
										<img src={ logoUrl } alt={ logoAlt } className="site-footer__logo" />
									) : (
										<div className="site-footer__logo-placeholder">
											<span>{ __( '+ Upload Logo', 'ai-zippy-child' ) }</span>
										</div>
									) }
								</div>
							) }
						/>
					</MediaUploadCheck>
				</div>

				{/* Right column – nav links */}
				<div className="site-footer__col site-footer__col--right">
					<p className="site-footer__label">{ __( 'Navigation Links', 'ai-zippy-child' ) }</p>
					{ navLinks.map( ( link, i ) => (
						<div key={ i } className="site-footer__nav-item-editor">
							<TextControl
								placeholder={ __( 'Label', 'ai-zippy-child' ) }
								value={ link.label }
								onChange={ ( val ) => updateNavLink( i, 'label', val ) }
							/>
							<TextControl
								placeholder={ __( 'URL', 'ai-zippy-child' ) }
								value={ link.url }
								onChange={ ( val ) => updateNavLink( i, 'url', val ) }
							/>
							<Button
								isDestructive
								variant="tertiary"
								onClick={ () => removeNavLink( i ) }
							>
								✕
							</Button>
						</div>
					) ) }
					<Button variant="secondary" onClick={ addNavLink }>
						{ __( '+ Add Link', 'ai-zippy-child' ) }
					</Button>
				</div>

			</div>
		</footer>
	);
}
