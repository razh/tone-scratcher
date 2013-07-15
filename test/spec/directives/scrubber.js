'use strict';

describe( 'Directive: scrubber', function() {
  beforeEach( module( 'toneScratcherApp' ) );

  var element;

  it( 'should make hidden element visible', inject( function( $rootScope, $compile ) {
    element = angular.element( '<scrubber></scrubber>' );
    element = $compile( element ) ($rootScope );
    expect( element.text() ).toBe( 'this is the scrubber directive' );
  }));
});
