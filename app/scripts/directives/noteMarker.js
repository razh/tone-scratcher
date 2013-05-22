'use strict';

angular.module( 'toneScratcherApp' )
  .directive( 'noteMarker', [ 'SCALE', function( SCALE ) {
    return {
      restrict: 'C',
      link: function postLink( scope, element, attrs ) {
        // Move marker into position.
        element.css( 'left', SCALE * parseFloat( attrs.freq ) + element[0].offsetLeft + 'px' );

        var onMouseMove = function( event ) {
          event.stopPropagation();
          scope.frequency.value = parseFloat( attrs.freq );
          console.log( scope.frequency.value );
        };

        element.bind( 'mouseenter', function() {
          element.bind( 'mousemove', onMouseMove );
        });

        element.bind( 'mouseleave', function() {
          element.unbind( 'mousemove', onMouseMove );
        });
      }
    };
  }]);
