var express = require('express');
var bcrypt = require('bcryptjs');
var router = express.Router();
var userModel = require('../models/users.js');

router.get('/', function(req, res, next){
   res.render('register');
});

router.post('/', function(req, res, next){
   var salt = bcrypt.genSaltSync(10);
   var hash = bcrypt.hashSync(req.body.password, salt);
   var newUser = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: hash
   });
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
