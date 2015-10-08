'use strict';

module.exports = function(app) {
  // syntax is semantic: Angular expects testDirective in JS => test-directive in HTML
  app.directive('testDirective', function() {
    return {
      restrict: 'A',  // A => can only be an Attribute (vs. class, element or comment)
      replace: true,  // replaces containing element with whatever's in the template
      template: '<!-- never mind the Sex Pistols, it\'s {{greeting}}! -->',
      scope: {
        foo: '=',     // '=' denotes a symbol reference
        greeting: '@' // '@' denotes a literal
        // '&' denotes a function call
      },
      controller: function($scope) {
        $scope.greeting = $scope.greeting || 'a default salutation';
      }
    };
  });
};