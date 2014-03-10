'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',

  // 3rd party dependencies
  'btford.socket-io'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/devices', {
      templateUrl: 'partials/partial1',
      controller: 'DeviceController'
    }).
    when('/homeplan', {
      templateUrl: 'partials/partial2',
      controller: 'HomePlanController'
    }).
    when('/civil', {
      templateUrl: 'partials/partial3',
      controller: 'CivilController'
    }).
    otherwise({
      redirectTo: '/devices'
    });

  $locationProvider.html5Mode(true);
});
