<?php

/**
 * Server-side render for Product Showcase block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

$heading     = esc_html($attributes['heading'] ?? '');
$description = esc_html($attributes['description'] ?? '');
$product_ids = $attributes['productIds'] ?? [];
$button_text = esc_html($attributes['buttonText'] ?? 'Shop Now');
$button_url  = esc_url($attributes['buttonUrl'] ?? '/shop');

$wrapper_attributes = get_block_wrapper_attributes();

// Fetch products
$products = [];
if (!empty($product_ids) && function_exists('wc_get_product')) {
    foreach ($product_ids as $product_id) {
        $product = wc_get_product($product_id);
        if ($product) {
            $products[] = $product;
        }
    }
}
?>

<div <?php echo $wrapper_attributes; ?>>
    <div class="product-showcase__container">
        <!-- Header -->
        <div class="product-showcase__header">
            <?php if ($heading) : ?>
                <h2 class="product-showcase__heading"><?php echo $heading; ?></h2>
            <?php endif; ?>

            <?php if ($description) : ?>
                <p class="product-showcase__description"><?php echo $description; ?></p>
            <?php endif; ?>
        </div>

        <!-- Products Grid -->
        <?php if (!empty($products)) : ?>
            <div class="product-showcase__grid">
                <?php foreach ($products as $product) : ?>
                    <?php
                    $product_id   = $product->get_id();
                    $product_name = $product->get_name();
                    $product_desc = $product->get_short_description() ?: $product->get_description();
                    $product_desc = wp_trim_words($product_desc, 20);
                    $product_url  = $product->get_permalink();
                    $product_img  = wp_get_attachment_image_url($product->get_image_id(), 'medium');
                    ?>
                    <a href="<?php echo esc_url($product_url); ?>" class="product-showcase__product">
                        <div class="product-showcase__product-image-wrapper">
                            <?php if ($product_img) : ?>
                                <img
                                    src="<?php echo esc_url($product_img); ?>"
                                    alt="<?php echo esc_attr($product_name); ?>"
                                    class="product-showcase__product-image"
                                    loading="lazy"
                                />
                            <?php endif; ?>
                        </div>
                        <h3 class="product-showcase__product-title"><?php echo esc_html($product_name); ?></h3>
                        <?php if ($product_desc) : ?>
                            <p class="product-showcase__product-description"><?php echo esc_html($product_desc); ?></p>
                        <?php endif; ?>
                    </a>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

        <!-- CTA Button -->
        <?php if ($button_text && $button_url) : ?>
            <div class="product-showcase__cta">
                <a href="<?php echo $button_url; ?>" class="product-showcase__button">
                    <?php echo $button_text; ?>
                </a>
            </div>
        <?php endif; ?>
    </div>
</div>
