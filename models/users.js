var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
   name: String,
   email: String,
   password: String
});

module.export = mongoose.model('user', userSchema);
