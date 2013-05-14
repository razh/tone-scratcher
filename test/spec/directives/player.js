'use strict';

describe( 'Directive: player', function() {
  beforeEach( module( 'toneScratcherApp' ) );

  var element, scope;
  beforeEach( inject( function( $rootScope, $compile ) {
    element = angular.element( '<player></player>' );
    scope = $rootScope;

    element = $compile( element )( scope );
    scope.$digest();
  }));

  it( 'should replace element with template', function() {
    expect( element.html() ).toBe( '<button>Play</button>' );
  });
});
