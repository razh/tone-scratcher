'use strict';

describe( 'Service: audioContext', function() {

  // load the service's module
  beforeEach( module( 'toneScratcherApp' ) );

  // instantiate service
  var audioContext;
  beforeEach( inject( function( _audioContext_ ) {
    audioContext = _audioContext_;
  }));

  it( 'should do something', function() {
    expect( audioContext instanceof AudioContext ).toBeTruthy();
  });
});
