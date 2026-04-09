<?php

/**
 * Server-side render for Features block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

$wrapper_attributes = get_block_wrapper_attributes();

$features = [
	[
		'icon_url'    => esc_url($attributes['feature1IconUrl'] ?? ''),
		'icon_alt'    => esc_attr($attributes['feature1IconAlt'] ?? ''),
		'heading'     => esc_html($attributes['feature1Heading'] ?? ''),
		'description' => esc_html($attributes['feature1Description'] ?? ''),
	],
	[
		'icon_url'    => esc_url($attributes['feature2IconUrl'] ?? ''),
		'icon_alt'    => esc_attr($attributes['feature2IconAlt'] ?? ''),
		'heading'     => esc_html($attributes['feature2Heading'] ?? ''),
		'description' => esc_html($attributes['feature2Description'] ?? ''),
	],
	[
		'icon_url'    => esc_url($attributes['feature3IconUrl'] ?? ''),
		'icon_alt'    => esc_attr($attributes['feature3IconAlt'] ?? ''),
		'heading'     => esc_html($attributes['feature3Heading'] ?? ''),
		'description' => esc_html($attributes['feature3Description'] ?? ''),
	],
];
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="features__container">
		<?php foreach ($features as $index => $feature) : ?>
			<?php if ($index > 0) : ?>
				<div class="features__divider"></div>
			<?php endif; ?>

			<div class="features__item">
				<?php if ($feature['icon_url']) : ?>
					<div class="features__icon-wrapper">
						<img
							src="<?php echo $feature['icon_url']; ?>"
							alt="<?php echo $feature['icon_alt']; ?>"
							class="features__icon"
							loading="lazy"
						/>
					</div>
				<?php endif; ?>

				<?php if ($feature['heading']) : ?>
					<h3 class="features__heading"><?php echo $feature['heading']; ?></h3>
				<?php endif; ?>

				<?php if ($feature['description']) : ?>
					<p class="features__description"><?php echo $feature['description']; ?></p>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>
</div>
