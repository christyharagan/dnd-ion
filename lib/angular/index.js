'use strict';

module.exports.module = function (angular, ionic) {
  var module = angular.module('cjhIonDnd', []);
  require('./components')(module, ionic);
  return module;
};