'use strict'; /* global window: true */

require('angular/angular'); // many sub libs, we're getting the main
require('angular-route');
require('angular-base64');
require('angular-cookies');
var angular = window.angular;

var lyricsApp = angular.module('lyricsApp', ['ngRoute', 'base64', 'ngCookies']);

require('./services/services')(lyricsApp);
require('./directives/directives')(lyricsApp);
require('./lyrics/lyrics')(lyricsApp);
require('./users/users')(lyricsApp);
require('./logout')(lyricsApp);

lyricsApp.config(['$routeProvider', function($route) {
  $route
    .when('/lyrics', {
      templateUrl: '/templates/lyrics/views/lyrics_view.html' // must have one parent level element
    })
    .when('/signup', {
      templateUrl: '/templates/users/views/auth_user_view.html',
      controller: 'SignupController'
    })
    .when('/login', {
      templateUrl: '/templates/users/views/auth_user_view.html',
      controller: 'LoginController'
    })
    .otherwise({
      redirectTo: '/lyrics'
    });
}]);
