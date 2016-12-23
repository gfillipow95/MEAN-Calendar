var userModel = require('./models/users.js');

module.exports.authenticate = function(req, res, next){
   if (req.session && req.session.user) {
     userModel.findOne({ email: req.session.user.email }, function(err, user) {
      if (user) {
         req.user = user;
         delete req.user.password; // delete the password from the session
         req.session.user = user;  //refresh the session value
         res.locals.user = user;
      }
      // finishing processing the middleware and run the route
      next();
     });
   } else {
     next();
   }
};

module.exports.requireLogin = function(req, res, next) {
  if (!req.user) {
    res.redirect('/login');
  } else {
    next();
  }
};
