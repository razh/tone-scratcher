'use strict';

angular.module( 'toneScratcherApp' )
  .directive( 'scrubber', function() {
    return {
      restrict: 'C',
      link: function postLink( scope, element, attrs ) {
        scope.config.max = element.prop( 'offsetWidth' );

        scope.$watch( attrs.ngMax, function() {
          element.attr( 'max', scope.$eval( attrs.ngMax ) );
        });
      }
    };
  });
