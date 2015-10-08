'use strict';

module.exports = function(app) {
  require('./controllers/lyrics_controller')(app);
//  require('../directives/lyric_edit_directive')(app);
};