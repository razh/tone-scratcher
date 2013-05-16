'use strict';

describe( 'Directive: theremin', function () {
  beforeEach( module( 'toneScratcherApp' ) );

  var element;

  it( 'should make hidden element visible', inject( function( $rootScope, $compile ) {
    element = angular.element( '<theremin></theremin>' );
    element = $compile( element )( $rootScope );
    expect( element.text() ).toBe( 'this is the theremin directive' );
  }));
});
