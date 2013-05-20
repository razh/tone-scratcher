'use strict';

angular.module( 'toneScratcherApp' )
  .factory( 'voice', [ 'audioContext', function( audioContext ) {

    function Voice( options ) {
      this.MAX_GAIN = options.maxGain || 0.05;
      this.MIN_GAIN = options.minGain || 0;

      this.oscillator = audioContext.createOscillator();
      this.gain = audioContext.createGainNode();

      this.gain.gain.value = this.minGain;

      this.oscillator.type = options.type || 0;
      this.oscillator.connect( this.gain );
    }

    Voice.prototype.connect = function( node ) {
      this.gain.connect( node );
      return this;
    };

    Voice.prototype.start = function() {
      this.oscillator.start(0);
      return this;
    };

    Voice.prototype.stop = function() {
      this.gain.gain.value = this.MIN_GAIN;
      return this;
    };

    Voice.prototype.then = function() { return this; };

    return {
      Voice: Voice
    };
  }]);
