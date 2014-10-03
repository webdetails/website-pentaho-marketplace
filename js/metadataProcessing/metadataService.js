/*
 * Copyright 2002 - 2014 Webdetails, a Pentaho company.  All rights reserved.
 *
 * This software was developed by Webdetails and is provided under the terms
 * of the Mozilla Public License, Version 2.0, or any later version. You may not use
 * this file except in compliance with the license. If you need a copy of the license,
 * please go to  http://mozilla.org/MPL/2.0/. The Initial Developer is Webdetails.
 *
 * Software distributed under the Mozilla Public License is distributed on an "AS IS"
 * basis, WITHOUT WARRANTY OF ANY KIND, either express or  implied. Please refer to
 * the license for the specific language governing your rights and limitations.
 */

'use strict';

(function ( app, _ ) {

  app.factory('metadataService',
      [ '$http', 'dtoMapperService',
        function( $http, dtoMapper ) {

          var metadataUrl = 'marketplace.xml';
          var pluginsPromise = null;

          // TODO: change to service
          function xmlToJson ( xml ) {
            // TODO: jquery assumption
            return $.xml2json( xml );
          }

          function getPlugins () {
            if ( pluginsPromise == null ) {
              pluginsPromise = $http.get( metadataUrl ).then(
                  function ( response ) {
                    var json = xmlToJson( response.data );
                    return _.map( json.market_entry, dtoMapper.toPlugin );
                  },
                  function ( response ) {
                    console.log( "Failed getting marketplace metadata file." );
                  }
              );
            }

            return pluginsPromise;
          }

          return {
            getPlugins: getPlugins
          }
      }])
})( angular.module('marketplace'), _ );
