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
	var $this = $(this);

	if($(this).attr('data-checked') == 'true') {
		$(this).attr('data-checked', 'false');
	} else {
		$(this).attr('data-checked', 'true');
	}
	
	var totalFilters = $this.closest('.filters-subsection-items').find('button.single-filter-button').length;
	var activeFilters = $this.closest('.filters-subsection-items').find('button.single-filter-button[data-checked=true]').length;
	
	if(activeFilters == totalFilters) {
		$this.closest('.filters-subsection').find('.filters-state').removeClass('some-checked');
		$this.closest('.filters-subsection').find('.filters-state').addClass('all-checked');
	} else if((activeFilters != totalFilters) && activeFilters > 0) {
		$this.closest('.filters-subsection').find('.filters-state').removeClass('all-checked');
		$this.closest('.filters-subsection').find('.filters-state').addClass('some-checked');		
	} else if((activeFilters != totalFilters) && activeFilters == 0) {
		$this.closest('.filters-subsection').find('.filters-state').removeClass('all-checked');
		$this.closest('.filters-subsection').find('.filters-state').removeClass('some-checked');		
	}
});

$('.clear-all-filters').click(function() {
	$('.plugins-filters  .single-filter-button').attr('data-checked', 'false');
	$('.plugins-filters  #button-filters-show-all').attr('data-checked', 'true');
	$('.plugins-filters  #button-filters-all-apps').attr('data-checked', 'true');
});

$('#inputSearch').focus(function() {
	$('.page-plugins').removeClass('filtering');
	$('#filter-button').removeClass('active');
});

$('.filters-subsection .filters-title').click(function() {
	$(this).toggleClass('open');
	$(this).closest('.filters-subsection').find('.filters-subsection-items').slideToggle();
});

$('.filters-subsection .filters-state').click(function() {
	var $this = $(this);

	if($this.hasClass('some-checked') || $this.hasClass('all-checked')) {
		$this.removeClass('some-checked');
		$this.removeClass('all-checked');
		$this.closest('.filters-subsection').find('.filters-subsection-items .single-filter-button').each(function() {
			$(this).attr('data-checked', 'false')
		});
	} else {
		$this.addClass('all-checked');
		$this.closest('.filters-subsection').find('.filters-subsection-items .single-filter-button').each(function() {
			$(this).attr('data-checked', 'true')
		});
	}
});