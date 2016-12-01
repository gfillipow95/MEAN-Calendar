var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
   title:  String,
   date: Date,
   stime: String,
   etime: String
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
         res.json(event);
      }
   })
});

router.delete('/:id', function(req, res, next){
   eventModel.findByIdAndRemove(req.params.id, function(err, event){
      if(err){
         res.send(err);
      }else{
         res.json(event);
      }
   });
});

router.patch('/:id', function(req, res, next){
   eventModel.findById(req.params.id, function(err, event){
      if(err){
         res.send(err);
      }else{
         event.title = req.body.title || event.title;
         event.date = req.body.date || event.date;
         event.stime = req.body.stime || event.stime;
         event.etime = req.body.etime || event.etime;
         event.save(function(err, event){
            if(err){
               res.send(err);
            }else{
               res.json(event);
            }
         })
      }
   })
});

module.exports = router;
