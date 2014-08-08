$.preloadImages = function() {
  for (var i = 0; i < arguments.length; i++) {
    $("<img />").attr("src", arguments[i]);
    console.log($("<img />").attr("src", arguments[i]));
  }
}

$(document).ready(function() {
	if (!Modernizr.svg) {
	  	$("#marketplace-logo").attr("src", "img/marketplace-logo.png");

		$.preloadImages(
			'img/checked.png',
			'img/close-details.png',
			'img/contact-button-icon.png',
			'img/develop-plugins-icon.png',
			'img/dev-stage-01.png',
			'img/dev-stage-01-inactive.png',
			'img/dev-stage-01-large.png',
			'img/dev-stage-02.png',
			'img/dev-stage-02-inactive.png',
			'img/dev-stage-02-large.png',
			'img/dev-stage-03.png',
			'img/dev-stage-03-inactive.png',
			'img/dev-stage-03-large.png',
			'img/dev-stage-04.png',
			'img/dev-stage-04-inactive.png',
			'img/dev-stage-04-large.png',
			'img/dev-stage-community-01.png',
			'img/dev-stage-community-01-large.png',
			'img/dev-stage-community-02.png',
			'img/dev-stage-community-02-large.png',
			'img/dev-stage-community-03.png',
			'img/dev-stage-community-03-large.png',
			'img/dev-stage-community-04.png',
			'img/dev-stage-community-04-large.png',
			'img/download-button-icon.png',
			'img/download-marketplace-icon.png',
			'img/filter.png',
			'img/filter-hover.png',
			'img/info-icon.png',
			'img/live-demo-button-icon.png',
			'img/marketplace-logo.png',
			'img/more-less-options.png',
			'img/search.png',
			'img/search-hover.png',
			'img/share-blogger-icon.png',
			'img/share-email-icon.png',
			'img/share-fb-icon.png',
			'img/share-linkedin-icon.png',
			'img/share-twitter-icon.png',
			'img/some-checked.png',
			'img/submit-plugins-icon.png',
			'img/translate-pentaho-icon.png',
			'img/pentaho-marketplace-images/01.png',
			'img/pentaho-marketplace-images/02.png',
			'img/pentaho-marketplace-images/03.png',
			'img/pentaho-marketplace-images/04.png'
		);
	} else {
		$.preloadImages(
			'img/checked.svg',
			'img/close-details.svg',
			'img/contact-button-icon.svg',
			'img/develop-plugins-icon.svg',
			'img/dev-stage-01.svg',
			'img/dev-stage-01-inactive.svg',
			'img/dev-stage-01-large.svg',
			'img/dev-stage-02.svg',
			'img/dev-stage-02-inactive.svg',
			'img/dev-stage-02-large.svg',
			'img/dev-stage-03.svg',
			'img/dev-stage-03-inactive.svg',
			'img/dev-stage-03-large.svg',
			'img/dev-stage-04.svg',
			'img/dev-stage-04-inactive.svg',
			'img/dev-stage-04-large.svg',
			'img/dev-stage-community-01.svg',
			'img/dev-stage-community-01-large.svg',
			'img/dev-stage-community-02.svg',
			'img/dev-stage-community-02-large.svg',
			'img/dev-stage-community-03.svg',
			'img/dev-stage-community-03-large.svg',
			'img/dev-stage-community-04.svg',
			'img/dev-stage-community-04-large.svg',
			'img/download-button-icon.svg',
			'img/download-marketplace-icon.svg',
			'img/filter.svg',
			'img/filter-hover.svg',
			'img/info-icon.svg',
			'img/live-demo-button-icon.svg',
			'img/marketplace-logo.svg',
			'img/more-less-options.svg',
			'img/search.svg',
			'img/search-hover.svg',
			'img/share-blogger-icon.svg',
			'img/share-email-icon.svg',
			'img/share-fb-icon.svg',
			'img/share-linkedin-icon.svg',
			'img/share-twitter-icon.svg',
			'img/some-checked.svg',
			'img/submit-plugins-icon.svg',
			'img/translate-pentaho-icon.svg',
			'img/pentaho-marketplace-images/01.png',
			'img/pentaho-marketplace-images/02.png',
			'img/pentaho-marketplace-images/03.png',
			'img/pentaho-marketplace-images/04.png'
		);
	}

});

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

	var globalFilters = $this.closest('.plugins-filters').find('button.single-filter-button[data-checked=true]').length;
	if(globalFilters == 0) {
		$('.clear-all-filters').addClass('disabled');
	} else {
		$('.clear-all-filters').removeClass('disabled');
	}
});

$('.clear-all-filters').click(function() {
	$('.plugins-filters .single-filter-button').attr('data-checked', 'false');
	$('.plugins-filters .filters-state').removeClass('some-checked');
	$('.plugins-filters .filters-state').removeClass('all-checked');
	$('.clear-all-filters').addClass('disabled');
});

$('#inputSearch').focus(function() {
	$('.page-plugins').removeClass('filtering');
	$('#filter-button').removeClass('active');
});

$('.filters-subsection .filters-title').click(function() {
	$(this).toggleClass('open');
	$(this).closest('.filters-subsection').find('.filters-subsection-items').stop().slideToggle();
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

	var globalFilters = $this.closest('.plugins-filters').find('button.single-filter-button[data-checked=true]').length;
	if(globalFilters == 0) {
		$('.clear-all-filters').addClass('disabled');
	} else {
		$('.clear-all-filters').removeClass('disabled');
	}
});

$('.info-button').click(function() {
	$(this).closest('.btn-group').find('button:not(.info-button) span').stop().animate({width: 'toggle', paddingLeft: 'toggle', paddingRight: 'toggle'});
	$(this).closest('.btn-group').toggleClass('toggled');
});