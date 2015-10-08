var express = require('express');
var jsonParser = require('body-parser').json();
var httpBasic = require(__dirname + '/../lib/http_basic');

var handleError = require(__dirname + '/../lib/handle_error');
var User = require(__dirname + '/../models/user');
var usersEvents = require(__dirname + '/users_events.js');

var usersRouter = module.exports = exports = express.Router();

usersRouter.post('/createUser', jsonParser, function(req, resp) {
  var newUser = new User();
  newUser.basic.username = req.body.username;
  newUser.username = req.body.username; // might also take an email
  // add validation to
  //   1. make sure the username is unique
  //   2. make sure username : password are both populated
  newUser.generateHash(req.body.password, function(err, hash) {
    if (err) return handleError(err, resp);
    usersEvents.emit('generated_hash', resp, newUser);
  });
});

usersRouter.get('/login', httpBasic, function(req, resp) {
  User.findOne({'basic.username': req.auth.username}, function(err, user) {
    if (err) return handleError(err, resp);
    userEvents.emit('user_exists', req, resp, user);
  });
});
