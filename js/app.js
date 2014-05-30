
var app = angular.module('marketplace', ['ngRoute']);

app.value('MarketplaceConfig',{
	xmlUrl: 'marketplace.xml'
});

app.factory('PluginsMetadata', function($http, MarketplaceConfig){
	return {
		getMetadata: function(){
			return $http.get( MarketplaceConfig.xmlUrl ).then( function(result){
				return $.xml2json(result.data).market_entry;
			});
		}
	}
});

app.controller('MarketplaceController', function( $scope, PluginsMetadata ){
	$scope.pluginsList = [];
	$scope.searchTerm = "";

	PluginsMetadata.getMetadata().then(function(data){
		$scope.pluginsList = data;
	}); 
});

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