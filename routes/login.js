var express = require('express');
var router = express.Router();
var userModel = require('../models/users.js');

router.get('/', function(req, res, next){
   res.render('login');
})

router.post('/', function(req, res, next){
   userModel.findOne({email: req.body.email}, function(err, user){
      if(!user){
         res.render('login', {error: "Sorry, you have entered the wrong email"});
      }else{
         if(req.body.password === user.password){
            req.session.user = user;
            res.redirect('/calendar');
         }else{
            res.render('login', {error: "Sorry, you have entered the wrong password"});
         }
      }
   })
})

module.exports = router;
