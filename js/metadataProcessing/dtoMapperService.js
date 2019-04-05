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

  app.factory( 'dtoMapperService',
      [ 'Plugin', 'developmentStageService', 'categoryService',
        function( Plugin, devStages, categoryService ) {

          function toPlugin( pluginDTO ) {
            // region TODO: TEMPORARY array transformation due to bug in server side serialization of single element collections
            pluginDTO.screenshots = pluginDTO.screenshots !== undefined ? toArray( pluginDTO.screenshots.screenshot ) : [];
            pluginDTO.versions = pluginDTO.versions !== undefined ? toArray( pluginDTO.versions.version ) : [];
            // endregion

            var plugin = new Plugin();

            plugin.type = pluginDTO.type;
            plugin.id = pluginDTO.id;
            plugin.name = pluginDTO.name;
            plugin.image = pluginDTO.img;
            plugin.smallImage = pluginDTO.small_img;
            // TODO check this property with XSD
            plugin.documentationUrl = pluginDTO.documentation_url;

            // TODO description i18n
            plugin.description = pluginDTO.description;

            plugin.author = {};
            plugin.author.name = pluginDTO.author;
            plugin.author.siteUrl = pluginDTO.author_url;
            plugin.author.logoUrl = pluginDTO.author_logo;

            plugin.versions = _.map( pluginDTO.versions, toVersion );

            plugin.screenshotUrls = pluginDTO.screenshots;

            // TODO improve dependencies
            plugin.dependencies = pluginDTO.dependencies;

            // TODO check license on server DTO
            plugin.license = {};
            plugin.license.name = pluginDTO.license_name;

            // pluginDTO.license takes precedence over pluginDTO.license_name
            if( pluginDTO.license !== undefined ) {
              plugin.license.name = pluginDTO.license;
            }

            plugin.license.text = pluginDTO.license_text;

            plugin.category = toCategory( pluginDTO.category );


            plugin.forumUrl = pluginDTO.forum_url;

            return plugin;
          };

          function getInstalledVersion ( installableVersions, pluginDTO ) {
            var installedVersion = _.find( installableVersions, function ( version ) {
              return version.branch == pluginDTO.installedBranch &&
                  version.version == pluginDTO.installedVersion;
            } );

            // if there is an installable version with same branch and version
            // use it as the installed version maintaining the build id from the DTO
            if ( installedVersion ) {
              var cloneInstalledVersion = installedVersion.clone();
              cloneInstalledVersion.buildId = pluginDTO.installedBuildId;

              return cloneInstalledVersion;
            }
            // otherwise create new version
            else {
              installedVersion = new Plugin.Version();
              installedVersion.branch = pluginDTO.installedBranch;
              installedVersion.version = pluginDTO.installedVersion;
              installedVersion.buildId = pluginDTO.installedBuildId;

              // NOTE: Huge assumption here: if the installed version is not in
              // the installable versions list, assume that the devStage of the installed version
              // is the same as the installable version with the same branch
              var sameBranchVersion = _.find( installableVersions, function (version) {
                return version.branch == pluginDTO.installedBranch;
              });
              if ( sameBranchVersion ) {
                installedVersion.devStage = sameBranchVersion.devStage;
              }

              return installedVersion;
            }
          }

          function toCategory ( categoryDTO ) {
            if ( categoryDTO === null || categoryDTO === undefined ) {
              return undefined;
            }

            if ( categoryDTO.parent === undefined ) {
              return categoryService.getCategory( categoryDTO.name );
            }

            return categoryService.getCategory( categoryDTO.parent.name, categoryDTO.name );
          }

          function toVersion ( versionDTO ) {
            var version = new Plugin.Version();

            version.branch = versionDTO.branch;
            version.version = versionDTO.version;
            version.buildId = versionDTO.build_id;
            version.name = versionDTO.name;
            version.downloadUrl = versionDTO.package_url;
            version.samplesDownloadUrl = versionDTO.samples_url;
            // TODO description i8ln;
            version.description = versionDTO.description;
            // TODO changeLog internationalization?
            version.changeLog = versionDTO.changelog;
            // TODO: Does not exist in xsd at the moment. Use Date type?
            //version.releaseDate = versionDTO.releaseDate;

            version.compatiblePentahoVersion = {};
            version.compatiblePentahoVersion.minimum = versionDTO.min_parent_version;
            version.compatiblePentahoVersion.maximum = versionDTO.max_parent_version;

            var lane = versionDTO.development_stage !== undefined ? versionDTO.development_stage.lane : undefined;
            var phase = versionDTO.development_stage !== undefined ? versionDTO.development_stage.phase : undefined;

            version.devStage = devStages.getStage( lane, phase );

            return version;
          };

          /**
           * This function only exists because of a "bug" on json serialization server side.
           * Single element arrays are serialized as an object instead of a single element array.
           * @param potentialArray :
           * @returns {Array} the potential array as a proper Array.
           */
          function toArray ( potentialArray ) {
            // already an array, return it
            if( potentialArray instanceof Array ) {
              return potentialArray;
            }

            // null or undefined, return empty array
            if ( potentialArray === null || potentialArray === undefined ) {
              return [];
            }

            // single element, put it in an array
            return [ potentialArray ];
          }

          return {
            toPlugin: toPlugin,

            toVersion: toVersion
          }
        }
      ]);
}
)( angular.module('marketplace'), _ );

