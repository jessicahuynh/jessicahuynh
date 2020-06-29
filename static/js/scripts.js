$(document).foundation();

$(window).scroll(function() {

	if ($(window).scrollTop() + $(window).height() > $(window).height()) {
		$('.backToTop').fadeIn('medium');
	}
	else {
		$('.backToTop').fadeOut('medium');
	}
});

$('.sideBoxHeader').click(function(e) {
	e.preventDefault();
	var block = $(this).next();
	if (block.css('display') == 'block') {
		block.slideUp();
		$(this).children().find('i').filter(':last').removeClass('fa-chevron-down').removeClass('fa-chevron-right').addClass('fa-chevron-up');
	}
	else {
		block.slideDown();
		$(this).children().find('i').filter(':last').removeClass('fa-chevron-up').removeClass('fa-chevron-right').addClass('fa-chevron-down');
	}
});


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
	if (display === 'none') {
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
	if (window.getComputedStyle(target).display === 'none') {
		return slideDown(target, duration);
	} else {
		return slideUp(target, duration);
	}
}

let removeAllChildren = (target) => {
	while (target.firstChild) {
		target.firstChild.remove();
	}
}

function HamburgerToggler() {
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

	let makeHamburgerBars = (hamburger) => {
		removeAllChildren(hamburger);
		hamburger.appendChild(hamburgerBarOne);
		hamburger.appendChild(hamburgerBarTwo);
		hamburger.appendChild(hamburgerBarThree);
	}
	
	let makeHamburgerClose = (hamburger) => {
		removeAllChildren(hamburger);
		hamburger.appendChild(hamburgerCloseOne);
		hamburger.appendChild(hamburgerCloseTwo);
	}
	
	this.toggleHamburger = function() {
		let hamburgerButton = document.querySelector('.hamburger-path-group');
		let hamburgerPaths = hamburgerButton.children;
		
		if (hamburgerPaths.length == 3) {
			makeHamburgerClose(hamburgerButton);
		}
		else {
			makeHamburgerBars(hamburgerButton);
		}
	}
}


window.onload = function() {
	let ht = new HamburgerToggler()

	document.getElementById('menu-toggler').addEventListener('click', function () {
		slideToggle(document.getElementById('nav-toggle'), 500);

		// change between hamburger bars and close button for menu
		ht.toggleHamburger();
	});

	window.addEventListener('resize', function() {
		let fontSize = parseFloat(getComputedStyle(document.querySelector('html'))['font-size']);
		let innerWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

		if (innerWidth / fontSize >= 40) {
			slideDown(document.getElementById('nav-toggle'), 100);
		}
		else {
			slideUp(document.getElementById('nav-toggle'), 100);
		}
		ht.toggleHamburger();
	})
}
