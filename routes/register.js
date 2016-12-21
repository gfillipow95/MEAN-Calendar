var express = require('express');
var router = express.Router();
var userModel = require('../models/users.js');

router.get('/', function(req, res, next){
   res.render('register');
});

router.post('/', function(req, res, next){
   var newUser = new userModel(req.body);
   newUser.save(function(err, user){
      if(err){
         res.send(err);
      }else{
         res.send({redirect: '/calendar'});
      }
   })
});

module.exports = router;
