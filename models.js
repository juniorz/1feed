/* jslint node: true */
"use strict";

module.exports = function(db){
  var models = {};

  models.User = db.define("user", {
    name: String,
    email: String
  });

  models.Connection = db.define("connection", {
    provider: String,
    provider_uid: String,
    token: String
  });

  // This causes
  // { [Error: SQLITE_ERROR: no such table: main.connection] errno: 1, code: 'SQLITE_ERROR' }
  // Should do it after Connection.sync()
  models.Connection.hasOne("user", models.User, {
    reverse: "connections"
  });

  return models;
};
