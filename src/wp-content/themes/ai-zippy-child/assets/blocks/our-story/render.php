<?php

/**
 * Server-side render for Our Story block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content (InnerBlocks output).
 * @var WP_Block $block      Block instance.
 */

$image_url  = esc_url( $attributes['imageUrl'] ?? '' );
$image_alt  = esc_attr( $attributes['imageAlt'] ?? '' );
$left_width = intval( $attributes['leftWidth'] ?? 30 );
$right_width = intval( $attributes['rightWidth'] ?? 70 );

$wrapper_attributes = get_block_wrapper_attributes([
    'style' => "--os-left-width:{$left_width}%;--os-right-width:{$right_width}%;",
]);
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
				<div class="our-story__image-placeholder" aria-hidden="true"></div>
			<?php endif; ?>
		</div>

		<div class="our-story__content">
			<?php echo $content; ?>
		</div>
	</div>
</div>
