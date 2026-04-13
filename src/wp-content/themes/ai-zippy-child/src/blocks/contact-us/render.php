<?php
$address      = ! empty( $attributes['address'] ) ? $attributes['address'] : "352 Joo Chiat Road\nSingapore 427599";
$email        = ! empty( $attributes['email'] ) ? $attributes['email'] : 'connect@hokeepau.com';
$phone        = ! empty( $attributes['phone'] ) ? $attributes['phone'] : '+65 6742 1468';
$social_icons = ! empty( $attributes['socialIcons'] ) && is_array( $attributes['socialIcons'] ) ? $attributes['socialIcons'] : [];
$address_html = nl2br( esc_html( $address ) );
?>
<section <?php echo get_block_wrapper_attributes( [ 'class' => 'contact-us' ] ); ?>>
	<div class="contact-us__content-row">
		<div class="contact-us__card">
			<p><strong><?php esc_html_e( 'Address:', 'ai-zippy-child' ); ?></strong><br><?php echo $address_html; ?></p>
			<p><strong><?php esc_html_e( 'Email:', 'ai-zippy-child' ); ?></strong><br><a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_html( $email ); ?></a></p>
			<p><strong><?php esc_html_e( 'Phone:', 'ai-zippy-child' ); ?></strong><br><a href="tel:<?php echo esc_attr( preg_replace( '/\s+/', '', $phone ) ); ?>"><?php echo esc_html( $phone ); ?></a></p>
			<?php if ( ! empty( $social_icons ) ) : ?>
				<div class="contact-us__socials">
					<?php foreach ( $social_icons as $icon ) :
						if ( ! is_array( $icon ) ) {
							continue;
						}

						$image_url = '';
						if ( ! empty( $icon['imageUrl'] ) ) {
							$image_url = $icon['imageUrl'];
						} elseif ( ! empty( $icon['imageID'] ) ) {
							$image_url = wp_get_attachment_image_url( (int) $icon['imageID'], 'full' );
						} elseif ( ! empty( $icon['imageId'] ) ) {
							$image_url = wp_get_attachment_image_url( (int) $icon['imageId'], 'full' );
						}

						if ( ! $image_url ) {
							continue;
						}
					?>
						<a href="<?php echo esc_url( $icon['url'] ?? '#' ); ?>" target="_blank" rel="noopener noreferrer">
							<img src="<?php echo esc_url( $image_url ); ?>" alt="<?php echo esc_attr( $icon['imageAlt'] ?? '' ); ?>" class="contact-us__social-image" />
						</a>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
		<div class="contact-us__form-wrap"><?php echo do_shortcode( '[contact-form-7 id="0a4685c" title="Contact Us"]' ); ?></div>
	</div>
</section>
