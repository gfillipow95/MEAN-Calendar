var express = require('express');
var router = express.Router();
var eventModel = require('../models/events.js');

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
         event.title = req.body.title || event.title;
         event.date = req.body.date || event.date;
         event.stime = req.body.stime || event.stime;
         event.etime = req.body.etime || event.etime;
         event.color = req.body.color || event.color;
         event.hasConflicts()
         .then(function(events){
            res.status(500).send("Conflicting Event Times");
         }).catch(function(){
            event.save(function(err, event){
               if(err){
                  res.send(err);
               }else{
                  res.json(event);
               }
            })
         })
      }
   })
});

module.exports = router;
