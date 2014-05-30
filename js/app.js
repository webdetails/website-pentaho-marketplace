(function() {

	var markteplacePluginsXMLUrl = 'marketplace.xml';

	$.get(markteplacePluginsXMLUrl, function(xml ){ 
		var pluginsMetadata = $.xml2json(xml); 
		//console.log(marketplacePlugins);
	
		var app = angular.module('marketplace', ['ngRoute']);

		app.controller('MarketplaceController', function(){
			this.marketplacePlugins = pluginsMetadata; 
		});
	});	
})();