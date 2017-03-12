var mongoose = require('mongoose'),
    assert = require('assert');

var Leaderships = require('./models/leaderships');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");

    // create a new promotions
    Leaderships.create( {
      name: "Uthapizza2",
      image: "images/uthapizza.png",
      category: "mains",
      label: "Hot",
      price: "$4.99",
      description: "A unique . . .",

}, function (err, leadership) {
        if (err) throw err;
        console.log('leaderships created!');
        console.log(leadership);

        var id = leadership._id;

        // get all the promotions
        setTimeout(function () {
            Leaderships.findByIdAndUpdate(id, {
                    $set: {
                        description: 'Updated Test'
                    }
                }, {
                    new: true
                })
                .exec(function (err, leadership) {
                    if (err) throw err;
                    console.log('Updated Leadership!');
                    console.log(leadership);


                    leadership.save(function (err, leadership) {
                        console.log('Updated Comments!');
                        console.log(leadership);

                        db.collection('leaderships').drop(function () {
                            db.close();
                        });
                    });
                });
        }, 3000);
    });
});