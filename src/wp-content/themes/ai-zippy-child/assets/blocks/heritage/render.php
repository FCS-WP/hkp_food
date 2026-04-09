<?php

/**
 * Server-side render for Heritage block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

$image1_url    = esc_url($attributes['image1Url'] ?? '');
$image1_alt    = esc_attr($attributes['image1Alt'] ?? '');
$image2_url    = esc_url($attributes['image2Url'] ?? '');
$image2_alt    = esc_attr($attributes['image2Alt'] ?? '');
$heading       = esc_html($attributes['heading'] ?? '');
$description   = esc_html($attributes['description'] ?? '');

$wrapper_attributes = get_block_wrapper_attributes();
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="heritage__container">
        <!-- Left column - Images -->
        <div class="heritage__images">
            <?php if ($image1_url) : ?>
                <div class="heritage__image-wrapper heritage__image-wrapper--1">
                    <img
                        src="<?php echo $image1_url; ?>"
                        alt="<?php echo $image1_alt; ?>"
                        class="heritage__image heritage__image--1"
                        loading="lazy"
                    />
                </div>
            <?php endif; ?>

            <?php if ($image2_url) : ?>
                <div class="heritage__image-wrapper heritage__image-wrapper--2">
                    <img
                        src="<?php echo $image2_url; ?>"
                        alt="<?php echo $image2_alt; ?>"
                        class="heritage__image heritage__image--2"
                        loading="lazy"
                    />
                </div>
            <?php endif; ?>
        </div>

        <!-- Right column - Content -->
        <div class="heritage__content">
            <?php if ($heading) : ?>
                <h2 class="heritage__heading"><?php echo $heading; ?></h2>
            <?php endif; ?>

            <?php if ($description) : ?>
                <p class="heritage__description"><?php echo $description; ?></p>
            <?php endif; ?>
        </div>
    </div>
</div>
