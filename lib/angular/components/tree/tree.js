'use strict';

var htmlUtils = require('cjh-dnd').html.utils;
var utils = require('cjh-dnd').utils;

module.exports = function ($compile, $document) {
  return {
    restrict: 'E',
    scope: {
      tree: '=',
      component: '@',
      listComponent: '@',
      reorderable: '=',
      cjhDraggable: '=',
      droppable: '=',
      getTargets: '=',
      createTempNode: '=',
      removeTempNode: '=',
      createNode: '=',
      moveNode: '='
    },
    compile: function () {
      var preLink = function ($scope, $element) {
        var element = $element[0];
        element.style.display = 'block';

//        var touchGesture;
//        var onTouch;

        var buildTree = function () {
//          if (touchGesture) {
//            $ionicGesture.off(touchGesture, 'touch', onTouch);
//          }

          var tree = $scope.tree;

          if ($scope.cjhDraggable || $scope.reorderable) {
            if (!tree.dndSource) {
              tree.dndSource = {};
            }

            tree.dndSource.selectionType = utils.alignedTreeTargetSelector('v');

            tree.dndSource.getTargets = function () {
              var targets;
              if ($scope.getTargets) {
                targets = $scope.getTargets();
              }

              return targets;
            };

            if (!tree.dndSource.dragParent) {
              if ($scope.reorderable) {
                tree.dndSource.dragParent = element;
              } else {
                tree.dndSource.dragParent = $scope.dragParent ? $scope.dragParent : $document[0].body;
              }
            }

//            var prevent = function (node, eventElement, lastElement, disabled) {
//              if (node.dndSource) {
//                var srcElement = e.srcElement.parentNode();
//                while (srcElement) {
//                  if (srcElement === element) {
//                    break;
//                  }
//                  srcElement = srcElement.parentNode();
//                }
//
//
//                if (node.dndSource.element !== eventElement) {
//                  disabled.push(node);
//                  node.isDisabled = true;
//                  node.children.forEach(function (childNode) {
//                    prevent(childNode, eventElement, disabled);
//                  });
//                }
//              } else {
//                node.children.forEach(function (childNode) {
//                  prevent(childNode, eventElement, disabled);
//                });
//              }
//            };
//
//            onTouch = function (e) {
//              var disabled = [];
//              prevent(tree, e.srcElement, disabled);
//              setTimeout(function () {
//                disabled.forEach(function (node) {
//                  node.isDisabled = false;
//                });
//              });
//
////              var prevent = e.srcElement === element;
////              if (!prevent) {
////                var srcElement = e.srcElement.parentNode();
////                while (srcElement) {
////                  if (srcElement === element) {
////                    break;
////                  }
////                  srcElement = srcElement.parentNode();
////                }
////                prevent = srcElement !== element;
////              }
////              if (prevent) {
////                for (var i = 0; i < draggables.length; i++) {
////                  draggables[i].disable();
////                }
////                setTimeout(function () {
////                  for (var i = 0; i < draggables.length; i++) {
////                    draggables[i].enable();
////                  }
////                }, 200);
////              }
//            };
//
//            touchGesture = $ionicGesture.on('touch', onTouch, $element);
          }

          if ($scope.droppable || $scope.reorderable) {
            if (!tree.dndTarget) {
              tree.dndTarget = {};
            }
            tree.dndTarget.sort = 'v';

            var onDrop = tree.dndTarget.onDrop;
            tree.dndTarget.onDrop = function () {
              if (onDrop) {
                onDrop();
              }
              $scope.$apply();
            };
          }

          htmlUtils.createTree(element, tree,
            $scope.cjhDraggable,
            $scope.droppable,
            $scope.reorderable,
            $scope.createTempNode,
            $scope.removeTempNode,
            $scope.createNode,
            $scope.moveNode);
        };

        $scope.$watch('tree', buildTree);

        $scope.$on('$destroy', function () {
//          if (touchGesture) {
//            $ionicGesture.off(touchGesture, 'touch', onTouch);
//          }
          $scope.tree.destroy();
        });

        var template;
        if ($scope.tree) {
          if ($scope.component) {
            template = '<ion-list>' +
              '<' + $scope.component + ' node="tree"></' + $scope.component + '>' +
              '</ion-list>';
          } else if ($scope.listComponent) {
            template = '<cjh-ion-dnd-tree-list component="' + $scope.listComponent + '" node="tree"></cjh-ion-dnd-tree-list>';
          }

          $compile(template)($scope, function (listElement) {
            $element.append(listElement);
          });
        }
      };
      return {pre: preLink};
    }
  };

};