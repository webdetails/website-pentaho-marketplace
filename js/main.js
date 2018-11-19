$.preloadImages = function() {
  for (var i = 0; i < arguments.length; i++) {
    $("<img />").attr("src", arguments[i]);
    //console.log($("<img />").attr("src", arguments[i]));
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
			'img/translate-pentaho-icon.png'
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
			//'img/download-button-icon.svg',
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
			'img/translate-pentaho-icon.svg'
		);
	}

	var hds = window.hds || {};
	(function (window, document, $, hds) {
		hds.buildShowNav = {
			init: function (options) {
				hds.buildShowNav.desktopMobileFunction();
			},
			desktopMobileFunction: function () {
				$('.globalNavWrapper > li').hover(function () {
					$('.globalNavWrapper li').removeClass('open');
					$('.hds-megaMenuWrapper', this).stop(true, true).delay(200).slideDown(100);
					var megaMenuWrapper = $(this).find(".hds-megaMenuWrapper");
					var bgImgUrl = $(megaMenuWrapper).attr('data-bg-url');
					$(megaMenuWrapper).css("background-image", "url(" + bgImgUrl + ")");
					$(this).addClass('open');
				}, function () {
					$(this).removeClass('open');
					$('.hds-megaMenuWrapper', this).stop(true, true).slideUp(200);
				});
			}
		}
	}(window, document, jQuery, hds));

	$(function () {
		if ($('.globalNavWrapper li:has(div.hds-megaMenuWrapper)')) {
			hds.buildShowNav.init();
		}
	})

	$(window).resize(function () {
		if (this.window.innerWidth <= 991) {
			$('.header-container').removeClass('container');
		} else {
			$('.header-container').addClass('container');
		}
	});

	$('.navbar-toggle.nav-button, #closeHDSMenu').click(function () {
		$('.hds-MobileMenu').toggleClass('hds-megaMenu-open');
	});

	if ($(window).width() > 991) {
		$('.header-container').addClass('container');
	} else $('.header-container').removeClass('container');
	
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

$('#inputSearch').focus(function() {
	$('.page-plugins').removeClass('filtering');
	$('#filter-button').removeClass('active');
});

$('.info-button').click(function() {
	$(this).closest('.btn-group').find('button:not(.info-button) span').stop().animate({width: 'toggle', paddingLeft: 'toggle', paddingRight: 'toggle'});
	$(this).closest('.btn-group').toggleClass('toggled');
});