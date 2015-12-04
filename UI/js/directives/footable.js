'use strict';

angular.module('app.directives')

.directive('footable', ['$timeout', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {

            if (!element.hasClass('footable-loaded')) {
                element.footable();
            }

            var redrawFootable = function () {
                $timeout(function () {
                    var array = scope[attr.value];

                    for (var i = 0; i < array.length; i++) {
                        delete array[i].$$hashKey;
                    }

                    element.trigger('footable_resize');

                    element.trigger('footable_redraw');

                });
            };

            scope.$watchCollection(attr.value, redrawFootable);
            scope.$watch(attr.value, redrawFootable);
        }
    }
}])
