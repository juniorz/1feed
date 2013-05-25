var index = require('../controllers/index')
  , user = require('../controllers/user');

var routes = function(app){
  app.get('/', index.index);
  app.get('/users', user.list);
};

module.exports = function(app){
  return routes(app);
};
