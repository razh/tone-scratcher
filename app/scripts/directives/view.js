'use strict';

/**
 * Main view for displaying
 */
angular.module( 'toneScratcherApp' )
  .directive( 'view', function() {
    return {
      template: '<canvas></canvas>',
      restrict: 'E',
      link: function postLink( scope, element, attrs ) {
        var canvas = element.find( 'canvas' )[0],
            ctx    = canvas.getContext( '2d' );

        canvas.width = element.prop( 'offsetWidth' );
        canvas.height = element.prop( 'offsetHeight' );

        ctx.fillStyle = 'red';
        ctx.fillRect( 0, 0, canvas.width, canvas.height );

        var points = [];

        var i = 0;
        function draw() {
          ctx.clearRect( 0, 0, canvas.width, canvas.height );

          ctx.fillStyle = 'rgba( 0, 0, 90, 0.25 )';
          ctx.fillRect( 0, 0, canvas.width, canvas.height );

          ctx.beginPath();

          for ( var i = points.length - 1; i >= 0; i-- ) {
            ctx.lineTo( points[i].x, points[i].y );
          }

          ctx.strokeStyle = 'blue';
          ctx.stroke();

          i++;
          if ( i > 100 ) { return; }
          window.requestAnimationFrame( draw );
        }

        element.bind( 'mousemove', function( event ) {
          points.push({
            x: event.x,
            y: event.y
          });
        });

        window.requestAnimationFrame( draw );
      }
    };
  });
