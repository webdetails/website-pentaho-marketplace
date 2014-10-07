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

(function (app) {

  app.factory('categoryService',
      [ '$translate',
        function ( $translate ) {

          var categories = {};

          function categoryIdToTranslationId(categoryId) {
            return 'marketplace.categories.' +
              // whitespaces => _
                categoryId.toLowerCase().replace(/ /g, "_") +
                '.name';
          }

          function Category(main, sub) {
            // No top level categories allowed.
            // Use "other" category as parent
            if( !sub ) {
              sub = main;
              main = "Other";
            }

            var that = this;
            that.main = main;
            that.mainName = main;
            that.mainTranslateId = categoryIdToTranslationId(main);

            $translate(that.mainTranslateId)
                .then(function (translatedName) {
                  if (translatedName != that.mainTranslateId) {
                    that.mainName = translatedName;
                  }
                });

            if (sub) {
              that.sub = sub;
              that.subName = sub;
              that.subTranslateId = categoryIdToTranslationId(sub);

              $translate(that.subTranslateId)
                  .then(function (translatedName) {
                    if (translatedName != that.subTranslateId) {
                      that.subName = translatedName;
                    }
                  });
            }
          }

          Category.prototype.getId = function () {
            return this.main + this.sub;
          }

          function getCategory(main, sub) {
            var category = categories[ main + sub ];
            if (!category) {
              category = new Category(main, sub);
              categories[ main + sub ] = category;
            }

            return category;
          }

          return {
            getCategory: getCategory
          }
        }
      ]);

})(angular.module('marketplace'));

