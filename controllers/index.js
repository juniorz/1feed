exports.index = function(req, res){
  req.models.user.find(function(err, users){
    res.render('index', {
      users: users
    });
  });
};