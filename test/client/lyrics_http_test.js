require(__dirname + '/../../app/js/client');
require('angular-mocks');


describe('lyrics controller', function() {
  var $httpBackend;             // \
  var $ControllerConstructor;   //  > from angular-mocks
  var $scope;                   // /

  beforeEach(angular.mock.module('lyricsApp'))
  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $ControllerConstructor = $controller;
  }));

  it('should be able to create an initialized controller', function() {
    var controller = new $ControllerConstructor('LyricsController', {$scope: $scope});
    expect(typeof $scope).toBe('object');
    expect(typeof controller).toBe('object')
    expect(Array.isArray($scope.lyrics)).toBe(true);
    expect($scope.lyrics.length).toBe(0);
    expect($scope.enterNewLyric).not.toBe(undefined);
    expect($scope.cancelNewLyric).not.toBe(undefined);
    expect($scope.editLyric).not.toBe(undefined);
    expect($scope.cancelEdit).not.toBe(undefined);
  });

  it('should flush newLyric when starting to add a new lyric', function() {
    var controller = new $ControllerConstructor('LyricsController', {$scope: $scope});
    $scope.newLyric = {title:'should be gone', author: '', chorus: 'really should be gone', verse: [] };
    $scope.enterNewLyric();
    expect($scope.stashLyric).toEqual( {title:'should be gone', author: '', chorus: 'really should be gone', verse: [] } );
    expect($scope.newLyric).toEqual({ editing: true });
  });

  it('should stash and restore current version when editing/cancelling existing lyric', function() {
    var controller = new $ControllerConstructor('LyricsController', {$scope: $scope});
    $scope.stashLyric = {};
    $scope.lyrics.push( { title: 'first title', author: '', chorus: 'first chorus', verse: [] } );
    $scope.lyrics.push( { title: 'title two', author: 'second author', chorus: '', 
                          verse: [ 'verse one', 'verse two' ] } );
    $scope.editLyric($scope.lyrics[1]);
    expect($scope.stashLyric).toEqual({ title: 'title two', author: 'second author', chorus: '',
                                        verse: [ 'verse one', 'verse two' ] });
    $scope.lyrics[1].chorus = 'well well well';
    $scope.lyrics[1].author = 'some other fella';
    $scope.cancelEdit($scope.lyrics[1]);
    expect($scope.lyrics[1]).toEqual({ title: 'title two', author: 'second author', chorus: '',
                                        verse: [ 'verse one', 'verse two' ] });
  });

  describe('REST requests', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      $ControllerConstructor('LyricsController', {$scope: $scope});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a GET request when getAll() is called', function() {
      $httpBackend.expectGET('/api/lyrics').respond(200, [
        { _id: 1, title:'testTitle', author:'testAuthor', chorus:'testChorus'},
        { _id: 2, title:'second Title', author: 'second author', verse: ['first verse', 'second verse, same as the first'] },
        { _id: 3, title:'third Title', chorus: 'a song can be simple' }
      ]);
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.lyrics.length).toBe(3);
      expect($scope.lyrics[0].title).toBe('testTitle');
      expect($scope.lyrics[0].author).toBe('testAuthor');
      expect($scope.lyrics[0].chorus).toBe('testChorus');
      expect($scope.lyrics[1].verse[0]).toBe('first verse');
    });

    it('should be able to GET and display a single lyric', function() {
      $httpBackend.expectGET('/api/lyrics/testTitle').respond(200, [
        { _id: 1, title:'testTitle', author:'testAuthor', chorus:'testChorus'}
      ]);
      $scope.getLyric('testTitle');
      $httpBackend.flush();
      expect($scope.newLyric.title).toBe('testTitle');
      expect($scope.newLyric.author).toBe('testAuthor');
      expect($scope.newLyric.chorus).toBe('testChorus');
      expect($scope.newLyric.display).toBe(true);
    });

    it('should be able to POST a new lyric and push the result to its list', function() {
      $httpBackend.expectPOST('/api/lyrics').respond(200,
        // { title: 'testInTitle', chorus: 'testInChorus' },   // expected inbound
        { _id: 1, title:'testTitle', author:'testAuthor', 
          chorus:'testChorus', verse: ['testVerse1', 'testVerse2']}
      );
      $scope.newLyric = {title:'should be gone', chorus: 'really should be gone'};
      $scope.createLyric({title:'testTitle', chorus:'testChorus'});
      $httpBackend.flush();
      expect($scope.lyrics.length).toBe(1);
      expect($scope.lyrics[0].title).toBe('testTitle');     // expected outbound
      expect($scope.newLyric).toBe(null);
    });

    // it('should be able to PUT a correction to a lyric in the list', function() {
    //   $httpBackend.expectPUT('api/lyrics/')
    // })
  });

  // // run this test to make sure the test framework is even in place
  // it('should run a front-end test', function() {
  //   expect(true).toBe(true);
  // });
});

