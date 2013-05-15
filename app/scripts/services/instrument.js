'use strict';

angular.module( 'toneScratcherApp' )
  .factory( 'instrument', [ 'note', function( note ) {

    var audioContext = new webkitAudioContext();

    var chord = note.chord,
        play = note.play,
        rest = note.rest;

    /**
     * Returns the linear interpolation of a to b by alpha.
     * @param  {[type]} a
     * @param  {[type]} b
     * @param  {[type]} alpha
     * @return {[type]}
     */
    function lerp( a, b, alpha ) {
      return ( 1 - alpha ) * a + alpha * b;
    }

    function Instrument( options ) {
      // Whether the Instrument will lerp between notes.
      this.portamento = options.portamento || false;

      this.frequency = options.frequency || 440;
      this.type = options.type || 0;

      this.oscillator = audioContext.createOscillator();

      this.currentFrequency = this.frequency;
      this.targetFrequency = this.frequency + 100;
    }

    Instrument.prototype.play = function() {

    };

    /**
     * Plays the note (or note chain) at the given startTime.
     * @param  {[type]} note
     * @param  {[type]} startTime
     */
    Instrument.prototype.addNote = function( note, startTime ) {

    };

    // Public API here
    return {
      Instrument: Instrument
    };
  }]);
