'use strict';

angular.module( 'toneScratcherApp' )
  .factory( 'note', function() {

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
    function Rest( duration, voice ) {
      this.duration = duration || 0;
      this.voice = voice || null;

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

      args.push( this.voice );
      this.next = callback.apply( this, args );

      return this.next;
    };


    function Note( noteName, duration, voice ) {
      this.freq = freqFromString( noteName );
      Rest.call( this, duration, voice );
    }

    Note.prototype = new Rest();
    Note.prototype.constructor = Note;

    Note.prototype.start = function() {
      if ( this.voice ) {
        this.voice.setFrequency( this.freq ).start();
      }

      return Rest.prototype.start.call( this );
    };

    Note.prototype.stop = function() {
      if ( this.voice ) {
        this.voice.stop();
      }

      return this;
    };


    // Public API.
    return {
      play: function( freq, duration, voice ) {
        return new Note( freq, duration, voice );
      },

      rest: function( duration, voice ) {
        return new Rest( duration, voice );
      },

      Note: Note,
      Rest: Rest,

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
