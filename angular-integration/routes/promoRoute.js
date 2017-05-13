var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Verify = require('./verify');
var Promotions = require('../models/promotions');

var promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());

promotionRouter.route('/')
.get(function (req, res, next) {
    Promotions.find({}, function (err, promotion) {
        if (err) throw err;
        res.json(promotion);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Promotions.create(req.body, function (err, promotion) {
        if (err) throw err;
        console.log('promotion created!');
        var id = promotion._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the promotion with id: ' + id);
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Promotions.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

promotionRouter.route('/:promotionId')
.get(Verify.verifyOrdinaryUser,  Verify.needsGroup("user"), function (req, res, next) {
    Promotions.findById(req.params.promotionId, function (err, promotion) {
        if (err) throw err;
        res.json(promotion);
    });
})

.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    Promotions.findByIdAndUpdate(req.params.promotionId, {
        $set: req.body
    }, {
        new: true
    }, function (err, promotion) {
        if (err) throw err;
        res.json(promotion);
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Promotions.findByIdAndRemove(req.params.promotionId, function (err, resp) {        if (err) throw err;
        res.json(resp);
    });
});

promotionRouter.route('/:promotionId/comments')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Promotions.findById(req.params.promotionId, function (err, promotion) {
        if (err) throw err;
        res.json(promotion.comments);
    });
})

.post(Verify.verifyOrdinaryUser, function (req, res, next) {
    Promotions.findById(req.params.promotionId, function (err, promotion) {
        if (err) throw err;
        promotion.comments.push(req.body);
        promotion.save(function (err, promotion) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(promotion);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Promotions.findById(req.params.promotionId, function (err, promotion) {
        if (err) throw err;
        for (var i = (promotion.comments.length - 1); i >= 0; i--) {
            promotion.comments.id(promotion.comments[i]._id).remove();
        }
        promotion.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});

promotionRouter.route('/:promotionId/comments/:commentId')
.get(Verify.verifyOrdinaryUser, function (req, res, next) {
    Promotions.findById(req.params.promotionId, function (err, promotion) {
        if (err) throw err;
        res.json(promotion.comments.id(req.params.commentId));
    });
})

.put(Verify.verifyOrdinaryUser, function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    Promotions.findById(req.params.promotionId, function (err, promotion) {
        if (err) throw err;
        promotion.comments.id(req.params.commentId).remove();
        promotion.comments.push(req.body);
        promotion.save(function (err, promotion) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(promotion);
        });
    });
})

.delete(Verify.verifyOrdinaryUser, function (req, res, next) {
    Promotions.findById(req.params.promotionId, function (err, promotion) {
        promotion.comments.id(req.params.commentId).remove();
        promotion.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});

module.exports = promotionRouter;
