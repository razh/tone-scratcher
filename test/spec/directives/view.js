'use strict';

describe( 'Directive: view', function() {
  beforeEach( module( 'toneScratcherApp' ) );

  var element;

  it( 'should make hidden element visible', inject(function( $rootScope, $compile ) {
    element = angular.element( '<view></view>' );
    element = $compile( element )( $rootScope );
    expect( element.text() ).toBe( 'this is the view directive' );
  }));
});
