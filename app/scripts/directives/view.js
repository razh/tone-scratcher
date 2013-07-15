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

        var path  = [],
            paths = [ path ];

        var prevTime = Date.now(),
            currTime = prevTime,
            running  = true;

        // Number of pixels the path shifts down in a second.
        var velocityX = 100,
            // Number of pixels past the bottom before we delete.
            // Here it is set to the number of pixels traveled in half a second.
            paddingX = velocityX;

        // Current mouse position.
        var mouse = null,
            mouseDown = false;

        function tick() {
          if ( !running ) {
            return;
          }

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
          if ( mouse && mouseDown ) {
            var lastIndex = path.length - 1;
            path.push([{
              x: lastIndex >= 0 ? path[ lastIndex ][1].x : mouse.x,
              y: lastIndex >= 0 ? path[ lastIndex ][1].y : mouse.y
            }, {
              x: mouse.x,
              y: mouse.y
            }]);
          }

          var dx = velocityX * dt;
          var i, j;
          for ( i = paths.length - 1; i >= 0; i-- ) {
            for ( j = paths[i].length - 1; j >= 0; j-- ) {
              paths[i][j][0].x -= dx;
              paths[i][j][1].x -= dx;

              if ( paths[i][j][0].x < -paddingX &&
                   paths[i][j][1].x < -paddingX ) {
                paths[i].splice( j, 1 );
              }
            }

            if ( paths[i].length === 0 ) {
              paths.splice( i, 1 );
            }
          }
        }

        function draw() {
          ctx.clearRect( 0, 0, canvas.width, canvas.height );

          ctx.beginPath();

          var starts = [];

          var i, j, il, jl;
          for ( i = 0, il = paths.length; i < il; i++ ) {
            if ( paths[i].length ) {
              starts.push( paths[i][0][0] );
              ctx.moveTo( paths[i][0][0].x, paths[i][0][0].y );
            }

            for ( j = 0, jl = paths[i].length; j < jl; j++ ) {
              ctx.lineTo( paths[i][j][1].x, paths[i][j][1].y );
            }
          }

          ctx.shadowBlur = Math.random() * 15 + 15;
          ctx.shadowColor = 'rgba( 0, 255, 0, 1 )';

          ctx.lineWidth = Math.random() * 4 + 2;
          ctx.strokeStyle = 'rgba( 255, 255, 255, 0.5 )';
          ctx.stroke();

          ctx.lineWidth = 3;
          ctx.strokeStyle = 'white';
          ctx.stroke();

          if ( mouse ) {
            ctx.beginPath();
            ctx.arc( mouse.x, mouse.y, Math.random() * 6 + 8, 0, 2 * Math.PI );
            ctx.fillStyle = 'rgba( 255, 255, 255, 0.25 )';
            ctx.fill();
          }

          ctx.shadowBlur = 0;
        }

        element.bind( 'mousemove', function( event ) {
          mouse = {
            x: event.x,
            y: event.y
          };
        });

        element.bind( 'mousedown', function() {
          mouseDown = true;
          path = [];
          paths.push( path );
        });

        element.bind( 'mouseup', function() {
          mouseDown = false;
        });

        window.addEventListener( 'keydown', function( event ) {
          // ESC.
          if ( event.which === 27 ) {
            running = false;
          }
        });

        requestAnimationFrame( tick );
      }
    };
  });

// Given two line segments: (x0, y0) -> (x1, y1)  and (x2, y2) -> (x3, y3).
// Return the coordinate of the intersection.
function intersectSegments( x0, y0, x1, y1, x2, y2, x3, y3 ) {
  /*
    The parametric equation of a line segment given by (x, y) and (i, j) is:

      x(t) = tx + (1 - t)i;
      y(t) = ty + (1 - t)j;

    Thus, for the two given line segments, the intersection point can be found
    by setting the the two equations equal to each other:

      t * x0 + (1 - t) = ua + (1 - u)c
      t * y0 + (1 - t)j = ub + (1 - u)d

    This becomes:

      tx + i - ti = ua + c - uc
      ty + j - tj = ub + d - ud

      tx - ti = ua - uc + c - i
      t = (u(a - c) + c - i) / (x - i).


   */
  // var dot = ( y3 - y2 ) * ( )
  // if ( det === 0 ) {
  //   return null;
  // }
}
