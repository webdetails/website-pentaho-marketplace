//create angular module
var app = angular.module('marketplace', ['ui.bootstrap', 'ngDialog', 'ngSanitize', 'angular-loading-bar', 'ngAnimate', 'ngWhen', 'pascalprecht.translate']);


app.value('MarketplaceConfig', {
  xmlUrl: 'marketplace.xml'
});


//create angular controller to our app
app.controller('MarketplaceController',
    [ '$filter', '$scope', 'ngDialog', '$rootScope', '$timeout', 'metadataService', 'developmentStageService',
      function ($filter, $scope, ngDialog, $rootScope, $timeout, metadataService, devStagesService ) {


        function applyPluginFilter() {
          filterAndSetPlugins( $scope.pluginsList );
        };

        function filterAndSetPlugins ( plugins ) {
          $scope.filteredList = $filter('filter')( plugins, pluginFilter );
        };

        function filterStage ( plugin ) {
          if ( $scope.selectedStages.length == 0 ) {
            return true;
          }

          // plugin is in one of the selected development stages
          return _.any( $scope.selectedStages,
              function ( selectedStage ) {
                return _.any( plugin.versions, function ( version )  {
                  return version.devStage &&
                      selectedStage.lane.id == version.devStage.lane.id &&
                      selectedStage.phase == version.devStage.phase;
                } );
              }
          );
        };

        function filterCategory ( plugin ) {
          if ( $scope.selectedCategories.length == 0 ) {
            return true;
          }

          // plugin does not have a category
          if ( !plugin.category ) {
            return false;
          }

          // plugin is in one of the selected development stages
          return _.any( $scope.selectedCategories,
              function ( selectedType ) {
                return selectedType.main == plugin.category.main &&
                    selectedType.sub == plugin.category.sub;
              }
          );
        }

        function contains ( string, subString ) {
          return string ? string.toLowerCase().indexOf(subString.toLowerCase()) > -1 : false;
        };

        function filterText ( plugin, text ) {
          if ( !text ) {
            return true;
          }

          return contains ( plugin.name, text ) ||
              contains( plugin.description, text ) ||
              contains( plugin.author.name, text ) ||
              contains( plugin.dependencies, text ) ||
              contains( plugin.license.name, text ) ||
              _.any( plugin.versions, function ( version ) {
                return contains( version.branch, text ) ||
                    contains( version.version, text ) ||
                    contains( version.buildId, text ) ||
                    contains( version.name , text ) ||
                    contains( version.description, text );
              });
        };

        /**
         * Checks if a plugin passes all the conditions set in the view
         * @param {Plugin} plugin
         * @returns {Boolean} True if the plugin passes the filter
         */
        function pluginFilter ( plugin ) {
          return filterCategory( plugin )
                 && filterText( plugin, $scope.searchTerm )
                 && filterStage ( plugin );

        };

        $scope.$watchCollection( "selectedCategories", applyPluginFilter );
        $scope.$watchCollection( "selectedStages", applyPluginFilter );
        $scope.$watch( "searchTerm", applyPluginFilter );


        function getCategories ( plugins ) {
          var categories = _.chain( plugins )
              .filter( function ( plugin ) { return plugin.category !== undefined && plugin.category !== null; } )
              .map( function( plugin ) { return plugin.category; } )
              .uniq( function ( category ) { return category.getId(); } )
              .sortBy( function ( category ) { return category.mainName + category.subName; })
              .value();

          return categories;
        }

        var inputFilter = $filter('filter');

        $scope.pluginsList = [];
        $scope.filteredList = [];

        $scope.searchTerm = "";

        metadataService.getPlugins()
            .then( function ( plugins ) {
              $scope.categories = getCategories( plugins );
              $scope.selectedCategories = [];

              $scope.developmentStages = _.map( devStagesService.getStages(), function ( stage ) {
                var filterStageOption = { lane: stage.lane.id, name: stage.phase, stage: stage };
                // NOTE: These watches are necessary because of translation issues in FireFox
                //$scope.$watch( function () { return stage.name; }, function () { filterStageOption.name = stage.name; } );
                //$scope.$watch( function () { return stage.lane.name; }, function () { filterStageOption.lane = stage.lane.name; } );
                return filterStageOption;
              });
              $scope.selectedStages = [];

              $scope.pluginsList = $scope.filteredList = plugins;
              $scope.totalItems = $scope.pluginsList.length;

              $scope.highlightedPlugins = [
                plugins[5], // sparkl
                plugins[1], // CDF
                plugins[2], // CDA
                plugins[3], // CDE
                plugins[4] // CGG
              ];

            }
        );


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
app.directive('owlcarousel',
    [ 'OwlCarouselConfig', '$timeout',
      function (OwlCarouselConfig, $timeout) {

        function linker(scope, element, attr) {

          //carrega o carrosel
          var loadCarousel = function () {
            element.owlCarousel( getOptions() );
          };

          var getOptions = function () {
            return angular.extend({}, OwlCarouselConfig, scope.$eval(attr.carouselOptions));
          };

          // timeout is necessary in order for the carousel to load after ng-repeat directives
          $timeout( loadCarousel, 0);
          //$watch( 'highlightedPlugins', function () { loadCarousel(); } );
          //loadCarousel();
        };

        return{
          restrict: "A",
          link: linker
        };
      }
    ]
);

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