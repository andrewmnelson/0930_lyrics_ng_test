'use strict';

module.exports = exports = function(req, resp, next) {
  // pull out username:password and add them to the req in way we can read
  // further down the chain. The header field looks like:
  //   Authorization: Basic 'blahblahblahblahblahblahblahblah'
  var userPassEncoded = (req.headers.authorization || ' ').split(' ')[1];
  var userPassBuf = new Buffer(userPassEncoded, 'base64');
  var userPassSplit = userPassBuf.toString('utf8').split(':');
  req.auth = {
    username: userPassSplit[0],
    password: userPassSplit[1]
  };
  if (!(req.auth.username.length && req.auth.password.length)) {
    console.log('could not authenticate: ' + req.auth.username);
    return res.status(401).send({msg: 'could not authenticate'});
  }
  next();
};
