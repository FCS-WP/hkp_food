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

    // Sequential payment-box toggle on checkout / order-pay (prevents slide jump).
    if (function_exists('is_checkout') && (is_checkout() || is_wc_endpoint_url('order-pay'))) {
        $payment_js = get_stylesheet_directory() . '/assets/js/wc-payment-toggle.js';

        if (file_exists($payment_js)) {
            wp_enqueue_script(
                'ai-zippy-child-wc-payment-toggle',
                get_stylesheet_directory_uri() . '/assets/js/wc-payment-toggle.js',
                ['jquery'],
                filemtime($payment_js),
                true
            );
        }
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

/**
 * Register Chinese Name meta field for WooCommerce products.
 */
function ai_zippy_child_register_chinese_name_meta(): void
{
    register_post_meta('product', 'chinese_name', [
        'type'          => 'string',
        'single'        => true,
        'show_in_rest'  => true,
        'auth_callback' => function () {
            return current_user_can('edit_posts');
        },
    ]);
}
add_action('init', 'ai_zippy_child_register_chinese_name_meta');

/**
 * Add Chinese Name field to WooCommerce product data panel (General tab).
 */
function ai_zippy_child_add_chinese_name_field(): void
{
    woocommerce_wp_text_input([
        'id'          => 'chinese_name',
        'label'       => __('Chinese Name', 'ai-zippy-child'),
        'placeholder' => __('Enter product name in Chinese', 'ai-zippy-child'),
        'desc_tip'    => true,
        'description' => __('Displayed under the product name on the frontend.', 'ai-zippy-child'),
    ]);
}
add_action('woocommerce_product_options_general_product_data', 'ai_zippy_child_add_chinese_name_field');

/**
 * Save Chinese Name field value.
 */
function ai_zippy_child_save_chinese_name_field(int $post_id): void
{
    $chinese_name = isset($_POST['chinese_name']) ? sanitize_text_field(wp_unslash($_POST['chinese_name'])) : '';

    if (!empty($chinese_name)) {
        update_post_meta($post_id, 'chinese_name', $chinese_name);
    } else {
        delete_post_meta($post_id, 'chinese_name');
    }
}
add_action('woocommerce_process_product_meta', 'ai_zippy_child_save_chinese_name_field');

/**
 * Expose Chinese Name in WooCommerce REST API response.
 */
function ai_zippy_child_rest_add_chinese_name(): void
{
    register_rest_field('product', 'chinese_name', [
        'get_callback' => function (array $product): string {
            return (string) get_post_meta($product['id'], 'chinese_name', true);
        },
        'schema' => [
            'type'    => 'string',
            'context' => ['view', 'edit'],
        ],
    ]);
}
add_action('rest_api_init', 'ai_zippy_child_rest_add_chinese_name');

/**
 * Inject Chinese Name right after the post title block on single product pages.
 */
function ai_zippy_child_inject_chinese_name_after_title(string $block_content, array $block): string
{
    if ('core/post-title' !== $block['blockName']) {
        return $block_content;
    }

    if (!is_product()) {
        return $block_content;
    }

    $chinese_name = get_post_meta(get_the_ID(), 'chinese_name', true);

    if (empty($chinese_name)) {
        return $block_content;
    }

    $span = '<span class="product-chinese-name has-x-large-font-size">' . esc_html($chinese_name) . '</span>';

    return $block_content . $span;
}
add_filter('render_block', 'ai_zippy_child_inject_chinese_name_after_title', 10, 2);

/**
 * Add Chinese Name to the custom shop filter API response.
 */
function ai_zippy_child_add_chinese_name_to_shop_api(\WP_REST_Response $response, $server, \WP_REST_Request $request): \WP_REST_Response
{
    if (strpos($request->get_route(), '/ai-zippy/v1/products') === false) {
        return $response;
    }

    $data = $response->get_data();

    if (empty($data['products'])) {
        return $response;
    }

    foreach ($data['products'] as &$product) {
        $product['chineseName'] = (string) get_post_meta($product['id'], 'chinese_name', true);
    }

    $response->set_data($data);
    return $response;
}
add_filter('rest_post_dispatch', 'ai_zippy_child_add_chinese_name_to_shop_api', 10, 3);

/**
 * Add Chinese Name to WooCommerce Store API cart item data via ExtendSchema.
 * This puts data at item.extensions['ai-zippy-child'].chineseName in the Store API response.
 */
function ai_zippy_child_register_chinese_name_store_api(): void
{
    if (!function_exists('woocommerce_store_api_register_endpoint_data')) {
        return;
    }
    woocommerce_store_api_register_endpoint_data([
        'endpoint'        => \Automattic\WooCommerce\StoreApi\Schemas\V1\CartItemSchema::IDENTIFIER,
        'namespace'       => 'ai-zippy-child',
        'data_callback'   => function ($cart_item) {
            $product = $cart_item['data'] ?? null;
            if (!$product instanceof \WC_Product) {
                return ['chineseName' => ''];
            }
            return [
                'chineseName' => (string) get_post_meta($product->get_id(), 'chinese_name', true),
            ];
        },
        'schema_callback' => function () {
            return [
                'chineseName' => [
                    'description' => __('Chinese name for the product.', 'ai-zippy-child'),
                    'type'        => 'string',
                    'readonly'    => true,
                ],
            ];
        },
    ]);
}
add_action('woocommerce_blocks_loaded', 'ai_zippy_child_register_chinese_name_store_api');
add_action('init', 'ai_zippy_child_register_chinese_name_store_api', 20);

/**
 * Append Chinese Name after the quantity in classic checkout cart-item rows.
 * This keeps the product name and quantity on the first line, and puts the
 * Chinese name on its own second line.
 *
 * Used by: review-order.php (default WC classic checkout).
 */
function ai_zippy_child_append_chinese_name_after_quantity(string $html, array $cart_item, string $cart_item_key): string
{
    $product = $cart_item['data'] ?? null;
    if (!$product instanceof \WC_Product) {
        return $html;
    }
    $chinese_name = (string) get_post_meta($product->get_id(), 'chinese_name', true);
    if ($chinese_name === '') {
        return $html;
    }
    return $html . '<span class="cart-item-chinese-name">' . esc_html($chinese_name) . '</span>';
}
add_filter('woocommerce_checkout_cart_item_quantity', 'ai_zippy_child_append_chinese_name_after_quantity', 10, 3);

/**
 * Append Chinese Name to WC order-item name on form-pay.php (order-pay page)
 * where the product-name and product-quantity live in SEPARATE <td> cells.
 * Skips emails and order-details-item.php (handled by quantity_html filter below).
 */
function ai_zippy_child_append_chinese_name_to_order_item_name($name, $item, $is_visible)
{
    if (did_action('woocommerce_email_header')) {
        return $name;
    }
    if (!$item instanceof \WC_Order_Item_Product) {
        return $name;
    }
    // order-details-item.php puts name + qty in same cell; that case is handled
    // by the quantity_html filter so the Chinese name lands on line 2.
    if (!function_exists('is_checkout_pay_page') || !is_checkout_pay_page()) {
        return $name;
    }
    $product_id = $item->get_product_id();
    if (!$product_id) {
        return $name;
    }
    $chinese_name = (string) get_post_meta($product_id, 'chinese_name', true);
    if ($chinese_name === '') {
        return $name;
    }
    return $name . '<span class="order-item-chinese-name">' . esc_html($chinese_name) . '</span>';
}
add_filter('woocommerce_order_item_name', 'ai_zippy_child_append_chinese_name_to_order_item_name', 10, 3);

/**
 * Append Chinese Name AFTER the order-item quantity for order-details-item.php
 * (View Order / My Account → Orders) so the name + quantity stay on line 1
 * and the Chinese name wraps to line 2. Skips pay page (separate cells) and
 * emails (clean HTML).
 */
function ai_zippy_child_append_chinese_name_to_order_item_quantity_html($html, $item)
{
    if (did_action('woocommerce_email_header')) {
        return $html;
    }
    if (!$item instanceof \WC_Order_Item_Product) {
        return $html;
    }
    if (function_exists('is_checkout_pay_page') && is_checkout_pay_page()) {
        return $html;
    }
    $product_id = $item->get_product_id();
    if (!$product_id) {
        return $html;
    }
    $chinese_name = (string) get_post_meta($product_id, 'chinese_name', true);
    if ($chinese_name === '') {
        return $html;
    }
    return $html . '<span class="order-item-chinese-name">' . esc_html($chinese_name) . '</span>';
}
add_filter('woocommerce_order_item_quantity_html', 'ai_zippy_child_append_chinese_name_to_order_item_quantity_html', 10, 2);

/**
 * Append Chinese Name to classic WooCommerce cart-item name output.
 * Used by: parent theme's custom form-checkout.php order summary and the
 * classic mini-cart / cart templates that DON'T render a quantity after the name.
 */
function ai_zippy_child_append_chinese_name_to_cart_item_name(string $name, array $cart_item, string $cart_item_key): string
{
    $product = $cart_item['data'] ?? null;
    if (!$product instanceof \WC_Product) {
        return $name;
    }
    $chinese_name = (string) get_post_meta($product->get_id(), 'chinese_name', true);
    if ($chinese_name === '') {
        return $name;
    }
    // Skip for review-order.php rows (handled by quantity filter above) to avoid duplicates.
    if (did_action('woocommerce_review_order_before_cart_contents') && !did_action('woocommerce_review_order_after_cart_contents')) {
        return $name;
    }
    return $name . '<span class="cart-item-chinese-name">' . esc_html($chinese_name) . '</span>';
}
add_filter('woocommerce_cart_item_name', 'ai_zippy_child_append_chinese_name_to_cart_item_name', 10, 3);

/**
 * Inject Chinese Name into WooCommerce mini-cart / cart block via JS.
 */
function ai_zippy_child_cart_chinese_name_script(): void
{
    // Build initial map from current cart so the first render works.
    $initial = [];
    if (function_exists('WC') && WC()->cart) {
        foreach (WC()->cart->get_cart() as $cart_item) {
            $product = $cart_item['data'] ?? null;
            if (!$product instanceof \WC_Product) {
                continue;
            }
            $cn = (string) get_post_meta($product->get_id(), 'chinese_name', true);
            if ($cn !== '') {
                $initial[$product->get_name()] = $cn;
            }
        }
    }
    ?>
    <script>
    (function(){
        var cn = <?php echo wp_json_encode($initial, JSON_UNESCAPED_UNICODE); ?> || {};

        function inject(){
            document.querySelectorAll('.wc-block-cart-item__product').forEach(function(el){
                var nameEl = el.querySelector('.wc-block-components-product-name');
                if (!nameEl) return;
                var name = nameEl.textContent.trim();
                var chineseName = cn[name];
                if (!chineseName) return;

                var existing = el.querySelector('.cart-chinese-name');
                if (existing) {
                    if (existing.textContent !== chineseName) existing.textContent = chineseName;
                    return;
                }

                var span = document.createElement('span');
                span.className = 'cart-chinese-name';
                span.textContent = chineseName;
                // Insert after the visible product name link
                var visibleName = el.querySelector('a.wc-block-components-product-name') || nameEl;
                visibleName.insertAdjacentElement('afterend', span);
            });
        }

        // Intercept Store API responses to capture names for items added later.
        var origFetch = window.fetch;
        if (origFetch) {
            window.fetch = function(){
                var args = arguments;
                return origFetch.apply(this, args).then(function(response){
                    var url = typeof args[0] === 'string' ? args[0] : (args[0] && args[0].url) || '';
                    if (url.indexOf('/wc/store/v1/cart') !== -1) {
                        response.clone().json().then(function(data){
                            if (data && data.items) {
                                data.items.forEach(function(item){
                                    var v = item.extensions && item.extensions['ai-zippy-child'] && item.extensions['ai-zippy-child'].chineseName;
                                    if (v) cn[item.name] = v;
                                });
                                inject();
                            }
                        }).catch(function(){});
                    }
                    return response;
                });
            };
        }

        function init(){
            inject();
            new MutationObserver(inject).observe(document.body, { childList: true, subtree: true });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            init();
        }
    })();
    </script>
    <?php
}
add_action('wp_footer', 'ai_zippy_child_cart_chinese_name_script');