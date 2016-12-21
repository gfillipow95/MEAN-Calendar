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
         if(err.code === 11000){
            res.render('register', {error: "Sorry, the email is already in use."})
         }else{
            res.send(err);
         }
      }else{
         res.redirect('/calendar');
      }
   })
});

module.exports = router;
