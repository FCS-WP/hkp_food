/**
 * Site Header – frontend view script
 * Handles desktop dropdowns, mini-cart proxy, search toggle,
 * account modal, and mobile navigation popup.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const headers = document.querySelectorAll( '[data-site-header]' );

	const syncCartBadge = () => {
		const wcBadge = document.querySelector( '.site-header__mini-cart-proxy .wc-block-mini-cart__badge' );
		const count = parseInt( wcBadge?.textContent || '0', 10 ) || 0;

		headers.forEach( ( header ) => {
			header.querySelectorAll( '[data-cart-count]' ).forEach( ( badge ) => {
				badge.textContent = String( count );
				badge.hidden = count <= 0;
			} );
		} );
	};

	headers.forEach( ( header ) => {
		const cartLink = header.querySelector( '[data-cart-trigger]' );
		if ( cartLink ) {
			cartLink.addEventListener( 'click', ( e ) => {
				const wcBtn = header.querySelector( '.site-header__mini-cart-proxy .wc-block-mini-cart__button' ) || document.querySelector( '.wc-block-mini-cart__button' );
				if ( wcBtn ) {
					e.preventDefault();
					wcBtn.click();
				}
			} );
		}

		const searchToggle = header.querySelector( '[data-search-toggle]' );
		const searchPanel = header.querySelector( '[data-search-panel]' );
		const searchInput = header.querySelector( '.site-header__search-input' );

		const closeSearch = () => {
			if ( ! searchToggle || ! searchPanel ) return;
			searchPanel.hidden = true;
			searchToggle.setAttribute( 'aria-expanded', 'false' );
		};

		const openSearch = () => {
			if ( ! searchToggle || ! searchPanel ) return;
			searchPanel.hidden = false;
			searchToggle.setAttribute( 'aria-expanded', 'true' );
			window.setTimeout( () => searchInput?.focus(), 0 );
		};

		if ( searchToggle && searchPanel ) {
			searchToggle.addEventListener( 'click', () => {
				const isOpen = ! searchPanel.hidden;
				isOpen ? closeSearch() : openSearch();
			} );
		}

		const accountToggle = header.querySelector( '[data-account-toggle]' );
		const accountModal = header.querySelector( '[data-account-modal]' );
		const accountCloseButtons = header.querySelectorAll( '[data-account-close]' );
		const usernameInput = header.querySelector( '#username, input[name="username"]' );

		const closeAccount = () => {
			if ( ! accountToggle || ! accountModal ) return;
			accountModal.hidden = true;
			accountToggle.setAttribute( 'aria-expanded', 'false' );
		};

		const openAccount = () => {
			if ( ! accountToggle || ! accountModal ) return;
			accountModal.hidden = false;
			accountToggle.setAttribute( 'aria-expanded', 'true' );
			window.setTimeout( () => usernameInput?.focus(), 0 );
		};

		if ( accountToggle && accountModal ) {
			accountToggle.addEventListener( 'click', () => {
				const isOpen = ! accountModal.hidden;
				isOpen ? closeAccount() : openAccount();
			} );

			accountCloseButtons.forEach( ( button ) => {
				button.addEventListener( 'click', closeAccount );
			} );
		}

		const menuToggle = header.querySelector( '[data-menu-toggle]' );
		const mobileMenu = header.querySelector( '[data-mobile-menu]' );
		const mobileMenuCloseButtons = header.querySelectorAll( '[data-mobile-menu-close]' );

		const closeMobileMenu = () => {
			if ( ! menuToggle || ! mobileMenu ) return;
			mobileMenu.hidden = true;
			menuToggle.setAttribute( 'aria-expanded', 'false' );
		};

		const openMobileMenu = () => {
			if ( ! menuToggle || ! mobileMenu ) return;
			mobileMenu.hidden = false;
			menuToggle.setAttribute( 'aria-expanded', 'true' );
		};

		if ( menuToggle && mobileMenu ) {
			menuToggle.addEventListener( 'click', () => {
				const isOpen = ! mobileMenu.hidden;
				isOpen ? closeMobileMenu() : openMobileMenu();
			} );

			mobileMenuCloseButtons.forEach( ( button ) => {
				button.addEventListener( 'click', closeMobileMenu );
			} );

			header.querySelectorAll( '.site-header__mobile-link, .site-header__mobile-child-link' ).forEach( ( link ) => {
				link.addEventListener( 'click', closeMobileMenu );
			} );
		}

		document.addEventListener( 'click', ( event ) => {
			if ( ! header.contains( event.target ) ) {
				closeSearch();
			}
		} );

		header.addEventListener( 'keydown', ( event ) => {
			if ( event.key === 'Escape' ) {
				closeSearch();
				closeAccount();
				closeMobileMenu();
			}
		} );

		const dropdownItems = header.querySelectorAll( '.site-header__nav-item.has-dropdown' );
		dropdownItems.forEach( ( item ) => {
			const trigger = item.querySelector( '.site-header__nav-link' );
			const dropdown = item.querySelector( '.site-header__dropdown' );
			if ( ! trigger || ! dropdown ) return;

			let closeTimer = null;
			const openDropdown = () => {
				if ( window.innerWidth <= 768 ) return;
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

			item.addEventListener( 'mouseenter', openDropdown );
			item.addEventListener( 'mouseleave', closeDropdown );
			dropdown.addEventListener( 'mouseenter', () => clearTimeout( closeTimer ) );
			dropdown.addEventListener( 'mouseleave', closeDropdown );
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

	syncCartBadge();
	document.body.addEventListener( 'wc-blocks_added_to_cart', syncCartBadge );
	document.body.addEventListener( 'wc_fragments_refreshed', syncCartBadge );
	window.addEventListener( 'pageshow', syncCartBadge );
} );
