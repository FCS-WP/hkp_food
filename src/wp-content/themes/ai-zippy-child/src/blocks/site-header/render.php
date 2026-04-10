<?php
/**
 * Site Header block render template.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 */

$logo_url         = ! empty( $attributes['logoUrl'] ) ? $attributes['logoUrl'] : '';
$logo_alt         = ! empty( $attributes['logoAlt'] ) ? $attributes['logoAlt'] : 'Ho Kee Pau';
$nav_links        = ! empty( $attributes['navLinks'] ) ? $attributes['navLinks'] : [];
$search_icon_url  = ! empty( $attributes['searchIconUrl'] ) ? $attributes['searchIconUrl'] : '';
$search_icon_alt  = ! empty( $attributes['searchIconAlt'] ) ? $attributes['searchIconAlt'] : 'Search';
$cart_icon_url    = ! empty( $attributes['cartIconUrl'] ) ? $attributes['cartIconUrl'] : '';
$cart_icon_alt    = ! empty( $attributes['cartIconAlt'] ) ? $attributes['cartIconAlt'] : 'Cart';
$account_icon_url = ! empty( $attributes['accountIconUrl'] ) ? $attributes['accountIconUrl'] : '';
$account_icon_alt = ! empty( $attributes['accountIconAlt'] ) ? $attributes['accountIconAlt'] : 'Account';
$search_url       = ! empty( $attributes['searchUrl'] ) ? $attributes['searchUrl'] : '/?s=';
$cart_url         = ! empty( $attributes['cartUrl'] ) ? $attributes['cartUrl'] : '/cart';
$account_url      = ! empty( $attributes['accountUrl'] ) ? $attributes['accountUrl'] : '/my-account';
$cart_count       = function_exists( 'WC' ) && WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
$account_page_url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : $account_url;
$is_logged_in     = is_user_logged_in();
$request_uri      = isset( $_SERVER['REQUEST_URI'] ) ? wp_unslash( (string) $_SERVER['REQUEST_URI'] ) : '/';
$current_url      = home_url( $request_uri );
$normalize_url    = static function ( string $url ): string {
	if ( '' === $url ) {
		return '';
	}

	if ( str_starts_with( $url, '/' ) ) {
		$url = home_url( $url );
	}

	$parts = wp_parse_url( $url );
	if ( ! is_array( $parts ) ) {
		return untrailingslashit( $url );
	}

	$path = isset( $parts['path'] ) ? untrailingslashit( $parts['path'] ) : '';
	if ( '' === $path ) {
		$path = '/';
	}

	return $path;
};
$current_path = $normalize_url( $current_url );
?>

<header <?php echo get_block_wrapper_attributes( [ 'class' => 'site-header' ] ); ?> data-site-header>
	<div class="site-header__inner">
		<div class="site-header__logo-wrap">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-header__logo-link">
				<?php if ( $logo_url ) : ?>
					<img
						src="<?php echo esc_url( $logo_url ); ?>"
						alt="<?php echo esc_attr( $logo_alt ); ?>"
						class="site-header__logo"
					/>
				<?php endif; ?>
			</a>
		</div>

		<button
			type="button"
			class="site-header__menu-toggle"
			aria-label="<?php esc_attr_e( 'Open menu', 'ai-zippy-child' ); ?>"
			aria-expanded="false"
			aria-controls="site-header-mobile-menu"
			data-menu-toggle
		>
			<span></span>
			<span></span>
			<span></span>
		</button>

		<nav class="site-header__nav" aria-label="<?php esc_attr_e( 'Main Navigation', 'ai-zippy-child' ); ?>">
			<?php foreach ( $nav_links as $link ) :
				$link_url     = isset( $link['url'] ) ? (string) $link['url'] : '';
				$normalized   = $normalize_url( $link_url );
				$is_active    = $normalized && $normalized === $current_path;
				$has_dropdown = ! empty( $link['hasDropdown'] ) && ! empty( $link['children'] );
				$link_class   = 'site-header__nav-item' . ( $has_dropdown ? ' has-dropdown' : '' );
			?>
				<div class="<?php echo esc_attr( $link_class ); ?>">
					<a
						href="<?php echo esc_url( $link['url'] ?? '#' ); ?>"
						class="site-header__nav-link<?php echo $is_active ? ' is-active' : ''; ?>"
						<?php if ( $has_dropdown ) : ?>aria-haspopup="true" aria-expanded="false"<?php endif; ?>
					><?php echo esc_html( $link['label'] ?? '' ); ?><?php if ( $has_dropdown ) : ?><span class="site-header__nav-arrow" aria-hidden="true">&#9660;</span><?php endif; ?></a>

					<?php if ( $has_dropdown ) : ?>
						<ul class="site-header__dropdown" role="menu">
							<?php foreach ( $link['children'] as $child ) : ?>
								<li role="none">
									<a
										href="<?php echo esc_url( $child['url'] ?? '#' ); ?>"
										class="site-header__dropdown-link"
										role="menuitem"
									><?php echo esc_html( $child['label'] ?? '' ); ?></a>
								</li>
							<?php endforeach; ?>
						</ul>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</nav>

		<div class="site-header__actions">
			<?php if ( $search_icon_url ) : ?>
				<button type="button" class="site-header__action-link site-header__search-toggle" aria-label="<?php echo esc_attr( $search_icon_alt ); ?>" aria-expanded="false" aria-controls="site-header-search-form" data-search-toggle>
					<img src="<?php echo esc_url( $search_icon_url ); ?>" alt="<?php echo esc_attr( $search_icon_alt ); ?>" class="site-header__action-icon" />
				</button>
			<?php endif; ?>

			<?php if ( $cart_icon_url ) : ?>
				<a href="<?php echo esc_url( function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : $cart_url ); ?>" class="site-header__action-link site-header__action-link--cart" aria-label="<?php echo esc_attr( $cart_icon_alt ); ?>" data-cart-trigger>
					<img src="<?php echo esc_url( $cart_icon_url ); ?>" alt="<?php echo esc_attr( $cart_icon_alt ); ?>" class="site-header__action-icon" />
					<?php if ( $cart_count > 0 ) : ?>
						<span class="site-header__cart-badge" data-cart-count><?php echo esc_html( (string) $cart_count ); ?></span>
					<?php endif; ?>
				</a>
			<?php endif; ?>

			<?php if ( function_exists( 'do_blocks' ) && class_exists( 'WooCommerce' ) ) : ?>
				<div class="site-header__mini-cart-proxy" aria-hidden="true">
					<?php echo do_blocks( '<!-- wp:woocommerce/mini-cart /-->' ); ?>
				</div>
			<?php endif; ?>

			<?php if ( $account_icon_url ) : ?>
				<?php if ( $is_logged_in ) : ?>
					<a href="<?php echo esc_url( $account_page_url ); ?>" class="site-header__action-link" aria-label="<?php echo esc_attr( $account_icon_alt ); ?>">
						<img src="<?php echo esc_url( $account_icon_url ); ?>" alt="<?php echo esc_attr( $account_icon_alt ); ?>" class="site-header__action-icon" />
					</a>
				<?php else : ?>
					<button type="button" class="site-header__action-link site-header__account-toggle" aria-label="<?php echo esc_attr( $account_icon_alt ); ?>" aria-expanded="false" aria-controls="site-header-account-panel" data-account-toggle>
						<img src="<?php echo esc_url( $account_icon_url ); ?>" alt="<?php echo esc_attr( $account_icon_alt ); ?>" class="site-header__action-icon" />
					</button>
				<?php endif; ?>
			<?php endif; ?>
		</div>

		<div class="site-header__search-panel" hidden data-search-panel>
			<form role="search" method="get" class="site-header__search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>" id="site-header-search-form">
				<label class="screen-reader-text" for="site-header-search-input"><?php esc_html_e( 'Search for:', 'ai-zippy-child' ); ?></label>
				<input type="search" id="site-header-search-input" class="site-header__search-input" placeholder="<?php esc_attr_e( 'Search products…', 'ai-zippy-child' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s" />
				<input type="hidden" name="post_type" value="product" />
				<button type="submit" class="site-header__search-submit"><?php esc_html_e( 'Search', 'ai-zippy-child' ); ?></button>
			</form>
		</div>

		<div class="site-header__account-modal" hidden data-account-modal>
			<div class="site-header__account-backdrop" data-account-close></div>
			<div class="site-header__account-dialog" role="dialog" aria-modal="true" aria-labelledby="site-header-account-title" id="site-header-account-panel">
				<button type="button" class="site-header__account-close" aria-label="<?php esc_attr_e( 'Close login popup', 'ai-zippy-child' ); ?>" data-account-close>&times;</button>
				<h2 class="site-header__account-title" id="site-header-account-title"><?php esc_html_e( 'Login to your account', 'ai-zippy-child' ); ?></h2>
				<?php if ( function_exists( 'woocommerce_login_form' ) ) : ?>
					<?php woocommerce_login_form( [
						'redirect' => $account_page_url,
						'hidden'   => false,
					] ); ?>
					<p class="site-header__account-footer">
						<a href="<?php echo esc_url( wp_lostpassword_url() ); ?>"><?php esc_html_e( 'Lost your password?', 'ai-zippy-child' ); ?></a>
					</p>
				<?php else : ?>
					<p><a href="<?php echo esc_url( $account_url ); ?>"><?php esc_html_e( 'Go to My Account', 'ai-zippy-child' ); ?></a></p>
				<?php endif; ?>
			</div>
		</div>

		<div class="site-header__mobile-menu" hidden data-mobile-menu>
			<div class="site-header__mobile-backdrop" data-mobile-menu-close></div>
			<div class="site-header__mobile-dialog" role="dialog" aria-modal="true" aria-labelledby="site-header-mobile-menu-title" id="site-header-mobile-menu">
				<div class="site-header__mobile-header">
					<h2 class="site-header__mobile-title" id="site-header-mobile-menu-title"><?php esc_html_e( 'Menu', 'ai-zippy-child' ); ?></h2>
					<button type="button" class="site-header__mobile-close" aria-label="<?php esc_attr_e( 'Close menu', 'ai-zippy-child' ); ?>" data-mobile-menu-close>&times;</button>
				</div>
				<nav class="site-header__mobile-nav" aria-label="<?php esc_attr_e( 'Mobile Navigation', 'ai-zippy-child' ); ?>">
					<?php foreach ( $nav_links as $link ) :
						$link_url     = isset( $link['url'] ) ? (string) $link['url'] : '';
						$normalized   = $normalize_url( $link_url );
						$is_active    = $normalized && $normalized === $current_path;
						$has_dropdown = ! empty( $link['hasDropdown'] ) && ! empty( $link['children'] );
					?>
						<div class="site-header__mobile-item<?php echo $has_dropdown ? ' has-children' : ''; ?>">
							<a href="<?php echo esc_url( $link['url'] ?? '#' ); ?>" class="site-header__mobile-link<?php echo $is_active ? ' is-active' : ''; ?>"><?php echo esc_html( $link['label'] ?? '' ); ?></a>
							<?php if ( $has_dropdown ) : ?>
								<div class="site-header__mobile-children">
									<?php foreach ( $link['children'] as $child ) : ?>
										<a href="<?php echo esc_url( $child['url'] ?? '#' ); ?>" class="site-header__mobile-child-link"><?php echo esc_html( $child['label'] ?? '' ); ?></a>
									<?php endforeach; ?>
								</div>
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
				</nav>
			</div>
		</div>
	</div>
</header>
