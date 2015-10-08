//'use strict';  // don't use strict - trust angular :-/
require('angular/angular');

var handleSuccess = function(callback) {
  return function(resp) {
    callback(null, resp.data);
  };
};

var handleFailure = function(callback) {
  return function(error) {
    callback(error);
  };
};

module.exports = exports = function(app) {
  app.factory('Resource', ['$http', function($http) {
    // factory function always returns something
    // in this case, an error handler with a node-style (err, data) callback
    // instead of the angular-style successCB(), errorCB()
    var Resource = function(resourceName) {
      this.resourceName = resourceName;
    };

    Resource.prototype.getAll = function(callback) {
      $http.get('/api/' + this.resourceName)
      .then(handleSuccess(callback), handleFailure(callback));
    };
    Resource.prototype.create = function(resource, callback) {
      $http.post('/api/' + this.resourceName, resource)
      .then(handleSuccess(callback), handleFailure(callback));
    };
    Resource.prototype.read = function(resource, callback) {
      $http.get('/api/' + this.resourceName + '/' + resource.title)
      .then(handleSuccess(callback), handleFailure(callback));
    };
    Resource.prototype.update = function(resource, callback) {
      $http.put('/api/' + this.resourceName + '/' + resource.title, resource)
      .then(handleSuccess(callback), handleFailure(callback));
    };
    Resource.prototype.delete = function(resource, callback) {
      $http.delete('/api/' + this.resourceName + '/' + resource.title)
      .then(handleSuccess(callback), handleFailure(callback));
    };

    return function(resourceName) {
      return new Resource(resourceName);
    };
  }]);
};
