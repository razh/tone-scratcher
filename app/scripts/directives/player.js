'use strict';

angular.module( 'toneScratcherApp' )
  .directive( 'player', [ 'audioContext', 'note', 'voice', function( audioContext, note, Voice ) {
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

        var voice = new Voice({});
        voice.connect( audioContext.destination );

        function melody() {
          voice.start()
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
          melody();
          bassLine();
        });
      }
    };
  }]);
