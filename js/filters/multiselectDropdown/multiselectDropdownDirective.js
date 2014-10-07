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

(function ( app ) {
  app.directive('multiselectDropdown',
      function() {
        return {
          restrict: 'A', // 'A' must be used for IE8 compatibility
          replace: true, //replaces the custom directive element with the corresponding expanded HTML, to be HTML-compliant.
          templateUrl: 'js/filters/multiselectDropdown/multiselectDropdownTemplate.html',
          controller: 'multiselectDropdownController',
          scope: {
            /**
             * An array where the selected values will be placed.
             */
            selectedOptionsValue: '=selectedOptions',
            /**
             * The source options for the multiselect.
             */
            options: '=',
            /**
             * The option attribute name by which the options will be grouped by
             */
            groupBy: '@',
            /**
             * The option attribute name which value will be used when displaying the options
             */
            display: '@',
            /**
             * The option attribute name which value will be used to fill in the selectedOptions array.
             * If no value is specified the options itself will be used as the selected value.
             */
            select: '@',
            /**
             * Whether or not to use a divider line between groups
             */
            useDivider: '@',
            /**
             * Text prefix to be used in the selection box
             */
            prefix: '@',
            /**
             * Text that is shown when no option is selected
             */
            noOptionSelected: '@',
            /**
             * Text that is shown when all options are selected
             */
            allOptionsSelected: '@',
            /**
             * Text that delimits the options
             */
            optionDelimiter: '@'
          }
        };
      }
    );

  })( angular.module('marketplace') );
