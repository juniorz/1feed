/* jslint node: true */
"use strict";
var Q = require('q');

exports.index = function(req, res){

  function render(users){
    res.render('index', {
      users: (req.user && [req.user]) || []
    });
  }

  // Uncomment to see something bad happening
  // Q.nfcall(req.models.user.find, {foo: "bar"})
  Q.nfcall(req.models.user.find)
  .then(render)
  .fail(function(error){
    //This is a clever way to define fallback
    console.log('! Noooooooo.' + error);
    render();
  })
  .done();
};

};