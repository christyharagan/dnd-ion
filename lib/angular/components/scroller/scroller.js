'use strict';

module.exports = function ($ionicScrollDelegate) {
  return {
    restrict: 'E',
    transclude: true,
    template: '' +
      '<cjh-dnd-target tag="tag" on-drag="onDrag" on-drop="onDrop" style="position:relative; height:100%">' +
      '  <ion-scroll style="position:relative; height:100%" delegate-handle="{{scroller}}">' +
      '    <div ng-transclude></div>' +
      '  </ion-scroll>' +
      '</cjh-dnd-target>',
    scope: {
      tag: '@',
      scroller: '@'
    },
    compile: function () {
      // TODO: Configurable scroll speed

      var preLink = function ($scope, $element) {
        var element = $element[0];
        element.style.display = 'block';

        var isCancelled;
        var isRunning;

        if (!$scope.scroller) {
          $scope.scroller = $scope.tag;
        }

        var scrollUp = function () {
          if (!isCancelled) {
            isRunning = true;
            $ionicScrollDelegate.$getByHandle($scope.scroller).scrollBy(0, -10, false);
            setTimeout(scrollUp, 100);
          }
        };

        var scrollDown = function () {
          if (!isCancelled) {
            isRunning = true;
            $ionicScrollDelegate.$getByHandle($scope.scroller).scrollBy(0, 10, false);
            setTimeout(scrollDown, 100);
          }
        };

        $scope.onDrag = function (e, srcElement) {
          var srcRect = srcElement.getBoundingClientRect();
          var rect = element.getBoundingClientRect();

          if (srcRect.top - 10 < rect.top) {
            isCancelled = false;
            if (!isRunning) {
              scrollUp();
            }
          } else if (srcRect.bottom + 10 > rect.bottom) {
            isCancelled = false;
            if (!isRunning) {
              scrollDown();
            }
          } else {
            isCancelled = true;
            isRunning = false;
          }
        };

        $scope.onDrop = function () {
          isCancelled = true;
          isRunning = false;
        };
      };
      return { pre: preLink };
    }
  };
};