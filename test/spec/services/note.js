'use strict';

describe( 'Service: note', function() {

  // load the service's module
  beforeEach( module( 'toneScratcherApp' ) );

  // instantiate service
  var note;
  beforeEach( inject( function( _note_ ) {
    note = _note_;
  }));

  it( 'should calculate the correct number of halfsteps from A4', function () {
    expect( note.halfStepsFromA4( 'A4' ) ).toBe( 0 );

    expect( note.halfStepsFromA4( 'C3' ) ).toBe( -21 );
    expect( note.halfStepsFromA4( 'C#3' ) ).toBe( -20 );

    expect( note.halfStepsFromA4( 'B3' ) ).toBe( -10 );
    expect( note.halfStepsFromA4( 'C4' ) ).toBe( -9 );

    expect( note.halfStepsFromA4( 'C5' ) ).toBe( 3 );
    expect( note.halfStepsFromA4( 'D5' ) ).toBe( 5 );
    expect( note.halfStepsFromA4( 'E5' ) ).toBe( 7 );

    expect( note.halfStepsFromA4( 'C6' ) ).toBe( 15 );
  });
});
