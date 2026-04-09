<?php

/**
 * Server-side render for Testimonials block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block inner content.
 * @var WP_Block $block      Block instance.
 */

$heading     = esc_html($attributes['heading'] ?? '');
$image_url   = esc_url($attributes['imageUrl'] ?? '');
$image_alt   = esc_attr($attributes['imageAlt'] ?? '');
$testimonials = $attributes['testimonials'] ?? [];

$wrapper_attributes = get_block_wrapper_attributes();

// Encode testimonials for JS
$testimonials_json = json_encode($testimonials);
?>

<div <?php echo $wrapper_attributes; ?> data-testimonials="<?php echo esc_attr($testimonials_json); ?>">
    <div class="testimonials__container">
        <!-- Left column - Image -->
        <div class="testimonials__image-col">
            <?php if ($image_url) : ?>
                <img
                    src="<?php echo $image_url; ?>"
                    alt="<?php echo $image_alt; ?>"
                    class="testimonials__image"
                    loading="lazy"
                />
            <?php endif; ?>
        </div>

        <!-- Right column - Slider -->
        <div class="testimonials__content-col">
            <?php if ($heading) : ?>
                <h2 class="testimonials__heading"><?php echo $heading; ?></h2>
            <?php endif; ?>

            <?php if (!empty($testimonials)) : ?>
                <div class="testimonials__slider" data-slider>
                    <div class="testimonials__slides">
                        <?php foreach ($testimonials as $index => $testimonial) : ?>
                            <div class="testimonials__slide" data-slide="<?php echo $index; ?>" <?php echo $index === 0 ? 'data-active' : ''; ?>>
                                <?php if (!empty($testimonial['quote'])) : ?>
                                    <p class="testimonials__quote"><?php echo esc_html($testimonial['quote']); ?></p>
                                <?php endif; ?>

                                <?php if (!empty($testimonial['rating'])) : ?>
                                    <div class="testimonials__rating">
                                        <?php for ($i = 1; $i <= 5; $i++) : ?>
                                            <span class="testimonials__star <?php echo $i <= $testimonial['rating'] ? 'is-active' : ''; ?>">★</span>
                                        <?php endfor; ?>
                                    </div>
                                <?php endif; ?>

                                <?php if (!empty($testimonial['author'])) : ?>
                                    <p class="testimonials__author"><?php echo esc_html($testimonial['author']); ?></p>
                                <?php endif; ?>
                            </div>
                        <?php endforeach; ?>
                    </div>

                    <?php if (count($testimonials) > 1) : ?>
                        <div class="testimonials__nav">
                            <button class="testimonials__nav-btn testimonials__nav-btn--prev" data-nav="prev" aria-label="<?php esc_attr_e('Previous testimonial', 'ai-zippy-child'); ?>">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="15 18 9 12 15 6" />
                                </svg>
                            </button>
                            <button class="testimonials__nav-btn testimonials__nav-btn--next" data-nav="next" aria-label="<?php esc_attr_e('Next testimonial', 'ai-zippy-child'); ?>">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="9 18 15 12 9 6" />
                                </svg>
                            </button>
                        </div>
                    <?php endif; ?>
                </div>
            <?php endif; ?>
        </div>
    </div>
</div>
