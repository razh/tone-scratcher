'use strict';

describe( 'Directive: player', function() {
  beforeEach( module( 'toneScratcherApp' ) );

  var element;

  it( 'should replace element with template', inject( function( $rootScope, $compile ) {
    element = angular.element( '<player></player>' );
    element = $compile( element )( $rootScope );
    expect( element.html() ).toBe( '<button>Play</button>' );
  }));
});
