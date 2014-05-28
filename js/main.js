if (!Modernizr.svg) {
  $("#marketplace-logo").attr("src", "img/marketplace-logo.png");
}

$('.show-more-dev-stages').click(function() {
	$(this).toggleClass('active');
	$('.more-dev-stages').slideToggle();
	if($(this).hasClass('active')) {
		$(this).text('Less');
	} else {
		$(this).text('More');
	}
});

$('.plugins-filters .single-filter-button').click(function() {
	if($(this).attr('data-checked') == 'true') {
		$(this).attr('data-checked', 'false');
	} else {
		$(this).attr('data-checked', 'true');
	}
});