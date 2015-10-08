'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var mongoose = require('mongoose');

var server = require(__dirname + '/../../server');
var lyricsURL = 'localhost:3000/api'

process.env.MONGO_URL = 'mongodb://localhost/lyrics_test';

var Lyric = require(__dirname + '/../../models/lyric');

describe('the lyrics server', function() {
  after(function(done) {  // clean up the database for the next test run
    mongoose.connection.db.dropDatabase(function(err) {
      if (err) return console.log(err);
      done();
    });
  });
  it('should exist', function() {
    expect(Lyric).not.to.eql(undefined);
    expect(Lyric).not.to.eql(null);
  })
  it('should have a database connection', function(done) {
    chai.request(lyricsURL)
    .get('/lyrics')
    .end(function(err, resp) {
      expect(err).to.eql(null);
      expect(Array.isArray(resp.body)).to.eql(true);
      done();
    });
  });
  it('should be able to write a lyric to the database', function(done) {
    chai.request(lyricsURL)
    .post('/lyrics')
    .send({
        title: '99BottlesOfBeer',
        verse: ['var i = 99 Bottles of Beer on the wall, i Bottles of Beer\n' +
                'You take one down and pass it around, --i Bottles of Beer!'],
        chorus: 'do while i'
      })
    .end(function (err, ret) {
      expect(err).to.eql(null);
      expect(ret.status).to.eql(201); // Created
      expect(ret.body.title).to.eql('99BottlesOfBeer');
      expect(ret.body.author).to.eql('Anonymous');
      expect(ret.body.chorus).to.eql('do while i');
      done();
    });
  });

  describe('routes that read lyrics from the database', function(done) {
    var cannedLyric = new Lyric({
      title: 'FriedHam',
      verse: ['Fried Ham, Fried Ham, Cheese and Baloney\n' +
              'Tomatoes and Crackers, and after the Macaroni\n' +
              'We\'ll have Onions, Pickles and Peppers,\n' +
              'And then we\'ll all have more Fried Ham\n'
            ],
      chorus: 'Fried Ham Fried Ham!'
    });
    before(function(done) {
      cannedLyric.save(function(err, data) {
        if (err) throw(err);
      });
      done();
    });
    it('should be able to retrieve an existing lyric by title', function(done) {
      chai.request(lyricsURL)
      .get('/lyrics/' + cannedLyric.title)
      .end(function(err, ret) {
        expect(err).to.eql(null);
        expect(ret.body[0].chorus).to.eql('Fried Ham Fried Ham!');
        expect(ret.body[0].author).to.eql('Anonymous');
        done();
      })
    });
    it ('should respond appropriately when title not found', function(done) {
      chai.request(lyricsURL)
      .get('/lyrics/Bogus')
      .end(function(err, ret) {
        expect(err).to.eql(null); // it's not an error for something not to be there
        expect(ret.status).to.eql(404);
        expect(ret.body.msg).to.equal('title not found');
        done();
      });
    });
    it('should be able to update an existing lyric', function(done) {
      chai.request(lyricsURL)
      .put('/lyrics/' + cannedLyric.title)
      .send({author: 'some loathsome adolescent'})
      .end(function(err, ret) {
        expect(err).to.eql(null);
        expect(ret.body.msg).to.eql('success');
        done();
      });
    });
    it('should find that update worked', function(done) { // TODO: inter-test dependency
      chai.request(lyricsURL)
      .get('/lyrics/' + cannedLyric.title)
      .end(function(err, ret) {
        expect(err).to.eql(null);
        expect(ret.body[0].chorus).to.eql('Fried Ham Fried Ham!');
        expect(ret.body[0].author).to.eql('some loathsome adolescent');
        done();
      });
    });
    it('should not be able to delete a non-existent title', function(done) {
      chai.request(lyricsURL)
      .delete('/lyrics/' + 'bogusTitle')
      .end(function(err, ret) {
        expect(err).to.eql(null); // it's not an error for something not to be there
        expect(ret.status).to.eql(404);
        expect(ret.body.msg).to.eql('title not found');
        done();
      });
    });
    it('should be able to delete a title', function(done) {
      chai.request(lyricsURL)
      .delete('/lyrics/' + cannedLyric.title)
      .end(function(err, ret) {
        expect(err).to.eql(null);
        expect(ret.body.msg).to.eql('title deleted');
        done();
      });
    });
  });
});
