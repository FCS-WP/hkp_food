<?php

/**
 * Server-side render for Brand Story block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

$icon_url     = esc_url($attributes['iconUrl'] ?? '');
$icon_alt     = esc_attr($attributes['iconAlt'] ?? '');
$heading      = esc_html($attributes['heading'] ?? '');
$description  = esc_html($attributes['description'] ?? '');
$image_url    = esc_url($attributes['imageUrl'] ?? '');
$image_alt    = esc_attr($attributes['imageAlt'] ?? '');

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="brand-story__container">
        <!-- Left column - Content -->
        <div class="brand-story__content">
            <?php if ($icon_url) : ?>
                <div class="brand-story__icon-wrapper">
                    <img
                        src="<?php echo $icon_url; ?>"
                        alt="<?php echo $icon_alt; ?>"
                        class="brand-story__icon-img"
                    />
                </div>
            <?php endif; ?>

            <?php if ($heading) : ?>
                <h2 class="brand-story__heading"><?php echo $heading; ?></h2>
            <?php endif; ?>

            <?php if ($description) : ?>
                <p class="brand-story__description"><?php echo $description; ?></p>
            <?php endif; ?>
        </div>

        <!-- Right column - Image -->
        <div class="brand-story__media">
            <?php if ($image_url) : ?>
                <img
                    src="<?php echo $image_url; ?>"
                    alt="<?php echo $image_alt; ?>"
                    class="brand-story__image"
                    loading="lazy"
                />
            <?php endif; ?>
        </div>
    </div>
</div>
