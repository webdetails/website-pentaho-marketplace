//create angular module
var app = angular.module('marketplace', ['ui.bootstrap']);


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
	}
});

//create angular controller to our app
app.controller('MarketplaceController', function( $scope, PluginsMetadata, $modal, $document ){
	$scope.pluginsList = [];
	$scope.searchTerm = "";

	PluginsMetadata.getMetadata().then(function(data){
		$scope.pluginsList = data;
	});

    $scope.open = function(plugin) {
        //console.log(plugin);
        var modalInstance = $modal.open({
            templateUrl: 'pluginDetails.html',
            controller: 'ModalInstanceCtrl',
            windowClass: 'plugin-window',
            resolve: {
                myPlugin: function() {
                    return plugin;
                }
            }
        });
    };
});

var ModalInstanceCtrl = function($scope, $modalInstance, myPlugin) {

    $scope.plugin = myPlugin;
    $scope.cancel = function ($document) {
        $('.plugin-modal-gallery .owl-carousel').data('owlCarousel').destroy();
        $modalInstance.dismiss();
    };
};

//angular module to cut strings considering chosen character number, wordwise and tail
angular.module('ng').filter('cut', function () {
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
                autoplayHoverPause: true,
                smartSpeed: 1200
            });
        }
 
        //aplica as ações para o carrosel
        var loadCarouselActions = function(){
        }
 
        //toda vez que adicionar ou remover um item da lista ele carrega o carrosel novamente
        scope.$watch("itens", function(value) {
            loadCarousel(element);
        })
 
        //inicia o carrosel
        loadCarouselActions();
    }
 
    return{
        restrict : "A",
        link: linker
    }
 
});