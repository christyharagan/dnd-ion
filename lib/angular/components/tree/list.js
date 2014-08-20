'use strict';

module.exports = function ($compile) {
  return {
    restrict: 'E',
    scope: {
      node: '=',
      component: '@',
      showDelete: '=',
      canSwipe: '='
    },
    compile: function () {
      return {
        pre: function ($scope, $element) {
          $element[0].style.display = 'block';
        },

        post: function ($scope, $element) {
          var template = '<ion-list can-swipe="canSwipe" show-delete="showDelete">' +
            '<span ng-repeat="child in node.children">' +
            '<' + $scope.component + ' node="child"></' + $scope.component + '>' +
            '</span>' +
            '</ion-list>';

          $compile(template)($scope, function(listElement){
            $element.append(listElement);
          });
        }
      };
    }
  };

};