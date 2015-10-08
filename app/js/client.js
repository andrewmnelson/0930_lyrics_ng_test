//'use strict';

require('angular/angular'); // why angular/angular? many sub libs, we're getting the main
// other choices: angular/angular.min, etc - look at the node_modules for more

var lyricsApp = angular.module('lyricsApp', []);
require('./lyrics/lyrics')(lyricsApp);

// lyricsApp.controller('lyricsController', ['$scope', function($scope) {
//   $scope.greeting = 'hello fellow';
// }]);
