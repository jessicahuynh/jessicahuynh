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