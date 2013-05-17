'use strict';

angular.module( 'toneScratcherApp' )
  .factory( 'instrument', [ 'audioContext', 'note', function( audioContext, note ) {

    var chord = note.chord,
        play = note.play,
        rest = note.rest;

    function Instrument( options ) {
      // Whether the Instrument will lerp between notes.
      this.glideTime = options.glideTime || 0;

      this.frequency = options.frequency || 440;

      this.oscillator = audioContext.createOscillator();
      this.oscillator.type = options.type || 0;

      this.currentFrequency = this.frequency;
      this.targetFrequency = this.frequency + 100;
    }

    Instrument.prototype.play = function() {
      this.oscillator.start();
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
