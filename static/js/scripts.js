$(document).foundation();

$(window).scroll(function() {

	if ($(window).scrollTop() + $(window).height() > $(window).height()) {
		$('.backToTop').fadeIn('medium');
	}
	else {
		$('.backToTop').fadeOut('medium');
	}
});