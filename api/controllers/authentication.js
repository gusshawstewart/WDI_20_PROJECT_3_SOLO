var jwt    = require('jsonwebtoken');
var User   = require('../models/user');
var secret = require('../config/config').secret;

function login(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if(err) return res.send(500).json({ message: err });
    if(!user || !user.validatePassword(req.body.password)) return res.status(401).json({ message: "Unauthorized" });

    var payload = { _id: user._id, username: user.username };
    var token   = jwt.sign(payload, secret, {expiresIn: 60*60*24 });

    return res.status(200).json({ message: "Login successful", user: user , token: token });
  });
}

function register(req, res) {
  User.create(req.body.user, function(err, user) {
    if(err) return res.status(500).json({ message: err });

    return res.status(200).json({ message: "Thank you for registering", user: user });
  });
}

module.exports = {
  login: login,
  register: register
};