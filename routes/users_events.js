'use strict';

var EE = require('events').EventEmitter;

var handleError = require(__dirname + '/../lib/handle_error');

var usersEvents = module.exports = exports = new EE();

usersEvents.on("generated_hash", function(resp, newUser) {
  newUser.save(function(err) {
    if (err) return handleError(err, resp, 500);  //err = database error; show as server error (500)
    usersEvents.emit("user_login", resp, newUser);
  });
});

usersEvents.on("user_exists", function(req, resp, user) {
  user.compareHash(req.auth.password, function(err, hashresp) {
    if (err) return handleError(err, resp, 500);  //err = bcrypt compare error; show as server error (500)
    if (!hashresp) return handleError(err, resp, 401);  //couldn't authenticate
    usersEvents.emit("user_login", resp, user);
  });
});

usersEvents.on("user_login", function(resp, user) {
  // pass auth token to user on successful login
  user.generateToken(function(err, auth) {
    if (err) return handleError(err, resp, 500);
    resp.json({token: auth});
  });
});
