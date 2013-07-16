'use strict';

// Given two line segments: (x0, y0) -> (x1, y1)  and (x2, y2) -> (x3, y3).
// Return the coordinate of the intersection, or null if no intersection.
function intersectSegments( x0, y0, x1, y1, x2, y2, x3, y3 ) {
  // Calculate the determinant: dx0 * dy1  - dx1 * dy0.
  var det = ( x1 - x0 ) * ( y3 - y2 ) - ( x3 - x2 ) * ( y1 - y0 );
  if ( det === 0 ) {
    return null;
  }

  var detInverse = 1 / det;

  // Parameters.
  var s = ( ( x3 - x2 ) * ( y0 - y2 ) - ( y3 - y2 ) * ( x0 - x2 ) ) * detInverse,
      t = ( ( x1 - x0 ) * ( y0 - y2 ) - ( y1 - y0 ) * ( x0 - x2 ) ) * detInverse;

  // If the parameters are exceed the line segment bounds.
  if ( 0 > s || s > 1 ) {
    return null;
  }

  if ( 0 > t || t > 1 ) {
    return null;
  }

  return {
    x: x0 + ( x1 - x0 ) * s,
    y: y0 + ( y1 - y0 ) * s,
  };
}

/**
 * Main view for displaying
 */
angular.module( 'toneScratcherApp' )
  .directive( 'view', function() {
    return {
      template: '<canvas></canvas>',
      restrict: 'E',
      link: function postLink( scope, element, attrs ) {
        var canvas  = element.find( 'canvas' )[0],
            context = canvas.getContext( '2d' );

        canvas.width = element.prop( 'offsetWidth' );
        canvas.height = element.prop( 'offsetHeight' );

        var noteHeight = 20,
            noteCount = Math.floor( canvas.height / noteHeight ),
            playing = [];

        var path  = [],
            paths = [ path ];

        var prevTime = Date.now(),
            currTime = prevTime;

        // Number of pixels the path shifts down in a second.
        var velocityX = 100;

        var position;

        // Current mouse position.
        var mouse = null,
            mouseDown = false;

        function tick() {
          if ( !scope.config.running ) {
            return;
          }

          update();
          draw( context );
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

          position = parseFloat( scope.config.position );

          // Create new line and add it to the list.
          if ( mouse && mouseDown ) {
            var lastIndex = path.length - 1;
            path.push([{
              x: lastIndex >= 0 ? path[ lastIndex ][1].x : mouse.x + position,
              y: lastIndex >= 0 ? path[ lastIndex ][1].y : mouse.y
            }, {
              x: mouse.x + position,
              y: mouse.y
            }]);
          }

          if ( !scope.config.focused || !scope.config.playing ) {
            return;
          }

          position += velocityX * dt;
          scope.config.position = position;
          scope.config.max = Math.max( parseFloat( scope.config.max ), position );
          scope.$apply();
        }

        function drawKeys( ctx ) {
          for ( var i = 0; i < noteCount; i++ ) {
            if ( playing[i] ) {
              ctx.fillStyle = 'green';
            } else {
              ctx.fillStyle = 'rgba(100, 100, 100, 0.5)';
            }

            ctx.fillRect( 0, noteHeight * i, canvas.width, noteHeight );
          }

          playing = [];
        }

        // Points of intersection.
        var points = [];
        function drawPaths( ctx ) {
          ctx.save();
          ctx.translate( -position, 0 );

          // Draw paths.
          ctx.beginPath();

          var intersection;
          var i, j, il, jl;
          var x0, y0, x1, y1;
          for ( i = 0, il = paths.length; i < il; i++ ) {
            for ( j = 0, jl = paths[i].length; j < jl; j++ ) {
              x0 = paths[i][j][0].x;
              y0 = paths[i][j][0].y;
              x1 = paths[i][j][1].x;
              y1 = paths[i][j][1].y;

              // Skip drawing if we can't see it.
              if ( x0 < position && x1 < position ) {
                continue;
              }

              if ( x0 > position + canvas.width && x1 > position + canvas.width ) {
                continue;
              }

              ctx.moveTo( x0, y0 );
              ctx.lineTo( x1, y1 );

              intersection = intersectSegments(
                x0, y0,
                x1, y1,
                position, 0,
                position, canvas.height
              );

              if ( intersection ) {
                playing[ Math.floor( intersection.y / noteHeight ) ] = true;
                points.push( intersection );
              }
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

          ctx.shadowBlur = 0;

          ctx.restore();
        }

        function drawIntersections( ctx ) {
          ctx.save();
          ctx.translate( -position, 0 );

          for ( var i = points.length - 1; i >= 0; i-- ) {
            ctx.beginPath();
            ctx.arc( points[i].x, points[i].y, 10, 0, 2 * Math.PI );
            ctx.fillStyle = 'red';
            ctx.fill();
          }

          ctx.restore();

          // Empty the interseciton points array after drawing is done.
          points = [];
        }

        function drawMouse( ctx ) {
          if ( mouse ) {
            ctx.beginPath();
            ctx.arc( mouse.x, mouse.y, Math.random() * 6 + 8, 0, 2 * Math.PI );
            ctx.fillStyle = 'rgba( 255, 255, 255, 0.25 )';
            ctx.fill();
          }
        }

        function draw( ctx ) {
          ctx.clearRect( 0, 0, canvas.width, canvas.height );

          drawKeys( ctx );
          drawPaths( ctx );
          drawIntersections( ctx );
          drawMouse( ctx );
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

        requestAnimationFrame( tick );
      }
    };
  });
