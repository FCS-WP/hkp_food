<?php

/**
 * Server-side render for Our Story block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

$image_url       = esc_url( $attributes['imageUrl'] ?? '' );
$image_alt       = esc_attr( $attributes['imageAlt'] ?? '' );
$heading         = wp_kses_post( $attributes['heading'] ?? '' );
$paragraph_one   = wp_kses_post( $attributes['paragraphOne'] ?? '' );
$paragraph_two   = wp_kses_post( $attributes['paragraphTwo'] ?? '' );
$paragraph_three = wp_kses_post( $attributes['paragraphThree'] ?? '' );

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="our-story__container">
		<div class="our-story__media">
			<?php if ( $image_url ) : ?>
				<img
					src="<?php echo $image_url; ?>"
					alt="<?php echo $image_alt; ?>"
					class="our-story__image"
					loading="lazy"
				/>
			<?php else : ?>
				<div class="our-story__image-placeholder" aria-hidden="true">IMAGE</div>
			<?php endif; ?>
		</div>

		<div class="our-story__content">
			<?php if ( $heading ) : ?>
				<h2 class="our-story__heading"><?php echo $heading; ?></h2>
			<?php endif; ?>

			<?php if ( $paragraph_one ) : ?>
				<p class="our-story__paragraph"><?php echo $paragraph_one; ?></p>
			<?php endif; ?>

			<?php if ( $paragraph_two ) : ?>
				<p class="our-story__paragraph"><?php echo $paragraph_two; ?></p>
			<?php endif; ?>

			<?php if ( $paragraph_three ) : ?>
				<p class="our-story__paragraph"><?php echo $paragraph_three; ?></p>
			<?php endif; ?>
		</div>
	</div>
</div>
