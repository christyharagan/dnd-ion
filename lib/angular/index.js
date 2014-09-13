'use strict';

module.exports.module = function (angular, ionic) {
  var module = angular.module('cjhDndIon', []);
  require('./components')(module, ionic);
  return module;
};