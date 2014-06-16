//create angular module
var app = angular.module('marketplace', ['ui.bootstrap', 'ngDialog', 'ngSanitize']);


app.value('MarketplaceConfig',{
	xmlUrl: 'marketplace.xml'
});

//creating PluginsMetadata service, as an injectable argument, getting the metadata from the provided XML
app.factory('PluginsMetadata', function($http, MarketplaceConfig){
	return {
		getMetadata: function(){
			return $http.get( MarketplaceConfig.xmlUrl ).then( function(result){
				return $.xml2json(result.data).market_entry;
			});
		}
	};
});

//create angular controller to our app
app.controller('MarketplaceController', function( $scope, PluginsMetadata, ngDialog, $rootScope ){
	$scope.pluginsList = [];
	$scope.searchTerm = "";

	PluginsMetadata.getMetadata().then(function(data){
		$scope.pluginsList = data;
        $scope.totalItems = $scope.pluginsList.length;
	});

    $scope.itemsPerPage = 12;
    $scope.currentPage = 1;

    $scope.paginate = function(value) {
        var begin, end, index;
        begin = ($scope.currentPage - 1) * $scope.itemsPerPage;
        end = begin + $scope.itemsPerPage;
        index = $scope.pluginsList.indexOf(value);
        return (begin <= index && index < end);
    };

    $scope.pageChanged = function() {
        console.log('Page changed to: ' + $scope.currentPage);
    };


    $scope.open = function(plugin) {
        $scope.plugin = plugin;

        ngDialog.open({
            template: 'pluginDetails.html',
            scope: $scope,
            className: 'plugin-window',
            showClose: false
        });
    };

    $rootScope.$on('ngDialog.opened', function (e, $dialog) {
        console.log('ngDialog opened: ' + $dialog.attr('id'));
    });

    $rootScope.$on('ngDialog.closed', function (e, $dialog, $document) {
        $('.plugin-modal-gallery .owl-carousel').data('owlCarousel').hide().destroy();
        console.log('ngDialog closed: ' + $dialog.attr('id'));
    });
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
app.directive('owlcarousel',function(){
    var linker = function(scope,element,attr){
        //carrega o carrosel
        var loadCarousel = function(){
            element.owlCarousel({
                //loop:true,
                loop:false,
                items: 1,
                smartSpeed: 800
            });
        };
 
        //aplica as ações para o carrosel
        var loadCarouselActions = function(){
        };
 
        //toda vez que adicionar ou remover um item da lista ele carrega o carrosel novamente
        scope.$watch("itens", function(value) {
            loadCarousel(element);
        });
 
        //inicia o carrosel
        loadCarouselActions();
    };
 
    return{
        restrict : "A",
        link: linker
    };
 
});