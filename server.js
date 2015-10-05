'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL = 'mongodb://localhost/lyrics_test');

app.use(express.static(__dirname + '/build'));
var lyricsRouter = require(__dirname + '/routes/lyrics_routes');
app.use('/api', lyricsRouter);

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('lyrics server listening on ' + port + ' at ' + new Date().toString());
});
 