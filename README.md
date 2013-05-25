[![Build Status](https://travis-ci.org/juniorz/one-feed.png?branch=master)](https://travis-ci.org/juniorz/one-feed)

# one-feed

1 feed

## Deploying to Heroku

You need to setup Facebook/Twitter settings

    heroku config:set FACEBOOK_APP_ID=... FACEBOOK_APP_SECRET=...
    heroku config:set TWITTER_CONSUMER_KEY=... TWITTER_CONSUMER_SECRET=...

## Running locally

    npm install
    export $(heroku config --shell | sed /PATH/d | sed /NODE_ENV/d)
    npm start

## Testing

    npm test

