'use strict';

angular.module( 'toneScratcherApp', [] )
  .constant( 'SCALE', 0.6 )
  .config( [ '$routeProvider', function( $routeProvider ) {
    $routeProvider
      .when( '/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
