/* jslint node: true */
"use strict";

var helpers = require('./support/spec_helper');
var models = {};

describe("Spec Helper", function() {
  helpers.connectDb(models);

  it('should load the models', function(){
    waitsFor(helpers.isDbStarted);

    runs(function(){
      expect(models.User).toBeDefined();
      expect(models.Connection).toBeDefined();
    });
  });
});

