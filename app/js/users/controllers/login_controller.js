'use strict';

module.exports = function(app) {
  app.controller('LoginController', ['$scope', '$http', '$base64', '$location', '$cookies',
                  function($scope, $http, $base64, $location, $cookies) {
    $scope.buttonText = 'Log In';
    $scope.user = {};
    $scope.changePlacesText = 'Or Create an Account';
    $scope.confirmPassword = false;
    $scope.passwordMatch = function() { return true; };

    $scope.changePlaces = function() {
      $location.path('/signup');
    };

    $scope.sendToServer = function(user) {
      $http({
        method: 'GET',
        url: '/api/login',
        headers: {
          'Authorization': 'Basic ' + $base64.encode(user.username + ':' + user.password)
        }
      })
      .then(function(resp) {
        $cookies.put('eat', resp.data.token);
        $scope.getUserName(function(err) {
          if(err) console.log(err);
        });
        $location.path('/lyrics');
      }, function(err) {
        console.log(err);
      });
    };
  }]);
};
