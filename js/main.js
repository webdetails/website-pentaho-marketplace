if (!Modernizr.svg) {
  $("#marketplace-logo").attr("src", "img/marketplace-logo.png");
}

$('.show-more-dev-stages').click(function() {
	$(this).toggleClass('active');
	$('.more-dev-stages').slideToggle();
	if($(this).hasClass('active')) {
		$(this).text('Less Options');
	} else {
		$(this).text('More Options');
	}
});

$('.plugins-filters .single-filter-button').click(function() {
	if($(this).attr('data-checked') == 'true') {
		$(this).attr('data-checked', 'false');
	} else {
		$(this).attr('data-checked', 'true');
	}
	/*var activeFilters = $('.plugins-filters button[data-checked=true]').length;
	$('.filters-header-count-number').html(activeFilters);*/
});

$('.clear-all-filters').click(function() {
	$('.plugins-filters  .single-filter-button').attr('data-checked', 'false');
	$('.plugins-filters  #button-filters-show-all').attr('data-checked', 'true');

	/*var activeFilters = $('.plugins-filters button[data-checked=true]').length;
	$('.filters-header-count-number').html(0);*/
});

$('#inputSearch').focus(function() {
	$('.page-plugins').removeClass('filtering');
	$('#filter-button').removeClass('active');
});