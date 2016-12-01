var express = require('express');
var router = express.Router();
var moment = require('moment');

router.get('/', function(req, res, next) {
   var currDate = moment();
   if(req.query.date){
      currDate = moment(req.query.date);
   }
   res.render('monthly', {
      title: currDate.format(),
      calendarHeader: currDate.format("MMMM YYYY"),
      currentDate: currDate.toISOString()
   });
});

router.get('/weekly', function(req, res, next){
   var currDate = moment();
   if(req.query.date){
      currDate = moment(req.query.date);
   }
   res.render('weekly', {
      title: currDate.format()
   })
})



module.exports = router;
