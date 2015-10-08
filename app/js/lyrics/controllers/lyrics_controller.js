'use strict';
// ALWAYS USE MDN (mozilla) instead of W3C, because it's much better
module.exports = function(app) {
  app.controller('LyricsController', ['$scope', '$http', function($scope, $http) {
    $scope.lyrics = []; // will call ng-repeat on this object on DOM load, so it must exist
    $scope.newLyric = null;
    $scope.stashLyric = {};

    $scope.getAll = function() {  // allows us to re-instantiate DOM
      $http.get('/api/lyrics')    // allows for Cross-Origin Resource Sharing (CORS)
      .then(function(resp) {    //    i.e. client and server can share code
        console.log('getAll: ', resp.data);
        $scope.lyrics = resp.data; // will contain an array of lyric headers ({title, author})
        $scope.newTitle = '';
        $scope.newAuthor = '';
        $scope.newChorus = '';
        $scope.newVerse = [];
      }, function(err) {
        console.log(err);
      });
    };

    $scope.createLyric = function(lyric) {
      $http.post('/api/lyrics', lyric)
      .then(function(resp) {
        $scope.lyrics.push(resp.data);
        $scope.newLyric = null;
      }, function(err) {
        console.log(err);
      });
    };

    $scope.editLyric = function(lyric) {
      $scope.stashLyric.title = lyric.title;
      $scope.stashLyric.author = lyric.author;
      $scope.stashLyric.chorus = lyric.chorus;
      $scope.stashLyric.verse = lyric.verse;
      lyric.editing = true;
    };

    $scope.cancelEdit = function(lyric) {
      lyric.title = $scope.stashLyric.title;
      lyric.author = $scope.stashLyric.author;
      lyric.chorus = $scope.stashLyric.chorus;
      lyric.verse = $scope.stashLyric.verse;
      $scope.stashLyric = {};
      lyric.editing = false;
    }

    $scope.updateLyric = function(lyric) {
      lyric.editing = false;
      $http.put('/api/lyrics/' + lyric.title, lyric)
      .then(function(resp) {
        lyric.editing = false;
      }, function(err) {
        console.log(err);
        lyric.editing = false;
      });
    };

    // to set CSS styling on an element from JS:
    //     lyric.status = 'pending';
    // in HTML:
    //     <li class="{{lyric.status}}" data-ng-repeat ...>
    // in CSS or HTML head's {style}:
    //     .pending { grayed out, or something }

    $scope.deleteLyric = function(lyric) {
      // UI assumes success, will re-load on failure
      lyric.editing = false;
      lyric.deleteStyle = 'pendingDelete';
      $http.delete('/api/lyrics/' + lyric.title)
      .then(function() {
          $scope.lyrics.splice($scope.lyrics.indexOf(lyric), 1);  // this version of splice
                                                                  // removes 2d-param number
                                                                  // of objects at 1st-param
        },
        function(err) {
          $scope.getAll();
          console.log(err);
        }
      );
    };
  }]);
};