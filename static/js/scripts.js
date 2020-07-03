let slideUp = (target, duration) => {
	target.style.transitionProperty = 'height, margin, padding';
	target.style.transitionDuration = duration + 'ms';
	target.style.boxSizing = 'border-box';
	target.style.height = target.offsetHeight + 'px';

	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0;
	target.style.marginTop = 0;
	target.style.marginBottom = 0;
	target.style.overflow = 'hidden';

	window.setTimeout( () => {
		target.style.display = 'none';
		target.style.removeProperty('height');
		target.style.removeProperty('padding-top'); 
		target.style.removeProperty('padding-bottom');
		target.style.removeProperty('margin-top');
		target.style.removeProperty('margin-bottom'); 
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration'); 
		target.style.removeProperty('transition-property');
	}, duration);
}

let slideDown = (target, duration) => {
	target.style.removeProperty('display');
	let display = window.getComputedStyle(target).display;
	if (display == 'none') {
		display = 'block';
	}
	target.style.display = display;

	let height = target.offsetHeight;
	target.style.height = 0;
	target.style.paddingTop = 0;
	target.style.paddingBottom = 0; 
	target.style.marginTop = 0; 
	target.style.marginBottom = 0; 
	target.style.overflow = 'hidden'; 

	target.style.boxSizing = 'border-box';
	target.style.transitionProperty = "height, margin, padding";  
	target.style.transitionDuration = duration + 'ms';
	target.style.height = height + 'px';
	target.style.removeProperty('padding-top'); 
	target.style.removeProperty('padding-bottom'); 
	target.style.removeProperty('margin-top'); 
	target.style.removeProperty('margin-bottom');

	window.setTimeout( () => {
		target.style.removeProperty('height');
		target.style.removeProperty('overflow');
		target.style.removeProperty('transition-duration');
		target.style.removeProperty('transition-property');
	}, duration);
}

let slideToggle = (target, duration = 500) => {
	if (getComputedStyle(target).display == 'block') {
		slideUp(target, duration);
	} else {
		slideDown(target, duration);
	}
}

let removeAllChildren = (target) => {
	if (target) {
		while (target.firstChild) {
			target.firstChild.remove();
		}
	}
}

class HamburgerToggler {
	constructor() {
		const hamburgerBarOne = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		hamburgerBarOne.setAttributeNS(null, 'd', 'M3 6h18');
		const hamburgerBarTwo = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		hamburgerBarTwo.setAttributeNS(null, 'd', 'M3 12h18');
		const hamburgerBarThree = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		hamburgerBarThree.setAttributeNS(null, 'd', 'M3 18h18');

		const hamburgerCloseOne = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		hamburgerCloseOne.setAttributeNS(null, 'd', 'M18 6L6 18');
		const hamburgerCloseTwo = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		hamburgerCloseTwo.setAttributeNS(null, 'd', 'M6 6l12 12');

		this.makeHamburgerBars = (hamburger) => {
			if (hamburger) {
				removeAllChildren(hamburger);
				hamburger.appendChild(hamburgerBarOne);
				hamburger.appendChild(hamburgerBarTwo);
				hamburger.appendChild(hamburgerBarThree);
			}
		};

		this.makeHamburgerClose = (hamburger) => {
			if (hamburger) {
				removeAllChildren(hamburger);
				hamburger.appendChild(hamburgerCloseOne);
				hamburger.appendChild(hamburgerCloseTwo);
			}
		};

		this.toggleHamburger = function () {
			let hamburgerButton = document.querySelector('.hamburger-path-group');
			let hamburgerPaths = hamburgerButton.children;

			if (hamburgerPaths.length == 3) {
				this.makeHamburgerClose(hamburgerButton);
			}
			else {
				this.makeHamburgerBars(hamburgerButton);
			}
		};
	}
}

class SidebarContentToggler {
	constructor() {
		let createChevronUp = () => {
			let chevronUp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			chevronUp.setAttributeNS(null, 'd', 'M16 6.594l-.72.687l-12.5 12.5l1.44 1.44L16 9.437l11.78 11.78l1.44-1.437l-12.5-12.5l-.72-.686z');
			return chevronUp;
		}
		let createChevronDown = () => {
			let chevronDown = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			chevronDown.setAttributeNS(null, 'd', 'M4.22 10.78l-1.44 1.44l12.5 12.5l.72.686l.72-.687l12.5-12.5l-1.44-1.44L16 22.564L4.22 10.78z');
			return chevronDown;
		}

		this.toggleContentClose = function (target) {
			removeAllChildren(target);
			target.appendChild(createChevronUp());
		};
		this.toggleContentOpen = function (target) {
			removeAllChildren(target);
			target.appendChild(createChevronDown());
		};
		this.initAllSidebarContentDisplay = function () {
			let allSidebars = document.getElementsByClassName('sideBoxContent');
			Array.from(allSidebars).forEach(function (element) {
				var chevron = element.previousElementSibling.querySelector('.sideBoxChevron');

				if (chevron) {
					if (getComputedStyle(element).display == 'block') {
						chevron.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" style="vertical-align: -0.2em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path d="M4.22 10.78l-1.44 1.44l12.5 12.5l.72.686l.72-.687l12.5-12.5l-1.44-1.44L16 22.564L4.22 10.78z" /></svg>';
					}
					else {
						chevron.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" role="img" width="1em" height="1em" style="vertical-align: -0.2em;-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);" preserveAspectRatio="xMidYMid meet" viewBox="0 0 32 32"><path d="M16 6.594l-.72.687l-12.5 12.5l1.44 1.44L16 9.437l11.78 11.78l1.44-1.437l-12.5-12.5l-.72-.686z" /></svg>';
					}
				}
			});
		};
	}
}

window.onload = function() {
	let ht = new HamburgerToggler();
	let sct = new SidebarContentToggler();
	let mt = document.getElementById('menu-toggler');

	sct.initAllSidebarContentDisplay();

	mt.addEventListener('click', function() {
		slideToggle(document.getElementById('nav-toggle'), 500);
		ht.toggleHamburger();		
	});


	let sideboxes = document.getElementsByClassName('sideBoxHeader');
	Array.from(sideboxes).forEach(function(element) {
		element.addEventListener('click', function(e) {
			e.preventDefault();
			var block = element.nextElementSibling;
			var chevron = element.querySelector('.sideBoxChevron svg');

			if (getComputedStyle(block).display == 'block') {
				slideUp(block, 500);
				sct.toggleContentClose(chevron);
			}
			else {
				slideDown(block, 500);
				sct.toggleContentOpen(chevron);
			}
		});
	});

	window.addEventListener('scroll', function() {
		let backToTop = document.querySelector('.backToTop');
		if (window.scrollY + window.innerHeight > window.innerHeight) {
			backToTop.classList.remove('hide-backtotop');
			backToTop.classList.add('show-backtotop');
		}
		else {
			backToTop.classList.remove('show-backtotop');
			backToTop.classList.add('hide-backtotop');
		}
	});

	window.addEventListener('resize', function() {
		// handle chevrons
		sct.initAllSidebarContentDisplay();
		
		// handle hamburger
		let fontSize = parseFloat(getComputedStyle(document.querySelector('html'))['font-size']);
		let innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

		if (innerWidth / fontSize >= 40) {
			slideDown(document.getElementById('nav-toggle'), 100);
			ht.makeHamburgerClose();
		}
		else {
			slideUp(document.getElementById('nav-toggle'), 100);
			ht.makeHamburgerBars();
		}
	})
}
