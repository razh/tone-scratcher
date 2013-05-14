'use strict';

angular.module( 'toneScratcherApp' )
  .factory( 'instrument', [ function() {
    // Service logic
    // ...

    function Instrument( options ) {
      var portamento = options.portamento || false;
    }

    Instrument.prototype.addNote = function( note ) {

    };

    // Public API here
    return {
      Instrument: Instrument
    };
  }]);
