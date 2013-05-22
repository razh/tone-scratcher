'use strict';

describe( 'Directive: noteMarker', function() {
  beforeEach( module( 'toneScratcherApp' ) );

  var element;

  it( 'should make hidden element visible', inject( function( $rootScope, $compile ) {
    element = angular.element( '<note-marker></note-marker>' );
    element = $compile( element )( $rootScope );
    expect( element.text() ).toBe( 'this is the noteMarker directive' );
  }));
});
