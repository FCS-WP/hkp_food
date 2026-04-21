<?php

namespace AiZippy\Hooks;

use AiZippy\Core\Cache;

defined('ABSPATH') || exit;

/**
 * Cache invalidation hooks.
 *
 * Clears relevant caches when WooCommerce data changes.
 * All cache keys are defined in Core\Cache — check there first.
 */
class CacheInvalidation
{
    public static function register(): void
    {
        // Product changes
        add_action('woocommerce_update_product', [self::class, 'onProductChange']);
        add_action('woocommerce_new_product', [self::class, 'onProductChange']);
        add_action('woocommerce_delete_product', [self::class, 'onProductChange']);

        // Category changes
        add_action('edited_product_cat', [self::class, 'onProductChange']);
        add_action('created_product_cat', [self::class, 'onProductChange']);
        add_action('delete_product_cat', [self::class, 'onProductChange']);

        // Term assignments (bulk edits, direct category reassignments)
        add_action('set_object_terms', [self::class, 'onTermsSet'], 10, 6);
    }

    public static function onProductChange(): void
    {
        Cache::clearProductCaches();
    }

    /**
     * Fires when terms are assigned to an object (e.g. product categories bulk-edited).
     * Recounts term counts to keep hide_empty accurate, then clears cache.
     */
    public static function onTermsSet(int $object_id, array $terms, array $tt_ids, string $taxonomy, bool $append, array $old_tt_ids): void
    {
        if ($taxonomy !== 'product_cat') {
            return;
        }

        // Force an immediate recount so hide_empty reflects reality
        wp_update_term_count_now($tt_ids, $taxonomy);
        if (!empty($old_tt_ids)) {
            wp_update_term_count_now($old_tt_ids, $taxonomy);
        }

        Cache::clearProductCaches();
    }
}
