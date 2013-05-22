'use strict';

angular.module( 'toneScratcherApp' )
  .directive( 'player', [ 'audioContext', 'note', 'instrument', 'voice',function( audioContext, note, Instrument, Voice ) {
    return {
      template: '<button>Play</button>',
      restrict: 'E',
      link: function postLink( scope, element, attr ) {
        var play  = note.play,
            rest  = note.rest;

        var beat = note.getBeat( 1500 ); // 90 BPM 4/4.

        var wholeNote     = beat.wholeNote,
            halfNote      = beat.halfNote,
            quarterNote   = beat.quarterNote,
            eighthNote    = beat.eighthNote,
            sixteenthNote = beat.sixteenthNote;

        var tuna = new Tuna( audioContext );

        // Voices.
        var sawVoice = new Voice({
          type: 1,
          maxGain: 0.025
        });

        var sineVoice = new Voice();

        var instrument = new Instrument();

        instrument.voice({
          type: 1,
          maxGain: 0.01
        }).voice({
          type: 0,
          maxGain: 0.02
        }).connect( audioContext.destination ).start()
        .then( play, 'C4', quarterNote / 3 )
        .then( play, 'F4', quarterNote / 3 )
        .then( play, 'Bb4', quarterNote / 3 )

        .then( play, 'C4', quarterNote / 3 )
        .then( play, 'F4', quarterNote / 3 )
        .then( play, 'Bb4', quarterNote / 3 )

        .then( play, 'C4', quarterNote / 3 )
        .then( play, 'F4', quarterNote / 3 )
        .then( play, 'Bb4', quarterNote / 3 )

        .then( play, 'C4', quarterNote / 3 )
        .then( play, 'F4', quarterNote / 3 )
        .then( play, 'Bb4', quarterNote / 3 )

        .then( play, 'C4', quarterNote / 3 )
        .then( play, 'E4', quarterNote / 3 )
        .then( play, 'G4', quarterNote / 3 )

        .then( play, 'C4', quarterNote / 3 )
        .then( play, 'E4', quarterNote / 3 )
        .then( play, 'G4', quarterNote / 3 )

        .then( play, 'C4', quarterNote / 3 )
        .then( play, 'E4', quarterNote / 3 )
        .then( play, 'G4', quarterNote / 3 )

        .then( play, 'C4', quarterNote / 3 )
        .then( play, 'E4', quarterNote / 3 )
        .then( play, 'G4', quarterNote / 3 );

        // Reverb.
        var convolver = new tuna.Convolver({
          highCut: 22050, // 20 to 22050
          lowCut: 20, // 20 to 22050
          dryLevel: 1, // 0 to 1+
          wetLevel: 1, // 0 to 1+
          level: 1, // 0 to 1+, adjusts total output of both wet and dry
          impulse: 'scripts/lib/tuna/impulses/impulse_rev.wav', // the path to your impulse response
          bypass: 0
        });

        convolver.connect( audioContext.destination );

        function melody( voice ) {
          voice.connect( convolver.input ).start()
          .then( play, 'E3', halfNote )
          .then( play, 'B4', quarterNote )
          .then( play, 'C6', quarterNote )
          .then( play, 'B5', wholeNote + halfNote )
          .then( play, 'D5', quarterNote )
          .then( play, 'A4', quarterNote )
          .then( play, 'B4', 2 * wholeNote )

          .then( play, 'B5', quarterNote )
          .then( play, 'G5', quarterNote )
          .then( play, 'B4', halfNote )

          .then( play, 'D5', quarterNote + eighthNote + sixteenthNote )
          .then( play, 'C5', sixteenthNote )
          .then( play, 'B4', halfNote )

          .then( play, 'B4', quarterNote )
          .then( play, 'A3', quarterNote )
          .then( play, 'B3', quarterNote )
          .then( play, 'B3', quarterNote / 3 )
          .then( play, 'C4', quarterNote / 3 )
          .then( play, 'D4', quarterNote / 3 )

          .then( play, 'B3', quarterNote + eighthNote + sixteenthNote )
          .then( play, 'C5', sixteenthNote )
          .then( play, 'B4', halfNote + 2 * wholeNote )

          .then( rest, halfNote )
          .then( play, 'A5', quarterNote )
          .then( play, 'C6', quarterNote )

          .then( play, 'B5', wholeNote + halfNote )
          .then( play, 'G5', quarterNote )
          .then( play, 'B5', quarterNote )

          .then( play, 'A5', quarterNote )
          .then( play, 'A5', quarterNote / 3 )
          .then( play, 'G5', quarterNote / 3 )
          .then( play, 'F#5', quarterNote / 3 )
          .then( play, 'G5', halfNote )

          .then( play, 'G5', halfNote )
          .then( play, 'G4', quarterNote )
          .then( play, 'D5', quarterNote )

          .then( play, 'E5', quarterNote )
          .then( play, 'E5', quarterNote / 3 )
          .then( play, 'D5', quarterNote / 3 )
          .then( play, 'C5', quarterNote / 3 )
          .then( play, 'D5', quarterNote + eighthNote )
          .then( play, 'G4', eighthNote + sixteenthNote )
          .then( play, 'D5', sixteenthNote )

          .then( play, 'E5', quarterNote )
          .then( play, 'E5', eighthNote / 3 )
          .then( play, 'D5', eighthNote / 3 )
          .then( play, 'C5', eighthNote / 3 )
          .then( play, 'D5', quarterNote + eighthNote )
          .then( play, 'G5', eighthNote + sixteenthNote )
          .then( play, 'B5', sixteenthNote )

          .then( play, 'A5', halfNote + quarterNote )
          .then( play, 'A5', eighthNote / 3 )
          .then( play, 'G5', eighthNote / 3 )
          .then( play, 'F#5', eighthNote / 3 )

          .then( play, 'G5', 2 * wholeNote );
        }

        function bassLine() {

        }

        element.bind( 'click', function() {
          melody( sineVoice );
          bassLine();
        });
      }
    };
  }]);
