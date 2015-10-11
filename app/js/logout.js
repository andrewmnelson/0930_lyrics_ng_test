'use strict';

module.exports = function(app) {
  app.run(['$rootScope', '$cookies', '$location', '$http',
          function ($scope, $cookies, $location, $http) {

    $scope.loggedIn = function () {
      var eat = $cookies.get('eat');
      return eat && eat.length;
    };

    $scope.logOut = function () {
      $cookies.remove('eat');
      $location.path('/login');
    };

    $scope.getUserName = function (callback) {
      var eat = $cookies.get('eat');
      if (!(eat && eat.length)) callback(new Error('not logged in'));

      $http({
        method: 'GET',
        url: '/api/username',
        headers: {
          token: eat
        }
      })
      .then(function(resp) {
        $scope.username = resp.data.username;
      }, function(err) {
        callback(err);
      });
    };

    if ($scope.loggedIn()) {
      $scope.getUserName(function(err) {
        if (err) return console.log(err);
      });
    }

  }]);
};