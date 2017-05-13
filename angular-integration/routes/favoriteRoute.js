var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Favorites = require('../models/favorites');
var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.get(function (req, res, next) {
    Favorites.find({}, function (err, favorite) {
        if (err) throw err;
        res.json(favorite);
    });
})

.post( function (req, res, next) {
    var user=Verify.getUser(req.headers['x-access-token']);
    Favorites.findOne({ postedBy: user._id }, function (err, favorite) {
       if(!favorite){           
            Favorites.create({
                dishes:[req.body._id],
                postedBy:user._id
            }, function(err,value){
                if(err){
                        console.log(err);
                }else{
                        console.log("Successfully added");
                        res.json(value);
                }
            });
        }else{           
           Favorites.update({_id: favorite._id}, {$addToSet: {dishes: {$each: [req.body._id]}}}, {upsert:true}, function(err,value){
                if(err){
                        console.log(err);
                }else{
                        console.log("Successfully added");
                        res.json(value);
                }
            });
        }       
    });

    
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
    var user=Verify.getUser(req.headers['x-access-token']);
    Favorites.remove({postedBy:  user._id }, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

favoriteRouter.route('/:favoriteId')
.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function (req, res, next) {
        var user=Verify.getUser(req.headers['x-access-token']);
        Favorites.update({postedBy: user._id}, {$pull: {dishes: {$in: [req.params.favoriteId]}}}, {upsert:true}, function(err,value){
            if(err){
                    console.log(err);
            }else{
                        console.log("Successfully added");
                        res.json(value);
            }
        });
});



module.exports = favoriteRouter;