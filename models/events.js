var express = require('express');

var Schema = mongoose.Schema;

var eventSchema = new Schema({
   title:  String,
   date: Date,
   stime: String,
   etime: String
});

eventSchema
