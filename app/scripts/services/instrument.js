'use strict';

angular.module( 'toneScratcherApp' )
  .factory( 'instrument', [ 'audioContext', 'note', function( audioContext, note ) {

    var chord = note.chord,
        play = note.play,
        rest = note.rest;

    function Instrument() {
      this.voices = [];
    }

    Instrument.prototype.start = function() {
      angular.forEach( this.voices, function( voice ) {
        voice.start();
      });
    };

    Instrument.prototype.voice = function( options ) {
      this.voices.push( new Voice( options ) );
    };

    // Public API here
    return {
      Instrument: Instrument
    };
  }]);
