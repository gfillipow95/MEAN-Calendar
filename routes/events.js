var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
  title:  String,
  date: Date,
  stime: String,
  etime: String,
});

var eventModel = mongoose.model('event', eventSchema);

router.get('/', function(req, res, next){
   eventModel.find(function(err, event){
      if(err){
         console.log(err);
         res.send(err);
      }else{
         console.log('all good', event);
         res.json(event);
      }
   });
});

router.post('/', function(req, res, next){
   var newEvent = new eventModel(req.body);

   newEvent.save(function(err, event){
      if(err){
         console.log(err);
         res.send(err);
      }else{
         console.log('all good', event);
         res.json(event);
      }
   });
});

router.delete('/id', function(req, res, next){
   eventModel.findById(req.params.id, function(err, event){
      if(err){
         res.send(err);
      }else{
         
      }
   });
});

router.patch('/id', function(req, res, next){
   res.send("PATCH");
});

module.exports = router;
