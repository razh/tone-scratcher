'use strict';

angular.module( 'toneScratcherApp' )
  .directive( 'theremin', [ 'audioContext', 'consts', function( audioContext, consts ) {
    return {
      template: '<div class="theremin" ng-mousemove=update($event) ng-mouseenter="start()" ng-mouseleave="stop()" ng-transclude></div>',
      restrict: 'E',
      transclude: true,
      link: function postLink( scope, element, attrs ) {
        var invScale = 1 / consts.scale;

        var gain = audioContext.createGainNode(),
            oscillator = audioContext.createOscillator();

        var tuna = new Tuna( audioContext );

        var convolver = new tuna.Convolver({
          highCut: 22050, // 20 to 22050
          lowCut: 20, // 20 to 22050
          dryLevel: 1, // 0 to 1+
          wetLevel: 1, // 0 to 1+
          level: 1, // 0 to 1+, adjusts total output of both wet and dry
          impulse: 'scripts/lib/tuna/impulses/impulse_rev.wav', // the path to your impulse response
          bypass: 0
        });

        convolver.connect( audioContext.destination );
        gain.connect( convolver.input );
        gain.gain.value = 0;

        oscillator.type = 0;
        oscillator.connect( gain );
        oscillator.start(0);

        scope.frequency = oscillator.frequency;

        scope.start = function() {
          gain.gain.value = 0.025;
        };

        scope.stop = function() {
          gain.gain.value = 0;
        };

        scope.update = function( event ) {
          oscillator.frequency.value = invScale * ( event.pageX || 0 - element[0].offsetLeft || 0 ) - 100;
          console.log( oscillator.frequency.value );
        };
      }
    };
  }]);
