/**
 * Sequential payment-box toggle for WooCommerce checkout / order-pay.
 *
 * By default WooCommerce slides the previously-open .payment_box up AND slides
 * the newly-selected one down in parallel. When the two boxes have different
 * heights this produces a visible bounce in the surrounding layout. This
 * override queues the animations: close first, then open — so the total form
 * height transitions smoothly with no jump.
 */
(function ($) {
	'use strict';

	if (!$) {
		return;
	}

	var DURATION = 220;

	function handleChange() {
		var $methods = $('.woocommerce .payment_methods, form.checkout .payment_methods, #order_review .payment_methods');

		if (!$methods.length) {
			return;
		}

		$methods.each(function () {
			var $list = $(this);
			var $selected = $list.find('input[name="payment_method"]:checked');

			if (!$selected.length) {
				return;
			}

			var targetId = $selected.attr('id');
			var $targetBox = $list.find('div.payment_box.' + targetId);
			var $visibleBoxes = $list.find('div.payment_box').filter(':visible').not($targetBox);

			if ($visibleBoxes.length) {
				$visibleBoxes.stop(true, false).slideUp(DURATION, function () {
					if ($targetBox.length && !$targetBox.is(':visible')) {
						$targetBox.stop(true, false).slideDown(DURATION);
					}
				});
			} else if ($targetBox.length && !$targetBox.is(':visible')) {
				$targetBox.stop(true, false).slideDown(DURATION);
			}
		});
	}

	$(function () {
		var $body = $(document.body);

		// Remove WC's default parallel-slide handler, then attach ours.
		$body.off('click.wcPaymentMethodSelected', 'input[name="payment_method"]');
		$body.off('payment_method_selected');

		$body.on('click', 'input[name="payment_method"]', function () {
			// Defer so the :checked state is up to date.
			setTimeout(handleChange, 0);
		});

		$body.on('updated_checkout payment_method_selected', function () {
			setTimeout(handleChange, 0);
		});
	});
})(window.jQuery);
