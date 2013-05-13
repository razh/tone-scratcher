'use strict';

angular.module('toneScratcherApp')
  .controller('MainCtrl', ['$scope', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.audioContext = new window.webkitAudioContext();


    var names = ['C', 'C#', 'D', 'D#', 'E', 'E#', 'F', 'F#', 'G', 'A', 'A#', 'B'],
        regex = /(^[A-G])(b|\#)?([0-9]?$)/;

    // Number of half steps away from A4.
    $scope.halfStepsFromA4 = function( freq ) {
      // Memoize?
      var symbols = regex.exec( freq );

      var name = symbols[1] || 0,
          accidental = symbols[2],
          octave = symbols[3] || 0;

      var note = names.indexOf( name );
      if ( accidental === '#' ) {
        note++;
      } else if ( accidental === 'b' ) {
        note--;
      }

      // Subtract 9 to shift center to A4.
      return note + ( octave - 4 ) * 12 - 9;
    };

    $scope.freqFromString = function( freq ) {
      // ( 2 ^ n / 12 ) * 440 Hz, where n is the half steps away from A4.
      return Math.pow( 2, $scope.halfStepsFromA4( freq ) / 12 ) * 440;
    };

    function Note( freq, duration ) {
      var oscillator = $scope.audioContext.createOscillator();

      oscillator.type = 0;
      oscillator.frequency.value = $scope.freqFromString( freq );
      oscillator.connect( $scope.audioContext.destination );

      return {
        next: null,

        start: function() {
          oscillator.start(0);

          var that = this;

          setTimeout(function() {
            that.stop();
            if ( that.next ) {
              that.next.start();
            }
          }, duration );

          return this;
        },

        stop: function() {
          oscillator.stop(0);
          return this;
        },

        then: function() {
          var args = Array.prototype.slice.call( arguments ),
              callback = args.splice( 0, 1 )[0];

          this.next = callback.apply( this, args );
          return this.next;
        }
      };
    }

    function Rest( duration ) {
      return {
        next: null,

        start: function() {
          var that = this;

          setTimeout(function() {
            if ( that.next ) {
              that.next.start();
            }
          }, duration );

          return this;
        },

        then: function() {
          var args = Array.prototype.slice.call( arguments ),
              callback = args.splice( 0, 1 )[0];

          this.next = callback.apply( this, args );
          return this.next;
        }
      };
    }

    $scope.play = function( freq, duration ) {
      return new Note( freq, duration );
    };

    $scope.rest = function( duration ) {
      return new Rest( duration );
    };

    $scope.beatDuration = 1500;

    $scope.wholeNote = $scope.beatDuration;
    $scope.halfNote = 0.5 * $scope.wholeNote;
    $scope.quarterNote = 0.5 * $scope.halfNote;
    $scope.eighthNote = 0.5 * $scope.quarterNote;
    $scope.sixteenthNote = 0.5 * $scope.eighthNote;
  }]);
