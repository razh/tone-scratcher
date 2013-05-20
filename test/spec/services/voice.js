'use strict';

describe( 'Service: voice', function() {

  // load the service's module
  beforeEach( module( 'toneScratcherApp' ) );

  // instantiate service
  var voice;
  beforeEach( inject( function( _voice_ ) {
    voice = _voice_;
  }));

  it( 'should do something', function() {
    expect( !!voice ).toBe( true );
  });
});
