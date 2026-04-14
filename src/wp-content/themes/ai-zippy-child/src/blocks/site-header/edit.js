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
	ToggleControl,
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
		navLinks,
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
			navLinks: [
				...navLinks,
				{ label: 'New Link', url: '#', isActive: false, hasDropdown: false, children: [] },
			],
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

				<PanelBody title={ __( 'Navigation Links', 'ai-zippy-child' ) } initialOpen={ false }>
					{ navLinks.map( ( link, i ) => (
						<div key={ i } className="site-header-editor__nav-item">
							<p className="site-header-editor__label">
								{ __( 'Navigation Item', 'ai-zippy-child' ) } { i + 1 }
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
							<Button isDestructive variant="tertiary" onClick={ () => removeNavLink( i ) }>
								{ __( 'Remove Link', 'ai-zippy-child' ) }
							</Button>

							{ link.hasDropdown && (
								<div className="site-header-editor__children">
									{ ( link.children || [] ).map( ( child, ci ) => (
										<div key={ ci } className="site-header-editor__child-row">
											<TextControl
												label={ __( 'Sub Label', 'ai-zippy-child' ) }
												value={ child.label }
												onChange={ ( val ) => updateNavChild( i, ci, 'label', val ) }
											/>
											<TextControl
												label={ __( 'Sub URL', 'ai-zippy-child' ) }
												value={ child.url }
												onChange={ ( val ) => updateNavChild( i, ci, 'url', val ) }
											/>
											<Button isDestructive variant="tertiary" onClick={ () => removeChild( i, ci ) }>
												{ __( 'Remove Sub Item', 'ai-zippy-child' ) }
											</Button>
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
						{ navLinks.map( ( link, index ) => {
							const hasDropdown = !! link.hasDropdown && !! link.children?.length;
							return (
								<div key={ index } className={ `site-header__nav-item${ hasDropdown ? ' has-dropdown' : '' }` }>
									<span className={ `site-header__nav-link${ link.isActive ? ' is-active' : '' }` }>
										{ link.label }
										{ hasDropdown && <span className="site-header__nav-arrow" aria-hidden="true">&#9660;</span> }
									</span>
									{ hasDropdown && (
										<ul className="site-header__dropdown is-open" role="menu">
											{ link.children.map( ( child, childIndex ) => (
												<li key={ childIndex } role="none">
													<span className="site-header__dropdown-link" role="menuitem">{ child.label }</span>
												</li>
											) ) }
										</ul>
									) }
								</div>
							);
						} ) }
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
