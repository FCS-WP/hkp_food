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
?>

<header <?php echo get_block_wrapper_attributes( [ 'class' => 'site-header' ] ); ?> data-site-header>
	<div class="site-header__inner">

		<!-- Logo -->
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

		<!-- Navigation -->
		<nav class="site-header__nav" aria-label="<?php esc_attr_e( 'Main Navigation', 'ai-zippy-child' ); ?>">
			<?php foreach ( $nav_links as $link ) :
				$is_active    = ! empty( $link['isActive'] );
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

		<!-- Action icons -->
		<div class="site-header__actions">
			<?php if ( $search_icon_url ) : ?>
				<a href="<?php echo esc_url( $search_url ); ?>" class="site-header__action-link" aria-label="<?php echo esc_attr( $search_icon_alt ); ?>">
					<img src="<?php echo esc_url( $search_icon_url ); ?>" alt="<?php echo esc_attr( $search_icon_alt ); ?>" class="site-header__action-icon" />
				</a>
			<?php endif; ?>

			<?php if ( $cart_icon_url ) : ?>
				<a href="<?php echo esc_url( function_exists( 'wc_get_cart_url' ) ? wc_get_cart_url() : $cart_url ); ?>" class="site-header__action-link" aria-label="<?php echo esc_attr( $cart_icon_alt ); ?>" data-cart-trigger>
					<img src="<?php echo esc_url( $cart_icon_url ); ?>" alt="<?php echo esc_attr( $cart_icon_alt ); ?>" class="site-header__action-icon" />
				</a>
			<?php endif; ?>

			<?php if ( $account_icon_url ) : ?>
				<a href="<?php echo esc_url( function_exists( 'wc_get_account_endpoint_url' ) ? wc_get_page_permalink( 'myaccount' ) : $account_url ); ?>" class="site-header__action-link" aria-label="<?php echo esc_attr( $account_icon_alt ); ?>">
					<img src="<?php echo esc_url( $account_icon_url ); ?>" alt="<?php echo esc_attr( $account_icon_alt ); ?>" class="site-header__action-icon" />
				</a>
			<?php endif; ?>
		</div>

	</div>
</header>
