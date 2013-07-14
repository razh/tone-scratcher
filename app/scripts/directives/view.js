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

        var lines = [];

        var prevTime = Date.now(),
            currTime = prevTime;

        // Number of pixels the path shifts down in a second.
        var velocityY = 100,
            // Number of pixels past the bottom before we delete.
            // Here it is set to the number of pixels traveled in half a second.
            paddingY = velocityY;

        // Current mouse position.
        var mouse = null;

        function tick() {
          update();
          draw();
          requestAnimationFrame( tick );
        }

        function update() {
          currTime = Date.now();
          var dt = currTime - prevTime;
          prevTime = currTime;

          if ( dt > 1e2 ) {
            dt = 1e2;
          }

          // Convert from milliseconds to seconds.
          dt *= 1e-3;

          // Create new line and add it to the list.
          if ( mouse ) {
            lines.push([{
              x: lines.length > 0 ? lines[ lines.length - 1 ][1].x : mouse.x,
              y: lines.length > 0 ? lines[ lines.length - 1 ][1].y : mouse.y
            }, {
              x: mouse.x,
              y: mouse.y
            }]);
          }

          var dy = velocityY * dt;
          for ( var i = lines.length - 1; i >= 0; i-- ) {
            lines[i][0].y += dy;

            // Only update the second coordinate if not the last point.
            // Thus, the last point is always at the last mouse position.
            if ( i < lines.length - 1 ) {
              lines[i][1].y += dy;
            }

            if ( lines[i][0].y >= canvas.height + paddingY &&
                 lines[i][1].y >= canvas.height + paddingY ) {
              lines.splice( i, 1 );
            }
          }
        }

        function draw() {
          ctx.clearRect( 0, 0, canvas.width, canvas.height );

          ctx.fillStyle = 'rgba( 0, 0, 90, 0.25 )';
          ctx.fillRect( 0, 0, canvas.width, canvas.height );

          ctx.beginPath();

          var length = lines.length;
          if ( lines[ length - 1 ] ) {
            ctx.moveTo(
              lines[ length - 1 ][0].x,
              lines[ length - 1 ][0].y
            );
          }

          for ( var i = length - 1; i >= 0; i-- ) {
            ctx.lineTo( lines[i][1].x, lines[i][1].y );
          }

          ctx.lineWidth = 9;
          ctx.strokeStyle = 'rgba( 255, 255, 255, 0.5 )';
          ctx.stroke();

          ctx.lineWidth = 6;
          ctx.strokeStyle = 'red';
          ctx.stroke();

          ctx.lineWidth = 3;
          ctx.strokeStyle = 'white';
          ctx.stroke();
        }

        element.bind( 'mousemove', function( event ) {
          mouse = {
            x: event.x,
            y: event.y
          };
        });

        requestAnimationFrame( tick );
      }
    };
  });
