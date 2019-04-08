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

(function (app, _) {

  app.factory( 'developmentStageService',
      [ '$translate',
        function ( $translate ) {

          var customerLaneId = "Customer";
          var communityLaneId = "Community";

          var lanes = {};


          // TODO remove hardcoded
          var stagesStrings = {
            Customer: {
              1: {
                name: 'Development Phase',
                description: 'Start up phase of an internal project. Usually a Labs experiment.'
              },
              2: {
                name: 'Snapshot Release',
                description: 'Unstable and unsupported branch, not recommended for production use.'
              },
              3: {
                name: 'Limited Release',
                description: 'Assistance given by Services Development with no contractual support for production environments.'
              },
              4: {
                name: 'Production Release',
                description: 'Production release with PM assigned, fully supported as part of the Pentaho release cycle.'
              }
            },
            Community: {
              1: {
                name: 'Development Phase',
                description: 'Start up phase of an internal project. Usually a Labs experiment.'
              },
              2:  {
                name: 'Snapshot Release',
                description: 'Unstable and unsupported branch, not recommended for production use.'
              },
              3: {
                name: 'Stable Release',
                description: 'Adoption is ramping up and product could be used in production environments.'
              },
              4:  {
                name: 'Mature Release',
                description: 'Indicates a successfully adopted project in a mature state.'
              }
            }
          }

          function Lane(id, name) {
            this.id = id;
            this.name = name;

            // associative map [phaseId: stage]
            this.stages = {};
          }

          function createLane(laneId, laneNameId) {
            var lane = new Lane(laneId);

            //lane.name = $translate.instant( laneNameId );

            lane.name = laneId;

            /*
            $translate(laneNameId)
                .then(function (name) {
                  lane.name = name;
                });
            */

            // TODO: check if add here or out of function
            lanes[laneId] = lane;

            return lane;
          }

          function initializeLanes() {
            createLane(customerLaneId, 'marketplace.devStage.lanes.customer.name');
            createLane(communityLaneId, 'marketplace.devStage.lanes.community.name');
          }

          function getLane(laneId) {
            return lanes[laneId];
          }

          /**
           *
           * @param lane
           * @param phaseId
           * @param name
           * @param description
           * @constructor
           */
          function DevelopmentStage(lane, phaseId, name, description) {
            this.lane = lane;
            this.phase = phaseId;

            this.name = name;
            this.description = description;
          }

          //DevelopmentStage.prototype.

          function createDevelopmentStage(laneId, phaseId, nameTranslationId, descriptionTranslationId) {
            var lane = getLane(laneId);
            if (lane === undefined) {
              throw "createDevelopmentStage: unknown laneId " + laneId;
            }

            var stage = new DevelopmentStage(lane, phaseId, stagesStrings[laneId][phaseId].name, stagesStrings[laneId][phaseId].description);

//          stage.name =  $translate.instant( nameTranslationId );
//          stage.description = $translate.instant( descriptionTranslationId );

            /*
            $translate(nameTranslationId)
                .then(function (name) {
                  stage.name = name;
                });
            $translate(descriptionTranslationId)
                .then(function (description) {
                  stage.description = description;
                });
            */

            // TODO: check if add here or out of function
            lane.stages[phaseId] = stage;

            return stage;
          }

          // TODO: check if these should be obtained from metadata
          function intializeDevelopmentStages() {

            function createStages(numberOfStages, laneId, translationIdPrefix) {
              for (var phaseId = 1; phaseId <= numberOfStages; phaseId++) {
                createDevelopmentStage(laneId, phaseId,
                        translationIdPrefix + phaseId + ".name",
                        translationIdPrefix + phaseId + ".description")
              }
            }

            initializeLanes();

            var translationKeyPrefix = "marketplace.devStage.stages";
            var customerLanePrefix = translationKeyPrefix + ".customer.phase";
            var communityLanePrefix = translationKeyPrefix + ".community.phase";

            createStages(4, customerLaneId, customerLanePrefix);
            createStages(4, communityLaneId, communityLanePrefix);
          }

          /**
           * Gets the stage for the corresponding lane and phase
           * @param laneId
           * @param phaseId
           * @returns {*} Returns undefined if no Stage was found for the specified lane and phase
           */
          function getStage(laneId, phaseId) {
            if (!laneId || !phaseId) {
              return undefined;
            }

            var lane = getLane(laneId);
            if (lane === undefined) {
              return undefined;
            }

            return lane.stages[phaseId];
          }

          function getStages() {
            return _.chain(lanes)
                .map(function (lane) {
                  return lane.stages;
                })
                .map(function (stages) {
                  return _.values(stages);
                })
                .flatten()
              // IE8 requires that undefined and null values are explicitly removed
                .filter(function (stage) {
                  return !(stage === undefined || stage === null);
                })
                .value();
          }

          function getLanes() {
            return _.map(lanes, function (lane) {
              return lane;
            });
          }

          intializeDevelopmentStages();
          return {
            getStage: getStage,

            getStages: getStages,

            getLanes: getLanes

          }
        }
      ]);

})(angular.module('marketplace'), _ );


