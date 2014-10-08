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
  app.controller('multiselectDropdownController',
      ['$scope',
        function ( $scope ) {

          function Option( name, selectionValue, group ) {
            this.name = name;
            this.selectionValue = selectionValue;
            this.group = group;

            var that = this;
            this.isSelected = _.any( $scope.selectedOptionsValue, function ( selectedOption ) {
              return _.isEqual( selectedOption, that.selectionValue );
            });

            // when an option is (de)selected, (remove)add it (from)to the selected model
            this.stopWatching = $scope.$watch(
                function() { return that.isSelected; },
                function ( newValue ) {
                  that.onSelectChanged( newValue );
                }
            );
          }

          Option.prototype.onSelectChanged = function ( newSelectedValue ) {
            var that = this;
            // Option was selected
            if ( newSelectedValue &&
                !_.contains( $scope.selectedOptionsValue, that.selectionValue )) {
              $scope.selectedOptionsValue.push( this.selectionValue );
            }

            // Option was deselected
            if ( !newSelectedValue ) {
              var index = _.indexOf( $scope.selectedOptionsValue, this.selectionValue );
              if (index > -1) {
                $scope.selectedOptionsValue.splice(index, 1);
              }
            }

            this.group.updateSelected();
            updateOptionsDisplayString();
          };

          function Group ( name, scope ) {
            var that = this;
            that.name = name;
            that.selected = Group.selectEnum.NONE;
            that.options = [];

            that.watchDeregistrationFunction = scope.$watch(
                function() { return that.selected; },
                function ( selectedNewValue ) {
                  that.onSelectChanged( selectedNewValue );
                }
            );
          }

          Group.selectEnum = {
            ALL: "All",
            SOME: "Some",
            NONE: "None"
          };

          Group.prototype.onSelectChanged = function ( selectEnum ) {
            switch ( selectEnum ) {
              case Group.selectEnum.ALL:
                _.each( this.options, function ( option ) { option.isSelected = true; });
                break;
              case Group.selectEnum.NONE:
                _.each( this.options, function ( option ) { option.isSelected = false; });
            }
            updateOptionsDisplayString();
          };

          Group.prototype.updateSelected = function() {
            var selected = Group.selectEnum.NONE;
            if ( _.all( this.options, function ( option ) { return option.isSelected; } ) ) {
              selected = Group.selectEnum.ALL;
            }
            else if ( _.any( this.options, function ( option ) { return option.isSelected; } ) ) {
              selected = Group.selectEnum.SOME;
            }

            this.selected = selected;
          };

          Group.prototype.getCssClass = function () {
            switch ( this.selected ) {
              case Group.selectEnum.ALL:
                return 'all-selected';
              case Group.selectEnum.SOME:
                return 'some-selected';
              case Group.selectEnum.NONE:
                return 'none-selected';
            }
          };

          Group.prototype.stopWatching = function () {
            // clean up event handlers to allow GC
            this.watchDeregistrationFunction();
            _.each( this.options, function ( option ) { option.stopWatching(); } );
          };

          function getOptionsDisplayString ( groups ) {
            if ( $scope.allOptionsSelected &&
                _.all( groups, function ( group ) { return group.selected === Group.selectEnum.ALL; }) ) {
              return $scope.allOptionsSelected;
            }

            if ( $scope.noOptionSelected &&
                _.all( groups, function ( group ) { return group.selected === Group.selectEnum.NONE }) ) {
              return $scope.noOptionSelected;
            }

            var selectedGroupsString =
                _.chain( groups )
                    .map( function ( group ) { return getGroupDisplayString( group ); } )
                    .filter( function ( string ) { return string !== null && string !== undefined && string !== "" })
                    .value()
                    .join($scope.optionDelimiter);

            return selectedGroupsString;
          }

          function getGroupDisplayString ( group ) {
            if ( group.selected === Group.selectEnum.NONE ) {
              return null;
            }

            if ( group.selected === Group.selectEnum.ALL ) {
              return group.name;
            }

            var optionsDisplayStrings = _.chain( group.options )
                .filter ( function ( option ) { return option.isSelected; } )
                .map ( function ( option ) { return option.name; } )
                .value();

            return optionsDisplayStrings.join($scope.optionDelimiter)
          }

          function updateOptionsDisplayString () {
            $scope.optionsDisplayString = getOptionsDisplayString( $scope.groups );
          }

          function createGroups ( scope, options, groupBy, display, select ) {
            return _.chain( options )
                .groupBy( groupBy )
                .map( function ( options, groupName ) {
                  var group = new Group ( groupName, scope );
                  group.options = _.map( options,
                      function ( option ) {
                        var name = getOptionDisplayName( option, display );
                        var selectionValue = getOptionSelectValue( option, select );
                        // TODO: remove scope? => selectedOptionsValue
                        var newOption = new Option( name, selectionValue, group, scope, scope.selectedOptionsValue );
                        // NOTE: this watch fixes translations issues in FireFox
                        scope.$watch( function () { return getOptionDisplayName( option, display ); },
                            function ( newName ) {
                              newOption.name = newName;
                              updateOptionsDisplayString();
                            });
                        return newOption;
                      });
                  return group;
                })
                .value();
          }

          function getOptionDisplayName( option, display ) {
            return display ? option[display] : option;
          }

          function getOptionSelectValue( option, select ) {
            return  select ? option[select] : option;
          }

          function updateOptionsWithPreSelectedValues () {
            // if anything is selected
            if ( $scope.selectedOptionsValue.length > 0 ) {
              var options = _.chain( $scope.groups )
                  .map( function ( group ) { return group.options; } )
                  .flatten()
                  .value();

              // get options that are ("preSelected") in the selectedOptionsValue
              var selectedOptions = _.filter( options, function ( option ) {
                return _.any( $scope.selectedOptionsValue, function ( selectedOption ) {
                  return _.isEqual( selectedOption, option.selectionValue );
                })});

              _.each( selectedOptions, function ( option ) {
                option.isSelected = true;
              } );
            }
          }

          function getGroupsSelected () {
            if (_.all( $scope.groups, function ( group ) { return group.selected == Group.selectEnum.ALL; } ) ) {
              return Group.selectEnum.ALL;
            }

            if (_.any( $scope.groups, function( group ) { return group.selected == Group.selectEnum.SOME || group.selected == Group.selectEnum.ALL;  } )) {
              return Group.selectEnum.SOME;
            }

            return Group.selectEnum.NONE;
          }

          $scope.toggleSelection = function ( selectable ) {
            selectable.isSelected = !selectable.isSelected;
          };

          $scope.groupClicked = function ( group ) {
            switch ( group.selected ) {
              case Group.selectEnum.ALL:
              case Group.selectEnum.SOME:
                group.selected = Group.selectEnum.NONE;
                break;
              case Group.selectEnum.NONE:
                group.selected = Group.selectEnum.ALL;
                break;
            }
          };

          $scope.toggleAllGroups = function() {
            var allGroupsSelected = getGroupsSelected();

            switch ( allGroupsSelected ) {
              case Group.selectEnum.ALL:
              case Group.selectEnum.SOME:
                _.each( $scope.groups, function ( group ) { group.selected = Group.selectEnum.NONE; });
                break;
              case Group.selectEnum.NONE:
                _.each( $scope.groups, function ( group ) { group.selected = Group.selectEnum.ALL; });
                break;
            }
          };

          $scope.$watch( 'options', function () {
            _.each( $scope.groups, function ( group ) { group.stopWatching(); } );
            $scope.groups = createGroups( $scope, $scope.options, $scope.groupBy, $scope.display, $scope.select );
            updateOptionsDisplayString();
          });

          $scope.$watch( 'selectedOptionsValue', function ()  {
            var options = _.chain( $scope.groups )
                .map( function ( group ) { return group.options; } )
                .flatten()
                .value();

            // get options that are ("preSelected") in the selectedOptionsValue
            var selectedOptions = _.filter( options, function ( option ) {
              return _.any( $scope.selectedOptionsValue, function ( selectedOption ) {
                return _.isEqual( selectedOption, option.selectionValue );
              })});

            _.each( options, function ( option ) {
              if (_.contains( selectedOptions, option) ) {
                option.isSelected = true;
              }
              else {
                option.isSelected = false;
              }
            } );
          });

          $scope.getGroupsSelected = getGroupsSelected;

        }
      ]);
  // TODO: assuming _ is defined
  })( angular.module('marketplace'), _ );
