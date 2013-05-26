orm = require('orm');

var init = function(app){
  var middleware = orm.express(app.get('database url'), {
    define: function(db, models) {
       var User = db.define("user", {
        name: String,
        email: String
      });
      models.user = User;

      var Connection = db.define("connection", {
        provider: String,
        token: String
      });
      models.connection = Connection;

      //User.hasMany("connections", Connection);
      Connection.hasOne("user", User, {
        reverse: "connections"
      });

      db.sync(function(err) {
        !err && console.log("! Models created!");

        //TODO: remove this
        User.create([{
            name: "Teobaldo",
            email: "teobaldo@gmail.com"
          }], function (err, items) {
            !err && console.log('created', items);
        });
      });
    }
  });

  return middleware;
}

module.exports = init;
