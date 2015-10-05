'use strict';

var EE = require('events').EventEmitter;
var handleError = require(__dirname + '/../lib/handle_error');
var Lyric = require(__dirname + '/../models/lyric');

var lyricsEvents = module.exports = exports = new EE();

lyricsEvents.on('finish_delete', function(req, resp) {
  Lyric.remove(req.params, function(err, data) {
    if (err) {
      lyricsLog(err);
      return resp.status(500).json({msg: 'internal server error'});
    }
    if ((!data) || (!data.result) || (0 === data.result.n)) {
      return resp.status(404).json({ msg: 'title not found' });
    }
    else {
      resp.json({ msg: 'title deleted' });
    }
  });
});
