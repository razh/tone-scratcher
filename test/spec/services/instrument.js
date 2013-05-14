'use strict';

describe('Service: instrument', function () {

  // load the service's module
  beforeEach(module('toneScratcherApp'));

  // instantiate service
  var instrument;
  beforeEach(inject(function(_instrument_) {
    instrument = _instrument_;
  }));

  it('should do something', function () {
    expect(!!instrument).toBe(true);
  });

});
