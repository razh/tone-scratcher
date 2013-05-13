'use strict';

describe( 'Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach( module( 'toneScratcherApp' ) );

  var MainCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach( inject( function( $controller, $rootScope ) {
    scope = $rootScope.$new();
    MainCtrl = $controller( 'MainCtrl', {
      $scope: scope
    });
  }));

  it( 'should calculate the correct number of halfsteps from A4', function () {
    expect( scope.halfStepsFromA4( 'A4' ) ).toBe( 0 );

    expect( scope.halfStepsFromA4( 'C3' ) ).toBe( -21 );
    expect( scope.halfStepsFromA4( 'C#3' ) ).toBe( -20 );

    expect( scope.halfStepsFromA4( 'B3' ) ).toBe( -10 );
    expect( scope.halfStepsFromA4( 'C4' ) ).toBe( -9 );

    expect( scope.halfStepsFromA4( 'C5' ) ).toBe( 3 );
    expect( scope.halfStepsFromA4( 'D5' ) ).toBe( 5 );
    expect( scope.halfStepsFromA4( 'E5' ) ).toBe( 7 );

    expect( scope.halfStepsFromA4( 'C6' ) ).toBe( 15 );
  });
});
