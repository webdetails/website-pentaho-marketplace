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

(function( app, _ ) {

  app.factory('Plugin',
      [
        function () {

          function Plugin() {}

          Plugin.prototype.getStages = function () {
            return _.chain( this.versions )
                .map( function ( version ) { return version.devStage; })
                .filter( function ( stage ) { return stage !== undefined && stage !== null; })
                .unique()
                .value();
          };

          var stagesOrder = {
            Community: { 1: 1, 2: 2, 3: 3, 4: 4 },
            Customer: { 1: 5, 2: 6, 3: 7, 4: 8 }
          };

          function getStageOrder ( stage ) {
            if ( stage === undefined || stage === null ) {
              return 0;
            }

            return stagesOrder[stage.lane.id][stage.phase];
          }


          Plugin.prototype.getFilteredHighestStage = function ( pentahoVersion, stages ) {
            var sortedFilteredStages = _.chain( this.versions )
                .filter( function ( version ) {
                  return version.compatibleWithPentahoVersion( pentahoVersion ) &&
                      ( stages.length == 0 || _.contains( stages, version.devStage ))})
                .map( function ( version ) { return version.devStage; } )
                .sortBy( getStageOrder )
                .value();

            return sortedFilteredStages[ sortedFilteredStages.length -1 ];
          };

          Plugin.prototype.getFilteredVersionWithHighestStage = function ( pentahoVersion, stages ) {
            var sortedFilteredVersions = _.chain( this.versions )
                .filter( function ( version ) {
                  return version.compatibleWithPentahoVersion( pentahoVersion ) &&
                      ( stages.length == 0 || _.contains( stages, version.devStage ))})
                .sortBy( function ( version ) { return getStageOrder ( version.devStage ); } )
                .value();

            return sortedFilteredVersions[ sortedFilteredVersions.length -1 ];
          };

          Plugin.prototype.getVersionWithHighestStage = function () {
            if ( this.versionWithHighestStage === undefined ) {
              var highestStage = this.getHighestStage();
              this.versionWithHighestStage = _.find( this.versions, function ( version ) { return version.devStage === highestStage; });
            }

            return this.versionWithHighestStage;
          };

          Plugin.prototype.getHighestStage = function () {
            if ( this.highestStage === undefined ) {
              var stages = this.getStages();

              var sortedStages = _.sortBy( stages, getStageOrder );
              this.highestStage = sortedStages[sortedStages.length -1];
            }

            return this.highestStage;
          };

          Plugin.Version = function ( branch, version, buildId ) {
            this.branch = branch;
            this.version = version;
            this.buildId = buildId;
          };

          /**
           * is leftVersion >= rightVersion ?
           * @param leftVersionStr
           * @param rightVersionStr
           */
          function pentahoVersionLargerThanOrEqual( leftVersionStr, rightVersionStr ) {
            if ( !rightVersionStr || !leftVersionStr ) {
              return true;
            }

            var leftSplit = leftVersionStr.split(".");
            var rightSplit = rightVersionStr.split(".");

            var leftVersion = [
              getVersionIntValue( leftSplit[0] ), // major
              getVersionIntValue( leftSplit[1] ), // minor
              getVersionIntValue( leftSplit[2] )  // patch
            ];

            var rightVersion = [
              getVersionIntValue( rightSplit[0] ), // major
              getVersionIntValue( rightSplit[1] ), // minor
              getVersionIntValue( rightSplit[2] )  // patch
            ];

            for ( var i = 0; i < leftVersion.length; i++ ) {
              if ( leftVersion[i] < rightVersion[i] ) {
                return false;
              }
            }

            return true;
          }

          function getVersionIntValue ( strValue ) {
            return parseInt( strValue ) || 0;
          }

          Plugin.Version.prototype.compatibleWithPentahoVersion = function ( pentahoVersion ) {
            return pentahoVersionLargerThanOrEqual( this.compatiblePentahoVersion.maximum, pentahoVersion ) &&
                pentahoVersionLargerThanOrEqual( pentahoVersion, this.compatiblePentahoVersion.minimum );
          }


          return Plugin;
        }

      ]);
}
)( angular.module('marketplace'), _ );
