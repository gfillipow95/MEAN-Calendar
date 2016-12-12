var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
   title:  String,
   date: Date,
   stime: Date,
   etime: Date,
   color: String
});

eventSchema.methods.hasConflicts = function(){
   let dateCheck = this.date;
   let start = this.stime;
   let end = this.etime;
   let eId = this._id;
   return new Promise(function(resolve, reject){
      eventModel.find({$or:
         [
            {$and: [{stime:{$lte: start}}, {etime:{$gte: start}}, {_id:{$ne: eId}}]},
            {$and: [{stime:{$lte: end}}, {etime:{$gte: end}}, {_id:{$ne: eId}}]}
         ]
      }, function(err, events){
         if(err){
            console.log(err);
         }else{
            if(events.length > 0){
               resolve(events);
            }else{
               reject();
            }
         }
      });
   });
}

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
   newEvent.hasConflicts()
   .then(function(events){
      res.status(500).send(events);
   }).catch(function(){
      newEvent.save(function(err, event){
         if(err){
            console.log(err);
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
