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
            // Here it is set to the number of pixels traveled in a second.
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
            // Start off with line at mouse.
            if ( lines.length === 0 ) {
              lines.push([{
                x: mouse.x,
                y: mouse.y
              }, {
                x: mouse.x,
                y: mouse.y
              }]);
            }

            // Start line with last endpoint.
            lines.push([{
              x: lines[ lines.length - 1 ][1].x,
              y: lines[ lines.length - 1 ][1].y
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

          var x0, y0,
              x1, y1,
              x2, y2,
              x3, y3;

          var p0x, p0y,
              p1x, p1y,
              p2x, p2y,
              p3x, p3y;

          // Only loop if three lines.
          for ( var i = length - 1; i >= 2; i -= 3 ) {
            x0 = lines[i][0].x;
            y0 = lines[i][0].y;

            x1 = lines[i][1].x;
            y1 = lines[i][1].y;

            x2 = lines[ i - 1 ][1].x;
            y2 = lines[ i - 1 ][1].y;

            x3 = lines[ i - 2 ][1].x;
            y3 = lines[ i - 2 ][1].y;

            // Calculate control points.
            p0x = x0;
            p0y = y0;

            p1x = ( -5 * x0 + 18 * x1 -  9 * x2 + 2 * x3 ) / 6;
            p1y = ( -5 * y0 + 18 * y1 -  9 * y2 + 2 * y3 ) / 6;

            p2x = (  2 * x0 -  9 * x1 + 18 * x2 - 5 * x3 ) / 6;
            p2y = (  2 * y0 -  9 * y1 + 18 * y2 - 5 * y3 ) / 6;

            p3x = x3;
            p3y = y3;

            ctx.bezierCurveTo( p1x, p1y, p2x, p2y, p3x, p3y );

            // ctx.lineTo( lines[i][1].x, lines[i][1].y );
          }

          ctx.lineWidth = 5;
          ctx.strokeStyle = 'orange';
          ctx.stroke();

          ctx.lineWidth = 3;
          ctx.strokeStyle = 'red';
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
