//create angular module
var app = angular.module('marketplace', ['ui.bootstrap', 'ngDialog', 'ngSanitize', 'angular-loading-bar', 'ngAnimate', 'ngWhen', 'pascalprecht.translate']);


app.value('MarketplaceConfig', {
  xmlUrl: 'marketplace.xml'
});

//creating PluginsMetadata service, as an injectable argument, getting the metadata from the provided XML
app.factory('PluginsMetadata', function ($http, MarketplaceConfig) {
  return {
    getMetadata: function () {
      return $http.get(MarketplaceConfig.xmlUrl).then(function (result) {
        return $.xml2json(result.data).market_entry;
      });
    }
  };
});

//create angular controller to our app
app.controller('MarketplaceController',
    [ '$filter', '$scope', 'PluginsMetadata', 'ngDialog', '$rootScope', '$timeout', 'metadataService',
      function ($filter, $scope, PluginsMetadata, ngDialog, $rootScope, $timeout, metadataService ) {

        var test;
        metadataService.getPlugins()
            .then( function ( plugins ) {
              test = plugins;
            }
        );

        var inputFilter = $filter('filter');

        $scope.pluginsList = [];
        $scope.filteredList = [];

        $scope.searchTerm = "";

        $scope.$watch('searchTerm', function (oldVal, newVal) {
          $timeout(function () {
            $scope.filteredList = inputFilter($scope.pluginsList, newVal);
            $scope.totalItems = $scope.filteredList.length;
          }, 0);
        });

        PluginsMetadata.getMetadata()
            .then(function (data) {
              $scope.pluginsList = $scope.filteredList = data;
              $scope.totalItems = $scope.pluginsList.length;
            });

        // TODO: get these constants from somewhere else
        $scope.itemsPerPage = 12;
        $scope.currentPage = 1;

        $scope.pageChanged = function () {
          console.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.open = function (plugin) {
          $scope.plugin = plugin;
          ngDialog.open({
            template: 'templates/pluginDetails.html',
            scope: $scope,
            className: 'plugin-window',
            showClose: false
          });
        };

        $scope.openDevStages = function () {
          ngDialog.open({
            template: 'templates/devStages.html',
            scope: $scope,
            className: 'plugin-window-dev-stages',
            showClose: false
          });
        };

        $scope.openContribute = function () {
          ngDialog.open({
            template: 'templates/contribute.html',
            scope: $scope,
            className: 'plugin-window',
            showClose: false
          });
        };

        $scope.openFindMarketplace = function () {
          ngDialog.open({
            template: 'templates/findMarketplace.html',
            scope: $scope,
            className: 'plugin-window',
            showClose: false
          });
        };

        $rootScope.$on('ngDialog.opened', function (e, $dialog) {
          setTimeout(function () {
            var dialogContentHeight = $dialog.find('.ngdialog-content').height();
            var dialogContentTotalHeight = dialogContentHeight + 100;
            $dialog.find('.ngdialog-overlay').css('min-height', dialogContentTotalHeight);
            console.log('ngDialog opened: ' + $dialog.attr('id') + '; ngDialog height: ' + dialogContentHeight + '; ngDialog height with margins: ' + dialogContentTotalHeight);
          }, 10);
        });

        $scope.devStagesTypes = [
          {
            name: 'Customer Lane',
            description: 'Always overseen by PM and Engineering, projects in the Customer Lane can either start as customer-sponsored initiatives or as projects developed in the Community Lane that create value for Pentaho subscription customers. Pentaho will provide official support based on current support policies to projects on the Customer Lane.'
          },
          {
            name: 'Community Lane',
            description: 'The Community Lane will be used for projects created by Pentaho Consulting or Engineering Services, in which case they will be managed so they do not conflict with the long-term architecture and functionality planned in the Pentaho product roadmap.'
          }
        ]

        $scope.devStages = [
          {
            name: 'Development Phase',
            id: 'customer1',
            description: 'Start up phase of an internal project. Usually a Labs experiment.',
            image: 'img/dev-stage-01.svg',
            imagePNG: 'img/dev-stage-01.png',
            imageLarge: 'img/dev-stage-01-large.svg',
            imageLargePNG: 'img/dev-stage-01-large.png',
            type: 'Customer Lane'
          },
          {
            name: 'Snapshot Release',
            id: 'customer2',
            description: 'Unstable and unsupported branch, not recommended for production use.',
            image: 'img/dev-stage-02.svg',
            imagePNG: 'img/dev-stage-02.png',
            imageLarge: 'img/dev-stage-02-large.svg',
            imageLargePNG: 'img/dev-stage-02-large.png',
            type: 'Customer Lane'
          },
          {
            name: 'Limited Release',
            id: 'customer3',
            description: 'Assistence given by Services Development with no contractual support for production environments.',
            image: 'img/dev-stage-03.svg',
            imagePNG: 'img/dev-stage-03.png',
            imageLarge: 'img/dev-stage-03-large.svg',
            imageLargePNG: 'img/dev-stage-03-large.png',
            type: 'Customer Lane'
          },
          {
            name: 'Production Release',
            id: 'customer4',
            description: 'Production release with PM assigned, fully supported as part of the Pentaho release cycle.',
            image: 'img/dev-stage-04.svg',
            imagePNG: 'img/dev-stage-04.png',
            imageLarge: 'img/dev-stage-04-large.svg',
            imageLargePNG: 'img/dev-stage-04-large.png',
            type: 'Customer Lane'
          },
          {
            name: 'Development Phase',
            id: 'community1',
            description: 'Start up phase of an internal project. Usually a Labs experiment.',
            image: 'img/dev-stage-community-01.svg',
            imagePNG: 'img/dev-stage-community-01.png',
            imageLarge: 'img/dev-stage-community-01-large.svg',
            imageLargePNG: 'img/dev-stage-community-01-large.png',
            type: 'Community Lane'
          },
          {
            name: 'Snapshot Release',
            id: 'community2',
            description: 'Unstable and unsupported branch, not recommended for production use.',
            image: 'img/dev-stage-community-02.svg',
            imagePNG: 'img/dev-stage-community-02.png',
            imageLarge: 'img/dev-stage-community-02-large.svg',
            imageLargePNG: 'img/dev-stage-community-02-large.png',
            type: 'Community Lane'
          },
          {
            name: 'Stable Release',
            id: 'community3',
            description: 'Adoption is ramping up and product could be used in production environments.',
            image: 'img/dev-stage-community-03.svg',
            imagePNG: 'img/dev-stage-community-03.png',
            imageLarge: 'img/dev-stage-community-03-large.svg',
            imageLargePNG: 'img/dev-stage-community-03-large.png',
            type: 'Community Lane'
          },
          {
            name: 'Mature Release',
            id: 'community4',
            description: 'Indicates a successfully adopted project in a mature state.',
            image: 'img/dev-stage-community-04.svg',
            imagePNG: 'img/dev-stage-community-04.png',
            imageLarge: 'img/dev-stage-community-04-large.svg',
            imageLargePNG: 'img/dev-stage-community-04-large.png',
            type: 'Community Lane'
          }
        ]

        /*$rootScope.$on('ngDialog.closed', function (e, $dialog, $document) {
         if($('.plugin-modal-gallery .owl-carousel').length) {
         $('.plugin-modal-gallery .owl-carousel').hide().data('owlCarousel').destroy();
         }
         console.log('ngDialog closed: ' + $dialog.attr('id'));
         });*/
      } ]);


app.filter('startFrom', function () {
  return function (input, start) {
    start = +start; //parse to int
    return input.slice(start);
  };
});
app.filter('paginate', function ($filter) {
  var startFrom = $filter('startFrom'),
      limitTo = $filter('limitTo');

  return function (items, currentPage, itemsPerPage) {
    var start = (currentPage - 1) * itemsPerPage;
    return limitTo(startFrom(items, start), itemsPerPage);
  };
});
//angular module to cut strings considering chosen character number, wordwise and tail
app.filter('cut', function () {
  return function (value, wordwise, max, tail) {
    if (!value) return '';

    max = parseInt(max, 10);
    if (!max) return value;
    if (value.length <= max) return value;

    value = value.substr(0, max);
    if (wordwise) {
      var lastspace = value.lastIndexOf(' ');
      if (lastspace != -1) {
        value = value.substr(0, lastspace);
      }
    }

    return value + (tail || ' …');
  };
});

//owlcarousel directive
app.value('OwlCarouselConfig', {
  loop: false,
  items: 1,
  smartSpeed: 800
});
app.directive('owlcarousel', function (OwlCarouselConfig) {

  function linker(scope, element, attr) {

    //carrega o carrosel
    var loadCarousel = function () {
      element.owlCarousel(getOptions());
    };

    var getOptions = function () {
      return angular.extend({}, OwlCarouselConfig, scope.$eval(attr.carouselOptions));
    }

    //toda vez que adicionar ou remover um item da lista ele carrega o carrosel novamente
    scope.$watch("batatas", function (value) {
      loadCarousel();
    });

    //loadCarousel();

  };

  return{
    restrict: "A",
    link: linker
  };

});

app.directive('onFinishRender', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
      if (scope.$last === true) {
        scope.$evalAsync(attr.onFinishRender);
        $('.loading-overlay').delay(1000).fadeOut(300);
      }
    }
  }
});

app.directive('ngxTipsy', function () {
  // jquery tooltipster
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      // possible directions:
      // right | left | top | top-right | top-left | bottom | bottom-right | bottom-left
      element.tooltipster({
        content: attrs.ngxTitle,
        contentAsHTML: true,
        theme: 'tooltipster-light',
        animation: 'grow',
        maxWidth: 300,
        position: attrs.ngxPosition
      });
    }
  }
});