'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL = 'mongodb://localhost/lyrics_dev');

app.use(express.static(__dirname + '/build'));
var lyricsRouter = require(__dirname + '/routes/lyrics_routes');
var usersRouter = require(__dirname + '/routes/users_routes');
app.use('/api', lyricsRouter);
app.use('/api', usersRouter);

process.env.APP_SECRET = process.env.APP_SECRET || 'baadSecret';

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('lyrics server listening on ' + port + ' at ' + new Date().toString());
});
 