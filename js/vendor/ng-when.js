
/*
 * ng-when
 *
 * This angular module provide some usefull directives to execute code only then a certain condition is validated directly in your views
 *
 * @author 	Olivier Bossel <olivier.bossel@gmail.com>
 * @created 	19.06.14
 * @updated 	19.06.14
 * @version 	1.0.0
 */
(function() {
  var ngWhen;
  ngWhen = angular.module('ngWhen', []);

  /*
  	 * When directive that allows you to launch a scope function when the condition is true
   */
  return ngWhen.directive('ngWhen', [
    function() {
      var directive;
      return directive = {
        restrict: 'A',
        controller: [
          '$scope', '$element', '$attrs', '$parse', '$timeout', function($scope, $element, $attrs, $parse, $timeout) {
            var controller;
            return controller = {
              watcherRemover: void 0,

              /*
              							 * Remove the watcher on the element
               */
              removeWatcher: function() {
                if (this.watcherRemover === !void 0) {
                  this.watcherRemover();
                  return this.watcherRemover = void 0;
                }
              },

              /*
              							 * Watch the value to be notified when it's not null or undefined anymore
               */
              setupWatcher: function(value) {
                return this.watcherRemover = $scope.$watch(value, (function(_this) {
                  return function(newValue) {
                    if (newValue === void 0) {
                      return;
                    }
                    if (newValue === null) {
                      return;
                    }
                    _this.removeWatcher();
                    return _this.checkWhen(newValue);
                  };
                })(this), true);
              },

              /*
              							 * Check if the condition is validated
               */
              checkWhen: function(value) {
                var promise;
                if (value === null) {
                  return;
                }
                if (value.$promise) {
                  promise = value.$promise.then;
                } else {
                  promise = value.then;
                }
                if (typeof promise === 'function') {
                  return promise((function(_this) {
                    return function() {
                      return _this.executeCallbacks();
                    };
                  })(this));
                } else {
                  return this.executeCallbacks();
                }
              },

              /*
              							 * Execute the callback when the condition is ok
               */
              executeCallbacks: function() {
                var doAttr, jqueryPlugin, jqueryPluginOptions, jqueryPluginOptionsAttr, scopeCallback;
                doAttr = $attrs.ngWhenDo || $attrs.ngDo || $attrs["do"];
                scopeCallback = $parse(doAttr);
                if (scopeCallback && doAttr) {
                  $timeout(function() {
                    return scopeCallback($scope, {
                      $elm: $element,
                      $attrs: $attrs
                    });
                  });
                }
                jqueryPlugin = $attrs.ngWhenDoJqueryInit || $attrs.ngDoJqueryInit || $attrs.doJqueryInit;
                if (jqueryPlugin) {
                  jqueryPluginOptionsAttr = $attrs.ngWhenDoJqueryOptions || $attrs.ngDoJqueryOptions || $attrs.doJqueryOptions;
                  jqueryPluginOptions = $scope.$eval(jqueryPluginOptionsAttr) || {};
                  return $timeout(function() {
                    return $element[jqueryPlugin](jqueryPluginOptions);
                  });
                }
              }
            };
          }
        ],
        link: function(scope, elm, attrs, controller) {
          var value, whenAttr;
          whenAttr = attrs.ngWhen || attrs.when;
          value = whenAttr && scope.$eval(whenAttr);
          if (value === !void 0 && value === !null) {
            return controller.checkWhen(value);
          } else {
            controller.setupWatcher(whenAttr);
            return elm.bind('$destroy', controller.removeWatcher);
          }
        }
      };
    }
  ]);
})();
