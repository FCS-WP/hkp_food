/**
 * Site Header – frontend view script
 * Handles desktop dropdowns, mini-cart proxy, search toggle,
 * account modal, and mobile navigation popup.
 */
document.addEventListener( 'DOMContentLoaded', () => {
	const headers = document.querySelectorAll( '[data-site-header]' );
	const body = document.body;
	const isCartOrCheckout =
		body.classList.contains( 'woocommerce-cart' ) ||
		body.classList.contains( 'woocommerce-checkout' ) ||
		body.classList.contains( 'wp-block-cart' ) ||
		body.classList.contains( 'wp-block-checkout' );

	const getProxyBadgeCount = () => {
		const wcBadge = document.querySelector( '.site-header__mini-cart-proxy .wc-block-mini-cart__badge' );
		return parseInt( wcBadge?.textContent || '0', 10 ) || 0;
	};

	const getCartPageCount = () => {
		const headerInitial = headers[ 0 ]?.getAttribute( 'data-cart-count-initial' );
		if ( headerInitial !== null && headerInitial !== undefined ) {
			const parsedInitial = parseInt( headerInitial, 10 );
			if ( ! Number.isNaN( parsedInitial ) ) {
				return parsedInitial;
			}
		}

		const cartCountSource = document.querySelector( '[data-wc-cart-count]' );
		if ( cartCountSource ) {
			return parseInt( cartCountSource.getAttribute( 'data-wc-cart-count' ) || '0', 10 ) || 0;
		}

		const quantityInputs = document.querySelectorAll(
			'.wc-block-cart-items .wc-block-components-quantity-selector__input, .wc-block-cart-items .wc-block-components-quantity-selector input, .shop_table.cart input.qty, .woocommerce-cart-form input.qty'
		);

		if ( ! quantityInputs.length ) {
			return 0;
		}

		return Array.from( quantityInputs ).reduce( ( total, input ) => {
			const value = parseInt( input.value || input.getAttribute( 'value' ) || '0', 10 ) || 0;
			return total + value;
		}, 0 );
	};

	const syncCartBadge = () => {
		const count = isCartOrCheckout ? getCartPageCount() : getProxyBadgeCount();

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
				if ( isCartOrCheckout ) {
					return;
				}

				const wcBtn =
					header.querySelector( '.site-header__mini-cart-proxy .wc-block-mini-cart__button' ) ||
					document.querySelector( '.wc-block-mini-cart__button' );

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
	document.body.addEventListener( 'change', ( event ) => {
		if ( event.target.matches( '.wc-block-components-quantity-selector__input, .wc-block-components-quantity-selector input, .shop_table.cart input.qty, .woocommerce-cart-form input.qty' ) ) {
			syncCartBadge();
		}
	} );
	window.addEventListener( 'pageshow', syncCartBadge );
} );
