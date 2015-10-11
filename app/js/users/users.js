'use strict';

module.exports = function(app) {
  require('./controllers/signup_controller.js')(app);
  require('./controllers/login_controller.js')(app);
};