//'use strict';
// ALWAYS USE MDN (mozilla) instead of W3C, because it's much better
module.exports = function(app) {
  app.controller('LyricsController', ['$scope', 'Resource', '$http', function($scope, Resource, $http) {
    var lyricResource = Resource('lyrics');
    $scope.showUsage = false;
    $scope.errorMsg = '';
    $scope.lyrics = []; // will call ng-repeat on this object on DOM load, so it must exist
    $scope.newLyric = {};
    $scope.stashLyric = {};

    $scope.toggleUsage = function() {
      $scope.showUsage = !$scope.showUsage;
      console.log('showUsage: ', $scope.showUsage);
      return $scope.showUsage;
    };

    $scope.cloneLyric = function(dest, src) {
      dest.title = src.title;
      dest.author = src.author;
      dest.chorus = src.chorus;
      dest.verse = src.verse;
    };

    $scope.getAll = function() {
      lyricResource.getAll( function(err, data) {
        if (err) return console.log(err);
        $scope.lyrics = data; // will contain an array of lyric headers ({title, author})
        $scope.newLyric = {};
      });
    };

    $scope.getLyric = function(title) {
      $http.get('/api/lyrics/' + title)
      .then(function(resp) {
        $scope.newLyric = resp.data[0];
        $scope.newLyric.display = true;
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

    $scope.enterNewLyric = function() {
      if ($scope.newLyric) {
        $scope.stashLyric = {};
        $scope.cloneLyric($scope.stashLyric, $scope.newLyric);
      }
      $scope.newLyric = {};
      $scope.newLyric.editing = true;
    };

    $scope.cancelNewLyric = function() {
      if ($scope.stashLyric) {
        $scope.cloneLyric($scope.newLyric, $scope.stashLyric);
      }
      delete $scope.newLyric.editing;
    };

    $scope.editLyric = function(lyric) {
      $scope.cloneLyric($scope.stashLyric, lyric);
      lyric.editing = true;
    };

    $scope.cancelEdit = function(lyric) {
      $scope.cloneLyric(lyric, $scope.stashLyric);
      $scope.stashLyric = {};
      delete lyric.editing;
    };

    $scope.updateLyric = function(lyric) {
      $http.put('/api/lyrics/' + lyric.title, lyric)
      .then(function(resp) {
        delete lyric.editing;
      }, function(err) {
        console.log(err); // leave editing up so user can save data elsewise
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
                                                                  // removes 2nd-param number
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