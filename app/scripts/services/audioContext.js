'use strict';

angular.module('toneScratcherApp')
  .factory('audioContext', function () {
      return new webkitAudioContext();
  });
