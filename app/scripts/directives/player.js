'use strict';

angular.module( 'toneScratcherApp' )
  .directive( 'player', [ 'note', function ( note ) {
    return {
      template: '<button>Play</button>',
      restrict: 'E',
      link: function postLink( scope, element, attr ) {
        var chord = note.chord,
            play  = note.play,
            rest  = note.rest;

        var beat = note.getBeat( 1500 );

        var wholeNote     = beat.wholeNote,
            halfNote      = beat.halfNote,
            quarterNote   = beat.quarterNote,
            eighthNote    = beat.eighthNote,
            sixteenthNote = beat.sixteenthNote;

        element.bind( 'click', function() {
          play( 'E3', halfNote ).start()
          .then( play, 'B4', quarterNote )
          .then( play, 'C6', quarterNote )
          .then( play, 'B5', wholeNote + halfNote )
          .then( play, 'D5', quarterNote )
          .then( play, 'A4', quarterNote )
          .then( play, 'B4', 2 * wholeNote )
          .then( chord, [ 'C4', 'E4', 'G4' ], wholeNote )

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
          .then( play, 'G5', halfNote );
        });
      }
    };
  }]);
