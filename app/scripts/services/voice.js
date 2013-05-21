'use strict';

angular.module( 'toneScratcherApp' )
  .factory( 'voice', [ 'audioContext', function( audioContext ) {

    function Voice( options ) {
      this.MAX_GAIN = 0.05;
      this.MIN_GAIN = 0;

      this.gain = audioContext.createGainNode();
      this.oscillator = audioContext.createOscillator();

      if ( options ) {
        this.MAX_GAIN = options.maxGain || this.MAX_GAIN;
        this.MIN_GAIN = options.minGain || this.MIN_GAIN;
        this.oscillator.type = options.type || 0;
      }

      this.gain.gain.value = this.MIN_GAIN;

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

    Voice.prototype.freq = function( freq ) {
      this.oscillator.frequency.value = freq;
      return this;
    };

    Voice.prototype.vol = function( percent ) {
      this.gain = percent * this.MAX_GAIN + ( 1 - percent ) * this.MIN_GAIN;
      return this;
    };

    Voice.prototype.then = function() {
      var args = Array.prototype.slice.call( arguments ),
          callback = args.splice( 0, 1 )[0];

      args.push( this );
      return callback.apply( this, args ).start();
    };

    return Voice;
  }]);
