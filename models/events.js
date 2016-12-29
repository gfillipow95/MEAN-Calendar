var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventSchema = new Schema({
   title:  String,
   date: Date,
   stime: Date,
   etime: Date,
   color: String,
   userID: Schema.Types.ObjectId
});

eventSchema.methods.hasConflicts = function(){
   let dateCheck = this.date;
   let start = this.stime;
   let end = this.etime;
   let eId = this._id;
   return new Promise(function(resolve, reject){
      mongoose.model('event', eventSchema).find({$or:
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

module.exports = mongoose.model('event', eventSchema);
