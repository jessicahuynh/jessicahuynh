$(document).foundation();

$(window).scroll(function() {
	var mastheadHeight = $('.masthead').height();

	if ($(window).scrollTop() + $(window).height() > $(document).height() - mastheadHeight) {
		$('.backToTop').fadeIn('medium');
	}
	else {
		$('.backToTop').fadeOut('medium');
	}
});