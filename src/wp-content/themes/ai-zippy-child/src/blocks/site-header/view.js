/**
 * Site Header – frontend view script
 * Handles hover dropdown for nav items with .has-dropdown
 * and wires the cart icon to open the WooCommerce mini-cart drawer.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const headers = document.querySelectorAll( '[data-site-header]' );

	// ── Cart icon → open WC mini-cart drawer ──────────────────
	headers.forEach( ( header ) => {
		const cartLink = header.querySelector( '[data-cart-trigger]' );
		if ( ! cartLink ) return;

		cartLink.addEventListener( 'click', ( e ) => {
			// Find the hidden WC mini-cart trigger button anywhere in the page
			const wcBtn = document.querySelector( '.wc-block-mini-cart__button' );
			if ( wcBtn ) {
				e.preventDefault();
				wcBtn.click();
			}
			// If WC button not found, fall through to the href (cart page)
		} );
	} );

	headers.forEach( ( header ) => {
		const dropdownItems = header.querySelectorAll( '.site-header__nav-item.has-dropdown' );

		dropdownItems.forEach( ( item ) => {
			const trigger = item.querySelector( '.site-header__nav-link' );
			const dropdown = item.querySelector( '.site-header__dropdown' );

			if ( ! trigger || ! dropdown ) return;

			let closeTimer = null;

			const openDropdown = () => {
				clearTimeout( closeTimer );
				dropdown.classList.add( 'is-open' );
				trigger.setAttribute( 'aria-expanded', 'true' );
			};

			const closeDropdown = () => {
				closeTimer = setTimeout( () => {
					dropdown.classList.remove( 'is-open' );
					trigger.setAttribute( 'aria-expanded', 'false' );
				}, 150 );
			};

			// Hover
			item.addEventListener( 'mouseenter', openDropdown );
			item.addEventListener( 'mouseleave', closeDropdown );

			// Keep open when mouse moves to dropdown
			dropdown.addEventListener( 'mouseenter', () => clearTimeout( closeTimer ) );
			dropdown.addEventListener( 'mouseleave', closeDropdown );

			// Keyboard: Enter/Space opens, Escape closes
			trigger.addEventListener( 'keydown', ( e ) => {
				if ( e.key === 'Enter' || e.key === ' ' ) {
					e.preventDefault();
					const isOpen = dropdown.classList.contains( 'is-open' );
					isOpen ? closeDropdown() : openDropdown();
				}
				if ( e.key === 'Escape' ) closeDropdown();
			} );
		} );
	} );
} );
