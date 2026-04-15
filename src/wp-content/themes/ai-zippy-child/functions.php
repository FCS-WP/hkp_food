<?php

/**
 * AI Zippy Child Theme Functions
 *
 * Add project-specific customizations here.
 * The parent theme (ai-zippy) handles Vite assets and core setup.
 */

defined('ABSPATH') || exit;

/**
 * Enqueue self-hosted fonts (Poppins, Urbanist).
 */
function ai_zippy_child_enqueue_fonts(): void
{
    $fonts_dir = get_stylesheet_directory() . '/assets/fonts';
    $fonts_uri = get_stylesheet_directory_uri() . '/assets/fonts';

    wp_enqueue_style(
        'ai-zippy-child-fonts-poppins',
        $fonts_uri . '/poppins.css',
        [],
        filemtime($fonts_dir . '/poppins.css')
    );

    wp_enqueue_style(
        'ai-zippy-child-fonts-urbanist',
        $fonts_uri . '/urbanist.css',
        [],
        filemtime($fonts_dir . '/urbanist.css')
    );
}
add_action('wp_enqueue_scripts', 'ai_zippy_child_enqueue_fonts', 5);
add_action('enqueue_block_editor_assets', 'ai_zippy_child_enqueue_fonts', 5);

/**
 * Register custom blocks from child theme.
 */
function ai_zippy_child_register_blocks(): void
{
    $blocks_dir = get_stylesheet_directory() . '/assets/blocks';

    if (!is_dir($blocks_dir)) {
        return;
    }

    foreach (glob($blocks_dir . '/*/block.json') as $block_json) {
        register_block_type(dirname($block_json));
    }
}
add_action('init', 'ai_zippy_child_register_blocks', 20);

/**
 * Enqueue child theme styles after parent.
 */
function ai_zippy_child_enqueue_assets(): void
{
    // Child theme custom styles (only if file exists)
    $child_css = get_stylesheet_directory() . '/assets/dist/css/style.css';

    if (file_exists($child_css)) {
        wp_enqueue_style(
            'ai-zippy-child-style',
            get_stylesheet_directory_uri() . '/assets/dist/css/style.css',
            ['ai-zippy-theme-css-0'],
            filemtime($child_css)
        );
    }
}
add_action('wp_enqueue_scripts', 'ai_zippy_child_enqueue_assets', 20);

/**
 * Show only the registration form on My Account for logged-out users.
 */
function ai_zippy_child_hide_my_account_login_form(string $template, string $template_name, string $template_path): string
{
    if (
        'myaccount/form-login.php' === $template_name
        && !is_user_logged_in()
        && 'yes' === get_option('woocommerce_enable_myaccount_registration')
    ) {
        $custom_template = get_stylesheet_directory() . '/woocommerce/myaccount/form-login.php';

        if (file_exists($custom_template)) {
            return $custom_template;
        }
    }

    return $template;
}
add_filter('woocommerce_locate_template', 'ai_zippy_child_hide_my_account_login_form', 10, 3);

/**
 * Redirect product category pages to the shop page with corresponding filter
 */
function ai_zippy_child_redirect_product_cat_archive() {
    if (is_tax('product_cat')) {
        $term = get_queried_object();
    
        if ($term && !is_wp_error($term) && !empty($term->slug)) {
            $new_url = add_query_arg('category', $term->slug, home_url('/shop/'));
            wp_safe_redirect($new_url, 301);
            exit;
        }
    }
}
add_action('template_redirect', 'ai_zippy_child_redirect_product_cat_archive');