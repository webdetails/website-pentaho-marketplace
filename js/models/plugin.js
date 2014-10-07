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

          Plugin.Version = function ( branch, version, buildId ) {
            this.branch = branch;
            this.version = version;
            this.buildId = buildId;
          };


          return Plugin;
        }

      ]);
}
)( angular.module('marketplace'), _ );
