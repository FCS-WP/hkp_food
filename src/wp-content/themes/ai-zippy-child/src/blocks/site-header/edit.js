import { __ } from '@wordpress/i18n';
import { useBlockProps, MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { Button, TextControl, ToggleControl } from '@wordpress/components';
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
		logoId, logoUrl, logoAlt,
		navLinks,
		searchIconId, searchIconUrl, searchIconAlt,
		cartIconId, cartIconUrl, cartIconAlt,
		accountIconId, accountIconUrl, accountIconAlt,
		cartUrl, accountUrl, searchUrl,
	} = attributes;

	const blockProps = useBlockProps( { className: 'site-header' } );

	const updateNavLink = ( index, key, value ) => {
		const updated = navLinks.map( ( item, i ) =>
			i === index ? { ...item, [ key ]: value } : item
		);
		setAttributes( { navLinks: updated } );
	};

	const updateNavChild = ( parentIndex, childIndex, key, value ) => {
		const updated = navLinks.map( ( item, i ) => {
			if ( i !== parentIndex ) return item;
			const children = item.children.map( ( child, ci ) =>
				ci === childIndex ? { ...child, [ key ]: value } : child
			);
			return { ...item, children };
		} );
		setAttributes( { navLinks: updated } );
	};

	const addNavLink = () => {
		setAttributes( {
			navLinks: [ ...navLinks, { label: 'New Link', url: '#', isActive: false, hasDropdown: false, children: [] } ],
		} );
	};

	const removeNavLink = ( index ) => {
		setAttributes( { navLinks: navLinks.filter( ( _, i ) => i !== index ) } );
	};

	const addChild = ( parentIndex ) => {
		const updated = navLinks.map( ( item, i ) =>
			i === parentIndex
				? { ...item, children: [ ...( item.children || [] ), { label: 'Sub Item', url: '#' } ] }
				: item
		);
		setAttributes( { navLinks: updated } );
	};

	const removeChild = ( parentIndex, childIndex ) => {
		const updated = navLinks.map( ( item, i ) =>
			i === parentIndex
				? { ...item, children: item.children.filter( ( _, ci ) => ci !== childIndex ) }
				: item
		);
		setAttributes( { navLinks: updated } );
	};

	return (
		<header { ...blockProps }>
			<div className="site-header-editor__inner">

				{/* Logo */}
				<div className="site-header-editor__section">
					<p className="site-header-editor__section-title">{ __( 'Logo', 'ai-zippy-child' ) }</p>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) => setAttributes( { logoId: media.id, logoUrl: media.url, logoAlt: media.alt || logoAlt } ) }
							allowedTypes={ [ 'image' ] }
							value={ logoId }
							render={ ( { open } ) => (
								<div className="site-header-editor__logo-thumb" onClick={ open }>
									{ logoUrl
										? <img src={ logoUrl } alt={ logoAlt } />
										: <span>{ __( '+ Upload Logo', 'ai-zippy-child' ) }</span>
									}
								</div>
							) }
						/>
					</MediaUploadCheck>
				</div>

				{/* Navigation */}
				<div className="site-header-editor__section">
					<p className="site-header-editor__section-title">{ __( 'Navigation Links', 'ai-zippy-child' ) }</p>
					{ navLinks.map( ( link, i ) => (
						<div key={ i } className="site-header-editor__nav-item">
							<div className="site-header-editor__nav-row">
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
								<ToggleControl
									label={ __( 'Active', 'ai-zippy-child' ) }
									checked={ link.isActive }
									onChange={ ( val ) => updateNavLink( i, 'isActive', val ) }
								/>
								<ToggleControl
									label={ __( 'Dropdown', 'ai-zippy-child' ) }
									checked={ link.hasDropdown }
									onChange={ ( val ) => updateNavLink( i, 'hasDropdown', val ) }
								/>
								<Button isDestructive variant="tertiary" onClick={ () => removeNavLink( i ) }>✕</Button>
							</div>

							{ link.hasDropdown && (
								<div className="site-header-editor__children">
									{ ( link.children || [] ).map( ( child, ci ) => (
										<div key={ ci } className="site-header-editor__child-row">
											<TextControl
												placeholder={ __( 'Sub Label', 'ai-zippy-child' ) }
												value={ child.label }
												onChange={ ( val ) => updateNavChild( i, ci, 'label', val ) }
											/>
											<TextControl
												placeholder={ __( 'Sub URL', 'ai-zippy-child' ) }
												value={ child.url }
												onChange={ ( val ) => updateNavChild( i, ci, 'url', val ) }
											/>
											<Button isDestructive variant="tertiary" onClick={ () => removeChild( i, ci ) }>✕</Button>
										</div>
									) ) }
									<Button variant="secondary" onClick={ () => addChild( i ) }>
										{ __( '+ Add Sub Item', 'ai-zippy-child' ) }
									</Button>
								</div>
							) }
						</div>
					) ) }
					<Button variant="secondary" onClick={ addNavLink }>
						{ __( '+ Add Link', 'ai-zippy-child' ) }
					</Button>
				</div>

				{/* Action icons */}
				<div className="site-header-editor__section">
					<p className="site-header-editor__section-title">{ __( 'Action Icons (PNG)', 'ai-zippy-child' ) }</p>
					<div className="site-header-editor__icons-row">
						<IconUploader
							id={ searchIconId } url={ searchIconUrl } alt={ searchIconAlt }
							label={ __( 'Search Icon', 'ai-zippy-child' ) }
							onSelect={ ( media ) => setAttributes( { searchIconId: media.id, searchIconUrl: media.url, searchIconAlt: media.alt || searchIconAlt } ) }
						/>
						<IconUploader
							id={ cartIconId } url={ cartIconUrl } alt={ cartIconAlt }
							label={ __( 'Cart Icon', 'ai-zippy-child' ) }
							onSelect={ ( media ) => setAttributes( { cartIconId: media.id, cartIconUrl: media.url, cartIconAlt: media.alt || cartIconAlt } ) }
						/>
						<IconUploader
							id={ accountIconId } url={ accountIconUrl } alt={ accountIconAlt }
							label={ __( 'Account Icon', 'ai-zippy-child' ) }
							onSelect={ ( media ) => setAttributes( { accountIconId: media.id, accountIconUrl: media.url, accountIconAlt: media.alt || accountIconAlt } ) }
						/>
					</div>
					<div className="site-header-editor__icon-urls">
						<TextControl label={ __( 'Search URL', 'ai-zippy-child' ) } value={ searchUrl } onChange={ ( val ) => setAttributes( { searchUrl: val } ) } />
						<TextControl label={ __( 'Cart URL', 'ai-zippy-child' ) } value={ cartUrl } onChange={ ( val ) => setAttributes( { cartUrl: val } ) } />
						<TextControl label={ __( 'Account URL', 'ai-zippy-child' ) } value={ accountUrl } onChange={ ( val ) => setAttributes( { accountUrl: val } ) } />
					</div>
				</div>

			</div>
		</header>
	);
}
