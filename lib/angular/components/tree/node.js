'use strict';

var htmlUtils = require('cjh-dnd').html.utils;
var treeUtils = require('cjh-tree').utils;

var getXY = function (e) {
  var touch = e.gesture.touches[0];
  return {
    x: touch.pageX,
    y: touch.pageY
  };
};

module.exports = function ($ionicGesture) {
  return {
    restrict: 'E',
    template: '<ion-item><div ng-transclude></div></ion-item>',
    scope: {
      node: '=',
      reorderable: '=',
      cjhDraggable: '=',
      droppable: '='
    },
    transclude: true,
    compile: function () {
      var preLink = function ($scope, $element) {
        var element = $element[0];
        element.style.display = 'block';

        var node = $scope.node;

        if ($scope.droppable || $scope.reorderable) {
          if (!node.dndTarget) {
            node.dndTarget = {};
          }
          node.dndTarget.sort = 'v';
        }

        if ($scope.cjhDraggable || $scope.reorderable) {
          if (!node.dndSource) {
            node.dndSource = {};
          }
        }

        htmlUtils.createNode(element, node, $scope.cjhDraggable, $scope.droppable, $scope.reorderable, getXY);
        if (node.dndTarget) {
          node.dndTarget.built = true;
        }
        if (node.dndSource) {
          node.dndSource.built = true;
          node.dndSource.element = element;
        }

        if ($scope.cjhDraggable || $scope.reorderable) {
          var dragStartHandle;
//          var onDragStart = node.dndSource.onDragStart;
          var dragHandle;
//          var onDrag = node.dndSource.onDrag;
          var releaseHandle;
//          var onDrop = node.dndSource.onDrop;

          var onDragStart = function () {
            if (node.root.dndSource.currentTarget) {
              if (treeUtils.isAncestor(node.root.dndSource.currentTarget, node)) {
                node.root.dndSource.currentTarget = node;
              }
            } else {
              node.root.dndSource.currentTarget = node;
            }
          };
          var onDrag = function (e) {
            if (node.root.dndSource.currentTarget === node && node.dndSource.onDrag) {
              if (node.dndSource.onDragStart) {
                node.dndSource.onDragStart(e);
              }
              node.dndSource.onDrag(e);
            }
          };
          var onDrop = function (e) {
            delete node.root.dndSource.currentTarget;

            if (node.dndSource.onDrop) {
              node.dndSource.onDrop(e);
            }
          };

          dragStartHandle = $ionicGesture.on('dragstart', onDragStart, $element);
          dragHandle = $ionicGesture.on('drag', onDrag, $element);
          releaseHandle = $ionicGesture.on('dragend', onDrop, $element);

//          if (onDragStart) {
//            dragStartHandle = $ionicGesture.on('dragstart', onDragStart, $element);
//          }
//          if (onDrag) {
//            dragHandle = $ionicGesture.on('drag', onDrag, $element);
//          }
//          if (onDrop) {
//            releaseHandle = $ionicGesture.on('dragend', onDrop, $element);
//          }

          $scope.$on('$destroy', function () {
            if ($scope.reorderable || $scope.cjhDraggable) {
//              if (onDragStart) {
              $ionicGesture.off(dragStartHandle, 'dragStart', onDragStart);
//              }
//              if (onDrag) {
              $ionicGesture.off(dragHandle, 'drag', onDrag);
//              }
//              if (onDrop) {
              $ionicGesture.off(releaseHandle, 'dragend', onDrop);
//              }
            }
          });
        }
      };
      return {pre: preLink};
    }
  };
};