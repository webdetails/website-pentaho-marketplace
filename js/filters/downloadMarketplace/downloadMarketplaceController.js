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
  app.controller('downloadMarketplaceController',
      ['$scope',
        function ( $scope ) {

          $scope.marketplaceDownloadLinks = [
            {
              id: '5.4',
              downloadUrl: 'http://ctools.pentaho.com/files/marketplace/marketplace-5.4.0.1-130.zip'
            }
          ];

          $scope.selectedMarketplaceVersion = $scope.marketplaceDownloadLinks[0].id;
          $scope.selectedMarketplaceUrl = $scope.marketplaceDownloadLinks[0].downloadUrl;

          $scope.selectMarketplaceVersion = function ( version ) {
            $scope.selectedMarketplaceVersion = version.id;
            $scope.selectedMarketplaceUrl = version.downloadUrl;
          }

        }
      ]);
  // TODO: assuming _ is defined
  })( angular.module('marketplace'), _ );
