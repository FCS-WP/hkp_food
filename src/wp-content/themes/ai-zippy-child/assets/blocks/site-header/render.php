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
$search_icon_url  = ! empty( $attributes['searchIconUrl'] ) ? $attributes['searchIconUrl'] : '';
$search_icon_alt  = ! empty( $attributes['searchIconAlt'] ) ? $attributes['searchIconAlt'] : 'Search';
$cart_icon_url    = ! empty( $attributes['cartIconUrl'] ) ? $attributes['cartIconUrl'] : '';
$account_icon_url = ! empty( $attributes['accountIconUrl'] ) ? $attributes['accountIconUrl'] : '';
$account_icon_alt = ! empty( $attributes['accountIconAlt'] ) ? $attributes['accountIconAlt'] : 'Account';
$cart_url         = ! empty( $attributes['cartUrl'] ) ? $attributes['cartUrl'] : '/cart';
$account_url      = ! empty( $attributes['accountUrl'] ) ? $attributes['accountUrl'] : '/my-account';
$cart_count       = function_exists( 'WC' ) && WC()->cart ? WC()->cart->get_cart_contents_count() : 0;
$account_page_url = function_exists( 'wc_get_page_permalink' ) ? wc_get_page_permalink( 'myaccount' ) : $account_url;
$is_logged_in     = is_user_logged_in();
$navigation_markup = '';

$navigation_posts = get_posts(
	[
		'post_type'        => 'wp_navigation',
		'post_status'      => 'publish',
		'numberposts'      => -1,
		'orderby'          => 'date',
		'order'            => 'ASC',
		'suppress_filters' => false,
	]
);

$selected_navigation = null;

if ( ! empty( $navigation_posts ) ) {
	foreach ( $navigation_posts as $navigation_post ) {
		if ( 'Menu' === $navigation_post->post_title ) {
			$selected_navigation = $navigation_post;
			break;
		}
	}

	if ( ! $selected_navigation ) {
		$selected_navigation = $navigation_posts[0];
	}
}

if ( $selected_navigation ) {
	$navigation_markup = do_blocks( $selected_navigation->post_content );
}
?>

<header <?php echo get_block_wrapper_attributes( [ 'class' => 'site-header' ] ); ?> data-site-header data-cart-count-initial="<?php echo esc_attr( (string) $cart_count ); ?>">
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
			<?php echo $navigation_markup; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</nav>

		<div class="site-header__actions">
			<?php if ( $search_icon_url ) : ?>
				<button type="button" class="site-header__action-link site-header__search-toggle" aria-label="<?php echo esc_attr( $search_icon_alt ); ?>" aria-expanded="false" aria-controls="site-header-search-form" data-search-toggle>
					<img src="<?php echo esc_url( $search_icon_url ); ?>" alt="<?php echo esc_attr( $search_icon_alt ); ?>" class="site-header__action-icon" />
				</button>
			<?php endif; ?>

			<?php if ( class_exists( 'WooCommerce' ) && function_exists( 'do_blocks' ) && ! is_cart() && ! is_checkout() ) : ?>
				<div class="site-header__mini-cart-wrap" data-mini-cart-wrap<?php echo $cart_icon_url ? ' style="--site-header-cart-icon: url(' . esc_url( $cart_icon_url ) . ');"' : ''; ?>>
					<?php echo do_blocks( '<!-- wp:woocommerce/mini-cart /-->' ); ?>
					<span class="site-header__cart-badge site-header__cart-badge--mirror" data-cart-count<?php echo $cart_count > 0 ? '' : ' hidden'; ?>><?php echo esc_html( (string) $cart_count ); ?></span>
				</div>
			<?php elseif ( $cart_icon_url ) : ?>
				<a href="<?php echo esc_url( function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : $cart_url ); ?>" class="site-header__action-link site-header__action-link--cart" aria-label="<?php echo esc_attr( $cart_icon_alt ); ?>">
					<img src="<?php echo esc_url( $cart_icon_url ); ?>" alt="<?php echo esc_attr( $cart_icon_alt ); ?>" class="site-header__action-icon" />
					<span class="site-header__cart-badge" data-cart-count<?php echo $cart_count > 0 ? '' : ' hidden'; ?>><?php echo esc_html( (string) $cart_count ); ?></span>
				</a>
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
					<p class="site-header__account-footer">
						<a href="<?php echo esc_url( $account_page_url ); ?>"><?php esc_html_e( 'Create an account', 'ai-zippy-child' ); ?></a>
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
					<?php echo $navigation_markup; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
				</nav>
			</div>
		</div>
	</div>
</header>
