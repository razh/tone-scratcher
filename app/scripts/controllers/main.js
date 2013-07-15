'use strict';

angular.module( 'toneScratcherApp' )
  .controller( 'MainCtrl', [ '$scope', function( $scope ) {
    $scope.config = {
      position: 0,
      max: 0,
      playing: true
    };

    $scope.pause = function() {
      $scope.config.playing = false;
    };

    $scope.play = function() {
      $scope.config.playing = true;
    };
  }]);
