var mongoose = require('mongoose');

var lyricSchema = new mongoose.Schema({
  title:  { type: String, required: true },
  author: { type: String, default: 'Anonymous' },
  chorus: { type: String, required: false },
  verse:  { type: [String], required: false }
});

// title is required; either chorus or verse can be empty, but not both
// I don't think I'm doing this quite right, but I couldn't figure out
// how to stack the title validation separate from the chorus/verse,
// since neither chorus nor verse is strictly required.
// Does it have to be this ugly?
lyricSchema.pre('save', function(done, next) {
  if (!this.title) {
    return done(false); 
  }
  else {
    var valid = (this.chorus || (this.verse && this.verse.length));
    return done(valid || new Error('chorus and verse cannot both be empty'));
  }
  return done(new Error('internal exec error'));  // should never get here
});

var Lyric = module.exports = exports = mongoose.model('Lyric', lyricSchema);
