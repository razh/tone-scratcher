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

        context.font = '14pt Helvetica';
        context.textBaseline = 'top';

        // Generate Audiolet voices.
        var audiolet = new Audiolet( 44100, 2 );

        var noteHeight = 20,
            noteCount = Math.floor( canvas.height / noteHeight ),
            prevPlaying = [],
            playing = [];

        for ( var i = 0; i < noteCount; i++ ) {
          prevPlaying[i] = false;
          playing[i] = false;
        }

        var attack = 0.01,
            release = 1;

        function MajorPentatonicScale() {
          Scale.call( this, [ 0, 2, 4, 7, 9 ] );
        }

        extend( MajorPentatonicScale, Scale );

        var scale = new MajorPentatonicScale();

        // Some of this is taken from Hakim El Hattab's Radar:
        // https://github.com/hakimel/Radar
        // Which appears to be similar to Audiolet's chords example project.
        function Voice( frequency ) {
          AudioletGroup.call( this, audiolet, 0, 1 );

          this.sine = new Sine( audiolet, frequency );

          this.gain = new Gain( audiolet );
          this.env = new PercussiveEnvelope( audiolet, 1, attack, release,
            // On envelope end, remove this.
            function() {
              this.audiolet.scheduler.addRelative( 0, this.remove.bind( this ) );
            }.bind( this ) );

          this.envMulAdd = new MulAdd( audiolet, 0.3, 0 );

          this.sine.connect( this.gain );
          this.gain.connect( this.outputs[0] );

          this.env.connect( this.envMulAdd );
          this.envMulAdd.connect( this.gain, 0, 1 );
        }

        extend( Voice, AudioletGroup );

        var path  = [],
            paths = [ path ];

        var prevTime = Date.now(),
            currTime = prevTime;

        // Number of pixels the path shifts down in a second.
        var velocityX = 100;

        var position;

        // Points of intersection.
        var points = [];

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

            ctx.fillStyle = 'white';
            ctx.fillText( i, 20, noteHeight * i );
          }
        }

        function drawPaths( ctx ) {
          ctx.save();
          ctx.translate( -position, 0 );

          // Draw paths.
          ctx.beginPath();

          // Save old state.
          var i;
          for ( i = 0; i < noteCount; i++ ) {
            prevPlaying[i] = playing[i];
            playing[i] = false;
          }

          var intersection;
          var il, j, jl;
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
                position, noteCount * noteHeight
              );

              if ( intersection ) {
                var noteIndex = Math.floor( intersection.y / noteHeight );
                if ( 0 > noteIndex || noteIndex >= noteCount ) {
                  continue;
                }

                playing[ noteIndex ] = true;
                if ( !prevPlaying[ noteIndex ] ) {
                  var note = noteCount - noteIndex;
                  var freq = scale.getFrequency( note % 5, 110, Math.floor( note / 5 ) );
                  var voice = new Voice( freq );
                  voice.connect( audiolet.output );
                }

                points.push( intersection );
              }
            }
          }

          ctx.lineWidth = 4;
          ctx.strokeStyle = 'white';
          ctx.stroke();

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

        element.bind( 'mousemove touchmove', function( event ) {
          event.preventDefault();
          mouse = eventPosition( event );
        });

        element.bind( 'mousedown touchstart', function( event ) {
          event.preventDefault();

          mouseDown = true;
          mouse = eventPosition( event );

          path = [];
          paths.push( path );
        });

        element.bind( 'mouseup touchend', function() {
          mouseDown = false;
        });

        // Calculate position from Mouse or TouchEvent.
        function eventPosition( event ) {
          if ( event.targetTouches ) {
            return {
              x: event.targetTouches[0].pageX,
              y: event.targetTouches[0].pageY
            };
          } else {
            return {
              x: event.x,
              y: event.y
            };
          }

          return null;
        }

        requestAnimationFrame( tick );
      }
    };
  });
