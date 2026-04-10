<?php
/**
 * Site Footer block render template.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 */

$address     = ! empty( $attributes['address'] ) ? $attributes['address'] : '';
$email       = ! empty( $attributes['email'] ) ? $attributes['email'] : '';
$phone       = ! empty( $attributes['phone'] ) ? $attributes['phone'] : '';
$logo_url    = ! empty( $attributes['logoUrl'] ) ? $attributes['logoUrl'] : '';
$logo_alt    = ! empty( $attributes['logoAlt'] ) ? $attributes['logoAlt'] : 'Ho Kee Pau';
$social_icons = ! empty( $attributes['socialIcons'] ) ? $attributes['socialIcons'] : [];
$nav_links   = ! empty( $attributes['navLinks'] ) ? $attributes['navLinks'] : [];

// Convert newlines in address to <br>
$address_html = nl2br( esc_html( $address ) );
?>

<footer <?php echo get_block_wrapper_attributes( [ 'class' => 'site-footer' ] ); ?>>
	<div class="site-footer__inner">

		<!-- Left column: contact info + social icons -->
		<div class="site-footer__col site-footer__col--left">
			<?php if ( $address ) : ?>
				<p class="site-footer__address"><?php echo $address_html; ?></p>
			<?php endif; ?>

			<?php if ( $email ) : ?>
				<p class="site-footer__contact">
					E: <a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a>
				</p>
			<?php endif; ?>

			<?php if ( $phone ) : ?>
				<p class="site-footer__contact">
					T: <a href="tel:<?php echo esc_attr( preg_replace( '/\s+/', '', $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a>
				</p>
			<?php endif; ?>

			<?php if ( ! empty( $social_icons ) ) : ?>
				<div class="site-footer__socials">
					<?php foreach ( $social_icons as $icon ) :
						if ( empty( $icon['imageUrl'] ) ) continue;
					?>
						<a
							href="<?php echo esc_url( $icon['url'] ?? '#' ); ?>"
							class="site-footer__social-link"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src="<?php echo esc_url( $icon['imageUrl'] ); ?>"
								alt="<?php echo esc_attr( $icon['imageAlt'] ?? '' ); ?>"
								class="site-footer__social-icon"
							/>
						</a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>

		<!-- Centre column: logo image -->
		<div class="site-footer__col site-footer__col--centre">
			<?php if ( $logo_url ) : ?>
				<img
					src="<?php echo esc_url( $logo_url ); ?>"
					alt="<?php echo esc_attr( $logo_alt ); ?>"
					class="site-footer__logo"
				/>
			<?php endif; ?>
		</div>

		<!-- Right column: navigation links -->
		<div class="site-footer__col site-footer__col--right">
			<?php if ( ! empty( $nav_links ) ) : ?>
				<nav class="site-footer__nav" aria-label="<?php esc_attr_e( 'Footer Navigation', 'ai-zippy-child' ); ?>">
					<?php foreach ( $nav_links as $link ) :
						if ( empty( $link['label'] ) ) continue;
					?>
						<a
							href="<?php echo esc_url( $link['url'] ?? '#' ); ?>"
							class="site-footer__nav-link"
						><?php echo esc_html( $link['label'] ); ?></a>
					<?php endforeach; ?>
				</nav>
			<?php endif; ?>
		</div>

	</div>
</footer>
