'use strict';

angular.module( 'toneScratcherApp' )
  .controller( 'MainCtrl', [ '$scope', function( $scope ) {
    $scope.config = {
      position: 0,
      max: 0,
      playing: true,
      running: true,
      focused: true
    };

    $scope.pause = function() {
      $scope.config.playing = false;
    };

    $scope.play = function() {
      $scope.config.playing = true;
    };

    window.addEventListener( 'keydown', function( event ) {
      // ESC.
      if ( event.which === 27 ) {
        $scope.config.running = false;
      }
    });

    window.addEventListener( 'focus', function() {
      $scope.config.focused = true;
    });

    window.addEventListener( 'blur', function() {
      $scope.config.focused = false;
    });
  }]);
