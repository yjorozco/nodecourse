var User = require('../models/user');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config.js');

exports.getToken = function (user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};

exports.verifyOrdinaryUser = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }

};

exports.verifyAdmin = function (req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                User.findOne({username: req.decoded.username}, function(err, user) {
                    if (err) {
                        return next(err);
                    } else {

                        if(user.admin)                         
                             next();
                         else{
                            var err = new Error('forbidden');
                            err.status = 403;
                            return next(err);
                         }
                    }
                });              
            }
        });
    } else {
        // if there is no token
        // return an error
        var err = new Error('No token provided!');
        err.status = 403;
        return next(err);
    }

};

exports.needsGroup = function(group) {
  return function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];
    jwt.verify(token, config.secretKey, function (err, decoded) {
            if (err) {
                var err = new Error('You are not authenticated!');
                err.status = 401;
                return next(err);
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;                
            }
    });
    User.findOne({username: req.decoded.username}, function(err, user) {
        if (err) {
            return next(err);
        } else {
            if((user.admin&&group==="admin")||(!user.admin&&group==="user"))                         
                 next();
             else{
                var err = new Error('forbidden');
                err.status = 403;
                return next(err);
             }
        }
    });
  };

};

exports.getUser = function(token) {  
    var decoded=jwt.verify(token, config.secretKey);       
    return decoded;       
};

