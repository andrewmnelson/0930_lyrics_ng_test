//'use strict'; // don't use strict - trust angular :-/

require('angular/angular'); // many sub libs, we're getting the main
// other choices: angular/angular.min, etc - look at node_modules for more

var lyricsApp = angular.module('lyricsApp', []);

require('./services/services')(lyricsApp);
require('./directives/directives')(lyricsApp);
require('./lyrics/lyrics')(lyricsApp);
