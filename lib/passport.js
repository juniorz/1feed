// Reference:
// http://passportjs.org/guide/configure/
// http://passportjs.org/guide/facebook/
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy
  , TwitterStrategy = require('passport-twitter').Strategy;

passport.serializeUser(function(user, done) {
  // Serializes the user by persisting something into the session
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  // Reconstructs the user based on the what was persisted into the session
  // Like:
  // User.findById(id, function(err, user) {
  //   done(err, user);
  // });
  done(null, {id: id});
});

function initFacebookStrategy(app){
  var opts = {
    clientID:     app.get('facebook app id'),
    clientSecret: app.get('facebook app secret'),
    callbackURL:  app.get('root url') + "/auth/facebook/callback"
  };

  facebookStrategy = new FacebookStrategy(opts, function(accessToken, refreshToken, profile, done) {
    console.log('FB authenticated', {
      accessToken: accessToken, refreshToken: refreshToken, profile: profile
    });

    // If authentication failed
    // return done(err);
    // or
    // If authentication happened
    // done(null, user);
    done(null, {id: 'foo'});
  });

  passport.use(facebookStrategy);
}

function initTwitterStrategy(app){
  var opts = {
    consumerKey:    app.get('twitter consumer key'),
    consumerSecret: app.get('twitter consumer secret'),
    callbackURL:    app.get('root url') + "/auth/twitter/callback"
  };

  twitterStrategy = new TwitterStrategy(opts, function(token, tokenSecret, profile, done) {
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

module.exports = {
  init: function(app){
    initFacebookStrategy(app);
    initTwitterStrategy(app);

    return passport;
  }
};
