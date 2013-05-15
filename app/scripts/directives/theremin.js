'use strict';

angular.module( 'toneScratcherApp' )
  .directive( 'theremin', function() {
    return {
      template: '<div class="theremin" ng-mousemove=update($event) ng-mouseenter="start($event)" ng-mouseleave="stop()" ng-transclude></div>',
      restrict: 'E',
      transclude: true,
      link: function postLink( scope, element, attrs ) {
        var audioContext = new webkitAudioContext(),
            gain = audioContext.createGainNode(),
            oscillator = audioContext.createOscillator();

        var scaleFactor = 1 / 0.6;

        gain.connect( audioContext.destination );
        gain.gain.value = 0;

        oscillator.type = 0;
        oscillator.frequency.value = scaleFactor * ( event.pageX - element[0].offsetLeft );
        oscillator.connect( gain );
        oscillator.start(0);

        scope.frequency = oscillator.frequency;

        scope.start = function( event ) {
          gain.gain.value = 0.025;
        };

        scope.stop = function() {
          gain.gain.value = 0;
        };

        scope.update = function( event ) {
          oscillator.frequency.value = scaleFactor * ( event.pageX - element[0].offsetLeft );
          console.log( oscillator.frequency.value );
        };
      }
    };
  })
  .directive( 'noteView', function() {
    return {
      restrict: 'C',
      link: function postLink( scope, element, attrs ) {
        var onMouseMove = function( event ) {
          event.stopPropagation();
          scope.frequency.value = parseFloat( attrs.freq, 10 );
          console.log( scope.frequency.value );
        };

        element.bind( 'mouseenter', function( event ) {
          element.bind( 'mousemove', onMouseMove );
        });

        element.bind( 'mouseleave', function( event ) {
          element.unbind( 'mousemove', onMouseMove );
        });
      }
    };
  });
