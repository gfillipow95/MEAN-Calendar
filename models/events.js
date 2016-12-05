var express = require('express');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
   title:  String,
   date: Date,
   stime: String,
   etime: String
});

var eventModel = mongoose.model('event', eventSchema);

function hasConflicts(){
   let start = this.stime;
   let end = this.etime;

   return new Promise(function(resolve, reject){
      eventModel.find({$or:
         [
            {$and: [{stime:{$gte: start}}, {stime:{$lte: end}}]},
            {$and: [{etime:{$gte:start}}, {etime:{$lte: end}}]}
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
