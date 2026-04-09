/**
 * Testimonials Slider - Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
	const sliders = document.querySelectorAll('[data-slider]');

	sliders.forEach((slider) => {
		const slides = slider.querySelectorAll('[data-slide]');
		const prevBtn = slider.querySelector('[data-nav="prev"]');
		const nextBtn = slider.querySelector('[data-nav="next"]');

		if (slides.length <= 1) return;

		let currentSlide = 0;

		const showSlide = (index) => {
			slides.forEach((slide, i) => {
				if (i === index) {
					slide.setAttribute('data-active', '');
				} else {
					slide.removeAttribute('data-active');
				}
			});

			// Update button states
			if (prevBtn) {
				prevBtn.disabled = index === 0;
			}
			if (nextBtn) {
				nextBtn.disabled = index === slides.length - 1;
			}
		};

		// Navigation
		if (prevBtn) {
			prevBtn.addEventListener('click', () => {
				if (currentSlide > 0) {
					currentSlide--;
					showSlide(currentSlide);
				}
			});
		}

		if (nextBtn) {
			nextBtn.addEventListener('click', () => {
				if (currentSlide < slides.length - 1) {
					currentSlide++;
					showSlide(currentSlide);
				}
			});
		}

		// Initialize
		showSlide(0);
	});
});
