/* jslint node: true */
"use strict";

// Reference:
// http://passportjs.org/guide/configure/
// http://passportjs.org/guide/facebook/
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy
  , LinkedInStrategy = require('passport-linkedin').Strategy;

var Q = require('q'),
    _ = require('underscore');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});


function initFacebookStrategy(app){
  var opts, facebookStrategy;

  try {
    opts = {
      clientID:     app.get('facebook app id'),
      clientSecret: app.get('facebook app secret'),
      callbackURL:  app.get('root url') + "/auth/facebook/callback"
    };

    facebookStrategy = new FacebookStrategy(
      opts, function(accessToken, refreshToken, profile, done
    ) {
      //console.log('accessToken %j, refreshToken  %j, profile %j',
      //  accessToken, refreshToken, profile
      //);

      var Connection = app.get('models').connection,
          User = app.get('models').user,
          connectionParams = {
            provider: profile.provider, provider_uid: profile.id
          };

      Q.nfcall(Connection.find, connectionParams, 1)
      .then(function(connections){
        if(connections.length > 0){
          return _.first(connections);
        }

        var createConnection = Q.nfcall(Connection.create, [connectionParams])
        .then(_.first)
        .fail(function(error){
          console.log(error.stack);
          throw "Could not create connection";
        });

        return createConnection;
      })
      .then(function(connection){
        return Q.nfcall(connection.getUser)
        .then(function(user){
          if(user == undefined){
            user = Q.nfcall(User.create, [{name: profile.displayName}]).then(_.first);
          }

          return user;
        })
        .fail(function(error){
          console.log(error.trace);
          throw "Could not create user";
        })
      })
      .then(function(user){
        console.log('USER is %j', user);
        done(null, user);
      })
      .fail(done)
      .done();
    });

    passport.use(facebookStrategy);
  }
  catch(e) {
    console.log('! Could not load Facebook authentication: ' + e);
  }
};

function initLinkedInStrategy(app){
  var opts = {
    consumerKey: app.get('linkedin app id'),
    consumerSecret: app.get('linkedin app secret'),
    callbackURL: app.get("root url") + "/auth/linkedin/callback"
  };

  try{
    var linkedInStrategy = new LinkedInStrategy(opts, function(token, tokenSecret, profile, done){
      console.log("authenticated linkedin", {tokenSecret: tokenSecret, profile : profile});
      done(null, {id: 'foo'});
    });
    passport.use(linkedInStrategy);
  }
  catch(e) {
    console.log('! Could not load LinkedIn authentication: ' + e);
  }
};

function initTwitterStrategy(app){
  var opts = {
    consumerKey:    app.get('twitter consumer key'),
    consumerSecret: app.get('twitter consumer secret'),
    callbackURL:    app.get('root url') + "/auth/twitter/callback"
  };

  try {
    var twitterStrategy = new TwitterStrategy(opts, function(token, tokenSecret, profile, done) {
      console.log('Twitter authenticated', {
        token: token, tokenSecret: tokenSecret, profile: profile
      });

      // If authentication failed
      // return done(err);
      // or
      // If authentication happened
      // done(null, user);
      done(null, {id: 'foo'});
    });

    passport.use(twitterStrategy);
  }
  catch(e) {
    console.log('! Could not load Twitter authentication: ' + e);
  }
};

module.exports = {
  init: function(app){
    passport.deserializeUser(function(id, done) {
      var User = app.get('models').user;

      Q.nfcall(User.get, id)
      .then(function(user){
        console.log('User + %j', user);
        done(null, user);
      })
      .fail(done)
      .done();
    });

    initFacebookStrategy(app);
    initTwitterStrategy(app);
    initLinkedInStrategy(app);

    return passport;
  }
};
