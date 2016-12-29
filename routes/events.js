var express = require('express');
var router = express.Router();
var eventModel = require('../models/events.js');

router.get('/', function(req, res, next){
   eventModel.find({userID: req.session.user._id}).find(function(err, event){
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
   var newEvent = new eventModel({
      title: req.body.title,
      date: req.body.date,
      stime: req.body.stime,
      etime: req.body.etime,
      color: req.body.color,
      userID: req.session.user._id
   });
   newEvent.hasConflicts()
   .then(function(events){
      res.status(500).send(events);
   }).catch(function(){
      newEvent.save(function(err, event){
         if(err){
            res.send(err);
         }else{
            res.json(event);
         }
      })
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
         console.log("New Title: ", req.body.title);
         event.title = req.body.title;
         event.date = req.body.date;
         event.stime = req.body.stime;
         event.etime = req.body.etime;
         event.color = req.body.color;
         var update = new eventModel(event);
         update.hasConflicts()
         .then(function(events){
            res.status(500).send("Conflicting Event Times");
         }).catch(function(){
            update.save(function(err, updatedEvent){
               console.log(updatedEvent);
               if(err){
                  res.send(err);
               }else{
                  console.log("Update Title: ", updatedEvent.title);
                  res.json(updatedEvent);
               }
            })
         })
      }
   });
});

module.exports = router;
