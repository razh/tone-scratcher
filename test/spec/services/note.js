'use strict';

describe( 'Service: note', function() {

  // load the service's module
  beforeEach( module( 'toneScratcherApp' ) );

  // instantiate service
  var note;
  beforeEach( inject( function( _note_ ) {
    note = _note_;
  }));

  it( 'should calculate the correct number of halfsteps from A4', function() {
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

  it( 'should calculate the right frequencies', function() {
    expect( note.freqFromString( 'A4') ).toBe( 440 );

    expect( note.freqFromString( 'A7' ) ).toBeCloseTo( 3520 );
    expect( note.freqFromString( 'E7' ) ).toBeCloseTo( 2637.02 );

    expect( note.freqFromString( 'F6' ) ).toBeCloseTo( 1396.91 );
    expect( note.freqFromString( 'D6' ) ).toBeCloseTo( 1174.66 );

    expect( note.freqFromString( 'F#5' ) ).toBeCloseTo( 739.989 );

    expect( note.freqFromString( 'B3' ) ).toBeCloseTo( 246.942 );

    expect( note.freqFromString( 'A0' ) ).toBeCloseTo( 27.5 );
  });

  it( 'should return a new Chord object when chord() is called', function() {
    var testChord = note.chord( [ 'C4', 'E4', 'G4' ], 1000 );
    expect( testChord instanceof note.Chord ).toBeTruthy();
    expect( testChord.duration ).toBe( 1000 );
  });

  it( 'should return a new Note object when play() is called', function() {
    var testNote = note.play( 'A4', 1000 );
    expect( testNote instanceof note.Note ).toBeTruthy();
    expect( testNote.freq ).toBe( 440 );
    expect( testNote.duration ).toBe( 1000 );
  });

  it( 'should return a new Rest when play() is called', function() {
    var testRest = note.rest( 1000 );
    expect( testRest instanceof note.Rest ).toBeTruthy();
    expect( testRest instanceof note.Note ).toBeFalsy();
    expect( testRest.duration ).toBe( 1000 );
  });

  it( 'should allow for chained note creation', function() {
    spyOn( note, 'play' ).andCallThrough();
    var play = note.play;

    var testNote = play( 'A4', 500 )
      .then( play, 'B4', 1000 )
      .then( play, 'C4', 1500 );

    expect( note.play.calls[0].args ).toEqual( [ 'A4', 500 ] );
    expect( note.play.calls[1].args ).toEqual( [ 'B4', 1000 ] );
    expect( note.play.calls[2].args ).toEqual( [ 'C4', 1500 ] );
  });

  it( 'should return correct duration values', function() {
    var beat = note.getBeat( 1500 );
    expect( beat.wholeNote ).toBe( 1500 );
    expect( beat.halfNote ).toBe( 750 );
    expect( beat.quarterNote ).toBe( 375 );
    expect( beat.eighthNote ).toBe( 187.5 );
    expect( beat.sixteenthNote ).toBe( 93.75 );
  });
});
