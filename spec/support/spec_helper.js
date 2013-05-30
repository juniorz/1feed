/* jslint node: true */
"use strict";

var dbStarted, testDB;

module.exports.connectDb = function(models){
  var Q = require('q'),
      orm = require('orm'),
      _ = require('underscore');

  function cleanDB(){
    dbStarted = false;

    var promises = _.map(testDB.models, function(model){
      return Q.nsend(model, 'drop');
    });

    return Q.all(promises)
    .then(function(){
      //console.log('All models removed');
      return Q.nsend(testDB, 'close')
      .then(function(){
        //console.log('DB closed');
      });
    });
  }

  function createDB(){
    var opts = {
      database: "one_feed",
      protocol: "sqlite",
      query: {
        //debug: true
      }
    };

    return Q.nsend(orm, 'connect', opts)
    .then(function(db){
      testDB = db;
      _.extend(models, require('../../models')(db));
      return Q.nsend(db, 'sync').then(function(){
        //console.log('DB started');
        return dbStarted = true;
      });
    });
  }

  beforeEach(function(){
    //console.log('RUN before');
    if(dbStarted){
      cleanDB()
      .then(function(){
        return createDB();
      })
      .done();
    }
    else {
      createDB().done();
    }
  });

  /*
  afterEach(function(){
    console.log('RUN after');

    dbStarted = false;

    var promises = _.map(testDB.models, function(model){
      return Q.nsend(model, 'drop');
    });

    return Q.all(promises)
    .then(function(){
      console.log('All models removed');
      return Q.nsend(testDB, 'close')
      .then(function(){
        console.log('DB closed');
      });
    });

  });
  */
};

module.exports.isDbStarted = function(){
  return dbStarted;
};

//I DUNNO HOW TO DO IT
module.exports.waitsForPromise = function(promise){
  return (function(){
    /*
    function isPending(){
      debugger;
      return !this.isPending();
    }

    debugger;
    var fn = isPending.bind(p);
    */

    waitsFor(function(){
      return !promise.isPending();
    });
  });
}
