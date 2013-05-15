'use strict';

angular.module( 'toneScratcherApp' )
  .factory( 'note', function() {

    var audioContext = new webkitAudioContext();

    var names = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ],
        regex = /(^[A-G])(b|\#)?([0-9]?$)/;

    // Utility functions.
    // ------------------
    // Number of half steps away from A4.
    function halfStepsFromA4( freq ) {
      // Memoize?
      var symbols = regex.exec( freq );

      var name       = symbols[1] || 0,
          accidental = symbols[2],
          octave     = symbols[3] || 0;

      var note = names.indexOf( name );
      if ( accidental === '#' ) {
        note++;
      } else if ( accidental === 'b' ) {
        note--;
      }

      // Subtract 9 to shift center to A4.
      return note + ( octave - 4 ) * 12 - 9;
    }

    function freqFromString( freq ) {
      // ( 2 ^ n / 12 ) * 440 Hz, where n is the half steps away from A4.
      return Math.pow( 2, halfStepsFromA4( freq ) / 12 ) * 440;
    }


    // Note objects.
    // -------------
    function Rest( duration ) {
      this.duration = duration;
      this.next = null;
    }

    Rest.prototype.start = function() {
      var that = this;

      setTimeout(function() {
        that.stop();
        if ( that.next ) {
          that.next.start();
        }
      }, this.duration );

      return this;
    };

    Rest.prototype.stop = function() { return this; };

    Rest.prototype.then = function() {
      var args = Array.prototype.slice.call( arguments ),
          callback = args.splice( 0, 1 )[0];

      this.next = callback.apply( this, args );
      return this.next;
    };


    function Note( freq, duration ) {
      Rest.call( this, duration );

      this.oscillator = audioContext.createOscillator();

      this.oscillator.type = 0;
      this.oscillator.frequency.value = freqFromString( freq );
    }

    Note.prototype = new Rest();
    Note.prototype.constructor = Note;

    Note.prototype.start = function() {
      this.oscillator.connect( audioContext.destination );
      this.oscillator.start(0);
      this.oscillator.stop( this.duration );
      return Rest.prototype.start.call( this );
    };

    Note.prototype.stop = function() {
      this.oscillator.disconnect(0);
      return this;
    };


    // Allows us to play more than one note.
    function Chord( freqArray, duration ) {
      Rest.call( this, duration );

      this.oscillators = [];

      var oscillator;
      for ( var i = 0, il = freqArray.length; i < il; i++ ) {
        oscillator = audioContext.createOscillator();

        oscillator.type = 0;
        oscillator.frequency.value = freqFromString( freqArray[i] );

        this.oscillators.push( oscillator );
      }
    }

    Chord.prototype = new Rest();
    Chord.prototype.constructor = Chord;

    Chord.prototype.start = function() {
      angular.forEach( this.oscillators, function( oscillator ) {
        oscillator.connect( audioContext.destination );
        oscillator.start(0);
      });

      return Rest.prototype.start.call( this );
    };

    Chord.prototype.stop = function() {
      angular.forEach( this.oscillators, function( oscillator ) {
        oscillator.stop(0);
        oscillator.disconnect(0);
      });

      return this;
    };


    // Public API.
    return {
      chord: function( freqArray, duration ) {
        return new Chord( freqArray, duration );
      },

      play: function( freq, duration ) {
        return new Note( freq, duration );
      },

      rest: function( duration ) {
        return new Rest( duration );
      },

      Chord: Chord,
      Note:  Note,
      Rest:  Rest,

      halfStepsFromA4: halfStepsFromA4,
      freqFromString:  freqFromString,

      getBeat: function( beatDuration ) {
        beatDuration = beatDuration || 1000;
        return {
          wholeNote:     beatDuration,
          halfNote:      0.5    * beatDuration,
          quarterNote:   0.25   * beatDuration,
          eighthNote:    0.125  * beatDuration,
          sixteenthNote: 0.0625 * beatDuration
        };
      }
    };
  });
