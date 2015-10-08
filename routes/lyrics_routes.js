'use strict';

var express = require('express');
var jsonParser = require('body-parser').json();
var lyricsEvents = require(__dirname + '/lyrics_events.js');
var Lyric = require(__dirname + '/../models/lyric');

var lyricsRouter = module.exports = exports = express.Router();

lyricsRouter.get('/lyrics/:title', jsonParser, function(req, resp) {
  Lyric.find(req.params, function(err, data) {
    if (err) {
      lyricsLog(err);
      return resp.status(500).json({ msg: 'internal server error' });
    }
    if ((!data) || (0 === data.length)) {
      return resp.status(404).json({ msg: 'title not found' });
    }
    else {
      resp.json(data);
    }
  });
});

lyricsRouter.get('/lyrics', function(req, resp) {
  Lyric.find({}, function(err, data) {
    if (err) {
      lyricsLog(err);
      return resp.status(500).json({ msg: 'internal server error' });
    }
    resp.json(data);
  });
});

lyricsRouter.put('/lyrics/:title', jsonParser, function(req, resp) {
  var newLyric = new Lyric(req.body);
  if (!newLyric.title || (newLyric.title === req.params.title)) {
    Lyric.findOne(
      { title: req.params.title },
      function(err, data) {
        if (err) {
          lyricsLog(err);
          return resp.status(500).json({msg: 'internal server error'});
        }
        if (!data) return resp.status(404).json({ msg: 'title not found' });
        data.author = req.body.author? newLyric.author : data.author;
        data.chorus = req.body.chorus? newLyric.chorus : data.chorus;
        data.verse = (req.body.verse && req.body.verse.length)?
                     newLyric.verse : data.verse;
        var writeRes = data.save(function(err) {
          if (err) return resp.status(500).json({ msg: 'database save error' });
        });
        if (writeRes.writeError) {
          lyricsLog(writeRes.writeError);
          return resp.status(500).json({ msg: 'database error' });
        }
        return resp.json({ msg: 'success' });
    });
  }
  else return resp.status(409).json({msg: 'title mismatch between JSON and URL'});
});

lyricsRouter.post('/lyrics', jsonParser, function(req, resp) {
  var newLyric = new Lyric(req.body);
  newLyric.save(function(err, data) {
    if (err) {
      if ('ValidationError' === err.name)
        return resp.status(400).json({ msg: err.errors.title.message });
      else
        return resp.status(403).json({ msg: err.toString() });
    }
    resp.status(201).json(data);
  });
});

lyricsRouter.delete('/lyrics/:title', jsonParser, function(req, resp) {
  setTimeout(function() {
    lyricsEvents.emit('finish_delete', req, resp);
  }, 2000);
});
