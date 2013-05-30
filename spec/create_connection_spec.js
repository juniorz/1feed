/* jslint node: true */
"use strict";

var Q = require('q'),
    _ = require('underscore'),
    helpers = require('./support/spec_helper');

var models = {};
helpers.connectDb(models);

describe("Create connection promise", function() {
  var asyncPromises, findOrCreateConnection;

  it('creates the connection on first login', function(){
    var promise = {}, opts;
    waitsFor(helpers.isDbStarted);

    runs(function(){
      asyncPromises = require('../lib/find_or_create_connection')(models);
      findOrCreateConnection = asyncPromises.findOrCreateConnection;
    });

    runs(function(){
      opts = {
        provider:     'foo',
        provider_uid: '123',
        token:        'ABCDEFGHIJK'
      };

      promise = findOrCreateConnection(opts);
    });

    waitsFor(function(){
      return !promise.isPending();
    });

    runs(function(){
      Q.nsend(models.Connection, 'find', opts)
      .then(function (results) {
        var conn = results[0];
        expect(conn.provider).toBe(opts.provider);
        expect(conn.provider_uid).toBe(opts.provider_uid);
        expect(conn.token).toBe(opts.token);

        //TODO: Check the user?
      })
      .done();
    });
  });


  it('retrieves the existing connection on subsequent logins and updates the token', function(){
    var promise = {}, existingConnection, opts, done = false;
    waitsFor(helpers.isDbStarted);

    opts = {
      provider:     'foo',
      provider_uid: '123',
      token:        'HGFEDCBA'
    };

    runs(function(){
      asyncPromises = require('../lib/find_or_create_connection')(models);
      findOrCreateConnection = asyncPromises.findOrCreateConnection;
    });

    //Existing connection
    runs(function(){
      Q.nsend(models.Connection, 'create', [opts])
      .then(function (results) {
        var conn = results[0];
        existingConnection = conn;

        return Q.nsend(models.Connection, 'count')
        .then(function (count) {
          expect(count).toBe(1);
        });
        //.done();
      })
      .done();
    });

    runs(function(){
      var newOpts = _.extend(_.omit(opts, 'token'), {token: 'ABCDEFGH'});
      promise = findOrCreateConnection(newOpts);
    });

    //helpers.waitsForPromise(promise)();
    waitsFor(function(){
      return !promise.isPending();
    });

    runs(function(){
      var counting = Q.nsend(models.Connection, 'count')
      .then(function (count) {
        expect(count).toBe(1);
      });

      var getting = Q.nsend(models.Connection, 'get', existingConnection.id)
      .then(function (conn) {
        expect(conn.token).toBe('ABCDEFGH');
        done = true;
      });

      counting.then(function(){
        return getting;
      })
      .done();
    });

    waitsFor(function(){
      return done;
    });
  });

});
