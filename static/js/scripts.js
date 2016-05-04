$(document).foundation();

$(window).scroll(function() {

	if ($(window).scrollTop() + $(window).height() > $(window).height()) {
		$('.backToTop').fadeIn('medium');
	}
	else {
		$('.backToTop').fadeOut('medium');
	}
});

$('.sideBoxHeader').click(function() {
	var block = $(this).next();
	if (block.css('display') == 'block') {
		block.slideUp();
		$(this).children().find('i').removeClass('fa-chevron-down').addClass('fa-chevron-up');
	}
	else {
		block.slideDown();
		$(this).children().find('i').removeClass('fa-chevron-up').addClass('fa-chevron-down');
	}
});