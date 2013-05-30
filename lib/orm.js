/* jslint node: true */
"use strict";

var orm = require('orm'),
    _ = require('underscore');

var init = function(app){
  var middleware = orm.express(app.get('database url'), {
    define: function(db, models) {
      _.extend(models, require('../models')(db));
      db.sync();
      app.set('models', models);
    }
  });

  // express middleware is a function
  // function(err, req, res, next)
  return middleware;
};

module.exports = init;
