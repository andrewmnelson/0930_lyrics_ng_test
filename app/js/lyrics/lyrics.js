'use strict';

module.exports = function(app) {
  require('./controllers/lyrics_controller')(app);  // where . is like Node's __dirname
};