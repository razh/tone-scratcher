'use strict';

angular.module( 'toneScratcherApp' )
  .factory( 'voice', [ 'audioContext', function( audioContext ) {

    function Voice( options ) {
      this.MAX_GAIN = options.maxGain || 0.05;
      this.MIN_GAIN = options.minGain || 0;

      this.oscillator = audioContext.createOscillator();
      this.gain = audioContext.createGainNode();

      this.gain.gain.value = this.MIN_GAIN;

      this.oscillator.type = options.type || 0;
      this.oscillator.connect( this.gain );
      this.oscillator.start(0);
    }

    Voice.prototype.connect = function( node ) {
      this.gain.connect( node );
      return this;
    };

    Voice.prototype.start = function() {
      this.gain.gain.value = this.MAX_GAIN;
      return this;
    };

    Voice.prototype.stop = function() {
      this.gain.gain.value = this.MIN_GAIN;
      return this;
    };

    Voice.prototype.setFrequency = function( freq ) {
      this.oscillator.frequency.value = freq;
      return this;
    };

    Voice.prototype.then = function() {
      var args = Array.prototype.slice.call( arguments ),
          callback = args.slice( 0, 1 )[0];

      args.push( this );
      callback.apply( this, args ).start();

      return this;
    };

    return Voice;
  }]);
