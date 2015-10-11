'use strict'; /* global module: true, console: true */

module.exports = function(app) {
  app.controller('SignupController', ['$scope', '$http', '$location', '$cookies',
                  function($scope, $http, $location, $cookies) {
    $scope.buttonText = 'Create New Account';
    $scope.confirmPassword = true;
    $scope.user = {};
    $scope.changePlacesText = 'Or Sign In as Existing User';
    console.log($location.path());

    $scope.passwordMatch = function(user) {
      return !$scope.confirmPassword || !user.password || (user.password === user.confirmPassword);
    };

    $scope.disableSubmit = function(user) {
      return ($scope.userForm.$invalid || !$scope.passwordMatch(user));
    };

    $scope.changePlaces = function() {
      $location.path('/login');
    };

    $scope.sendToServer = function(user) {
      $http.post('/api/signup', user)
      .then(function(resp) {
        $cookies.put('eat', resp.data.token);
        $scope.getUserName(function(err) {
          if (err) {
            console.log(err);
            $location.path('/signup');
          }
          else
            $location.path('/notes');
        });
      }, function(err) {
        console.log(err);
      });
    };

  }]);
};
