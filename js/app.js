
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