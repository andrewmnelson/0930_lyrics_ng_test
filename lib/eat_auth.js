'use strict';

var eat = require('eat');
var handleError = require(__dirname + '/handle_error');
var User = require(__dirname + '/../models/user');

module.exports = exports = function(req, resp, next) {
  var cryptoken = req.headers.token || (req.body? req.body.token : undefined);
  if (!cryptoken) {
    return resp.status(401).json({msg: 'no authentication'});
  }
  var secret = process.env.APP_SECRET;
  if (!secret) throw new Error('server configuration error'); // can't authenticate without APP_SECRET
  eat.decode(cryptoken, secret, function(err, token) {
    if (err) return handleError(err, resp);
    User.findOne({_id: token.id}, function(err, user) {
      if (err) return handleError(err, resp);
      if (!user) return resp.status(401).json({msg: 'could not authenticate'});
      req.user = user;
      next(); // authenticated
    });
  });
};
