'use strict';

module.exports = function(app) {
  app.directive('lyricEdit', function() {
    return {
      restrict: 'AC',
      replace: true,
      templateUrl: '/templates/lyrics/lyric_edit_directive.html',
      scope: {
        saveButtonText: '@',
        existing: '=',
        lyric: '=',
        save: '&',
        del: '&'
      },
      controller: function($scope) {
        console.log($scope.save);
      }
    };
  });
};