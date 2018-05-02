const debug = require("debug")("mongo:model-cookies");
const mongo = require("mongoose");

module.exports = db => {
let schema = new mongo.Schema({
    uname: String,
    Key: String,
    created_at: Date,
    updated_at: Date
}, { autoIndex: false });

// on every save, add the date
schema.pre('save', function(next) {
    // get the current date
    let currentDate = new Date();
    // change the updated_at field to current date
    this.updated_at = currentDate;
    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});

db.model('Cookies', schema); // if model name === collection name
debug("Cookies model created");

}

