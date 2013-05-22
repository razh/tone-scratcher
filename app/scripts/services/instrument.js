'use strict';

angular.module( 'toneScratcherApp' )
  .factory( 'instrument', [ 'audioContext', 'voice', function( audioContext, Voice ) {

    function Instrument() {
      this.voices = [];
    }

    Instrument.prototype.connect = function( node ) {
      angular.forEach( this.voices, function( voice ) {
        voice.connect( node );
      });
      return this;
    };

    Instrument.prototype.start = function() {
      angular.forEach( this.voices, function( voice ) {
        voice.start();
      });
      return this;
    };

    Instrument.prototype.stop = function() {
      angular.forEach( this.voices, function( voice ) {
        voice.stop();
      });
      return this;
    };

    Instrument.prototype.voice = function( options ) {
      this.voices.push( new Voice( options ) );
      return this;
    };

    Instrument.prototype.vol = function( percent ) {
      angular.forEach( this.voices, function( voice ) {
        voice.vol( percent );
      });
    };

    Instrument.prototype.then = function() {
      for ( var i = 0, l = this.voices.length; i < l; i++ ) {
        this.voices[i].then.apply( this.voices[i], arguments );
      }
      return this;
    };

    return Instrument;
  }]);
