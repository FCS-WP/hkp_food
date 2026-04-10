<?php
/**
 * Store Locator block render template.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content.
 * @var WP_Block $block      Block instance.
 */

$heading = ! empty( $attributes['heading'] ) ? $attributes['heading'] : __( 'Locate Your Nearest Outlet', 'ai-zippy-child' );
?>

<section <?php echo get_block_wrapper_attributes( [ 'class' => 'store-locator' ] ); ?>>
	<h2 class="store-locator__heading"><?php echo wp_kses_post( $heading ); ?></h2>
	<div class="store-locator__map-wrapper">
		<?php echo do_shortcode( '[ASL_STORELOCATOR]' ); ?>
	</div>
</section>
