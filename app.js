/* jslint node: true */
"use strict";

var express = require('express')
  , http = require('http')
  , path = require('path');

var app = express();

app.configure(function(){
  //TODO: fallback to a file not checked in
  app.set('facebook app id', process.env.FACEBOOK_APP_ID);
  app.set('facebook app secret', process.env.FACEBOOK_APP_SECRET);

  app.set('twitter consumer key', process.env.TWITTER_CONSUMER_KEY);
  app.set('twitter consumer secret', process.env.TWITTER_CONSUMER_SECRET);

  app.set('linkedin app id', process.env.LINKEDIN_APP_ID);
  app.set('linkedin app secret', process.env.LINKEDIN_APP_SECRET);

  app.set('database url', process.env.DATABASE_URL);
  app.set('root url', 'https://one-feed.herokuapp.com');
});

app.configure('development', function(){
  app.set('database url', process.env.DATABASE_URL || {
    database : "one_feed",
    protocol : "sqlite",
    query    : {
      debug    : true
    }
  });

  app.set('root url', 'http://localhost:3000');
});

var passport = require('./lib/passport').init(app);
var orm = require('./lib/orm')(app);

// all environments
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(orm);
  app.use(express.cookieParser('your secret here'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.session());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
  app.set('view engine', 'jade');
  app.use(require('less-middleware')({ src: __dirname + '/public' }));
  app.use(express.static(path.join(__dirname, 'public')));
});

// development only
app.configure('development', function(){
  app.use(express.errorHandler());
});

//Must setup the routes after the middleware
require('./routes')(app);

//Starts the server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
