/* jslint node: true */
"use strict";

var Q = require('q'),
    _ = require('underscore');

module.exports = function(models){
  return {
    findOrCreateConnection: function findOrCreateConnection(opts){
      var Connection = models.Connection,
          //User = models.User,
          findOpts = _.pick(opts, 'provider', 'provider_uid');

      var updateConnection = function(conn, opts){
        return Q.nsend(conn, 'save', _.pick(opts, 'token')).thenResolve(conn);
      };

      var createConnection = function(opts){
        var promise = Q.nsend(Connection, 'create', [opts])
        .then(_.first)
        .fail(function(error){
          console.log(error.stack);
          throw "Could not create connection";
        });

        return promise;
      };

      var promise = Q.nsend(Connection, 'find', findOpts, 1)
      .then(function(connections){
        return connections.length > 0 ?
          updateConnection(connections[0], opts) : createConnection(opts);
      });

      return promise;
    }
  };
};
