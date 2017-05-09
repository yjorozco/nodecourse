// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// Will add the Currency type to the Mongoose Schema types
require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// create a schema
var promotionsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        required: true,
        unique: true
    },
    label: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Currency,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});



// the schema is useless so far
// we need to create a model using it
var Promotions = mongoose.model('Promotions', promotionsSchema);

// make this available to our Node applications
module.exports = Promotions;