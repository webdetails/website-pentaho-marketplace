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
              id: '5.3',
              downloadUrl: 'http://nexus.pentaho.org/content/repositories/pentaho-public-release-repos/pentaho/marketplace/5.3.0.0-213/marketplace-5.3.0.0-213.zip'
            },
            {
              id: '5.2',
              downloadUrl: 'http://nexus.pentaho.org/content/repositories/pentaho-public-release-repos/pentaho/marketplace/5.2.0.0-209/marketplace-5.2.0.0-209.zip'
            },
            {
              id: '5.1 / 5.0',
              downloadUrl: 'http://nexus.pentaho.org/content/repositories/pentaho-public-release-repos/pentaho/marketplace/5.1.0.0-752/marketplace-5.1.0.0-752.zip'
            },
            {
              id: '4.8',
              downloadUrl: 'http://ci.pentaho.com/job/marketplace-4.8/lastSuccessfulBuild/artifact/dist/marketplace-plugin-TRUNK-SNAPSHOT.zip'
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
