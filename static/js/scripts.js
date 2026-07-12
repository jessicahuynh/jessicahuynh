const DEFAULT_TOGGLE_DURATION = 320;

const prefersReducedMotion = () => {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const getDuration = (duration = DEFAULT_TOGGLE_DURATION) => {
	return prefersReducedMotion() ? 0 : duration;
};

const whenTransitionEnds = (target, duration, done) => {
	let resolved = false;

	const cleanup = () => {
		target.removeEventListener('transitionend', onTransitionEnd);
		if (!resolved) {
			resolved = true;
			done();
		}
	};

	const onTransitionEnd = (event) => {
		if (event.target === target && event.propertyName === 'height') {
			cleanup();
		}
	};

	target.addEventListener('transitionend', onTransitionEnd);
	window.setTimeout(cleanup, duration + 40);
};

let slideUp = (target, duration = DEFAULT_TOGGLE_DURATION) => {
	if (!target || target.dataset.isAnimating === 'true') {
		return;
	}

	if (getComputedStyle(target).display === 'none') {
		return;
	}

	const animationDuration = getDuration(duration);
	target.dataset.isAnimating = 'true';
	target.style.overflow = 'hidden';
	target.style.height = target.scrollHeight + 'px';
	target.offsetHeight;
	target.style.transitionProperty = 'height';
	target.style.transitionDuration = animationDuration + 'ms';
	target.style.height = '0px';

	whenTransitionEnds(target, animationDuration, () => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.dataset.isAnimating = 'false';
	});
};

let slideDown = (target, duration = DEFAULT_TOGGLE_DURATION) => {
	if (!target || target.dataset.isAnimating === 'true') {
		return;
	}

	const animationDuration = getDuration(duration);
	target.dataset.isAnimating = 'true';
	target.style.removeProperty('display');

	let display = window.getComputedStyle(target).display;
	if (display === 'none') {
		display = 'block';
	}
	target.style.display = display;

	const targetHeight = target.scrollHeight;
	target.style.overflow = 'hidden';
	target.style.height = '0px';
	target.offsetHeight;
	target.style.transitionProperty = 'height';
	target.style.transitionDuration = animationDuration + 'ms';
	target.style.height = targetHeight + 'px';

	whenTransitionEnds(target, animationDuration, () => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
		target.dataset.isAnimating = 'false';
	});
};

let slideToggle = (target, duration = DEFAULT_TOGGLE_DURATION) => {
	if (!target || target.dataset.isAnimating === 'true') {
		return;
	}

	if (getComputedStyle(target).display === 'none') {
		slideDown(target, duration);
		return;
	}

	slideUp(target, duration);
};

const setExpandedState = (control, isExpanded) => {
	if (!control) {
		return;
	}

	control.classList.toggle('is-open', isExpanded);
	control.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
};

const ensureChevronSvg = (chevronContainer) => {
	if (!chevronContainer || chevronContainer.querySelector('svg')) {
		return;
	}

	chevronContainer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" viewBox="0 0 32 32"><path d="M4.22 10.78l-1.44 1.44l12.5 12.5l.72.686l.72-.687l12.5-12.5l-1.44-1.44L16 22.564L4.22 10.78z" /></svg>';
};

const syncSidebarControlState = (header, content) => {
	if (!header || !content) {
		return;
	}

	const isExpanded = getComputedStyle(content).display !== 'none';
	const link = header.querySelector('a');

	header.classList.toggle('is-open', isExpanded);
	if (link) {
		link.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
	}
};

const syncMenuStateByViewport = (menuToggler, navToggle) => {
	if (!menuToggler || !navToggle) {
		return;
	}

	const desktopView = window.matchMedia('(min-width: 40em)').matches;

	if (desktopView) {
		navToggle.style.removeProperty('display');
		navToggle.style.removeProperty('height');
		navToggle.style.removeProperty('overflow');
		navToggle.style.removeProperty('transition-duration');
		navToggle.style.removeProperty('transition-property');
		navToggle.dataset.isAnimating = 'false';
		setExpandedState(menuToggler, false);
		return;
	}

	navToggle.style.display = 'none';
	setExpandedState(menuToggler, false);
};

window.onload = function () {
	const menuToggler = document.getElementById('menu-toggler');
	const navToggle = document.getElementById('nav-toggle');

	if (menuToggler && navToggle) {
		menuToggler.setAttribute('role', 'button');
		menuToggler.setAttribute('tabindex', '0');
		menuToggler.setAttribute('aria-controls', 'nav-toggle');
		setExpandedState(menuToggler, false);
		syncMenuStateByViewport(menuToggler, navToggle);

		menuToggler.addEventListener('click', function () {
			const shouldOpen = getComputedStyle(navToggle).display === 'none';
			slideToggle(navToggle, 500);
			setExpandedState(menuToggler, shouldOpen);
		});

		menuToggler.addEventListener('keydown', function (event) {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				menuToggler.click();
			}
		});
	}

	const sideboxes = document.getElementsByClassName('sideBoxHeader');
	Array.from(sideboxes).forEach(function (header) {
		const content = header.nextElementSibling;
		const link = header.querySelector('a');
		const chevronContainer = header.querySelector('.sideBoxChevron');

		ensureChevronSvg(chevronContainer);

		if (link && content) {
			if (!content.id) {
				content.id = 'sidebox-content-' + Math.random().toString(36).slice(2, 9);
			}

			link.setAttribute('aria-controls', content.id);
			syncSidebarControlState(header, content);
		}

		header.addEventListener('click', function (event) {
			event.preventDefault();
			if (!content) {
				return;
			}

			const shouldOpen = getComputedStyle(content).display === 'none';
			slideToggle(content, 400);
			header.classList.toggle('is-open', shouldOpen);
			if (link) {
				link.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
			}
		});
	});

	window.addEventListener('scroll', function () {
		const backToTop = document.querySelector('.backToTop');
		if (!backToTop) {
			return;
		}

		if (window.scrollY + window.innerHeight > window.innerHeight) {
			backToTop.classList.remove('hide-backtotop');
			backToTop.classList.add('show-backtotop');
		}
		else {
			backToTop.classList.remove('show-backtotop');
			backToTop.classList.add('hide-backtotop');
		}
	});

	window.addEventListener('resize', function () {
		if (menuToggler && navToggle) {
			syncMenuStateByViewport(menuToggler, navToggle);
		}

		Array.from(sideboxes).forEach(function (header) {
			syncSidebarControlState(header, header.nextElementSibling);
		});
	});
};
