var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var LeaderShips = require('../models/leaderships');

var leaderShipRouter = express.Router();
leaderShipRouter.use(bodyParser.json());

leaderShipRouter.route('/')
.get(function (req, res, next) {
    LeaderShips.find({}, function (err, leaderShip) {
        if (err) throw err;
        res.json(leaderShip);
    });
})

.post(function (req, res, next) {
    LeaderShips.create(req.body, function (err, leaderShip) {
        if (err) throw err;
        console.log('leaderShip created!');
        var id = leaderShip._id;

        res.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        res.end('Added the leaderShip with id: ' + id);
    });
})

.delete(function (req, res, next) {
    LeaderShips.remove({}, function (err, resp) {
        if (err) throw err;
        res.json(resp);
    });
});

leaderShipRouter.route('/:leaderShipId')
.get(function (req, res, next) {
    LeaderShips.findById(req.params.leaderShipId, function (err, leaderShip) {
        if (err) throw err;
        res.json(leaderShip);
    });
})

.put(function (req, res, next) {
    LeaderShips.findByIdAndUpdate(req.params.leaderShipId, {
        $set: req.body
    }, {
        new: true
    }, function (err, leaderShip) {
        if (err) throw err;
        res.json(leaderShip);
    });
})

.delete(function (req, res, next) {
    LeaderShips.findByIdAndRemove(req.params.leaderShipId, function (err, resp) {        if (err) throw err;
        res.json(resp);
    });
});

leaderShipRouter.route('/:leaderShipId/comments')
.get(function (req, res, next) {
    LeaderShips.findById(req.params.leaderShipId, function (err, leaderShip) {
        if (err) throw err;
        res.json(leaderShip.comments);
    });
})

.post(function (req, res, next) {
    LeaderShips.findById(req.params.leaderShipId, function (err, leaderShip) {
        if (err) throw err;
        leaderShip.comments.push(req.body);
        leaderShip.save(function (err, leaderShip) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(leaderShip);
        });
    });
})

.delete(function (req, res, next) {
    LeaderShips.findById(req.params.leaderShipId, function (err, leaderShip) {
        if (err) throw err;
        for (var i = (leaderShip.comments.length - 1); i >= 0; i--) {
            leaderShip.comments.id(leaderShip.comments[i]._id).remove();
        }
        leaderShip.save(function (err, result) {
            if (err) throw err;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Deleted all comments!');
        });
    });
});

leaderShipRouter.route('/:leaderShipId/comments/:commentId')
.get(function (req, res, next) {
    LeaderShips.findById(req.params.leaderShipId, function (err, leaderShip) {
        if (err) throw err;
        res.json(leaderShip.comments.id(req.params.commentId));
    });
})

.put(function (req, res, next) {
    // We delete the existing commment and insert the updated
    // comment as a new comment
    LeaderShips.findById(req.params.leaderShipId, function (err, leaderShip) {
        if (err) throw err;
        leaderShip.comments.id(req.params.commentId).remove();
        leaderShip.comments.push(req.body);
        leaderShip.save(function (err, leaderShip) {
            if (err) throw err;
            console.log('Updated Comments!');
            res.json(leaderShip);
        });
    });
})

.delete(function (req, res, next) {
    LeaderShips.findById(req.params.leaderShipId, function (err, leaderShip) {
        leaderShip.comments.id(req.params.commentId).remove();
        leaderShip.save(function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
});

module.exports = leaderShipRouter;
