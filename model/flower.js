const debug = require("debug")("mongo:model-flower");
const mongo = require("mongoose");
module.exports = db => {
let schema = new mongo.Schema({
    flower: String,
    color: String,
    picture: String,
    cost: Number,
    created_at: Date,
    updated_at: Date
}, { autoIndex: false });


schema.statics.CREATE = async function(flower) {
    return this.create({
        flower: flower[0],
        color: flower[0],
        picture: flower[0],
        cost: flower[2],
    });
}

// on every save, add the date
schema.pre('save', function(next) {
	this.picture = "images/" + this.picture;
    // get the current date
    let currentDate = new Date();
    // change the updated_at field to current date
    this.updated_at = currentDate;
    // if created_at doesn't exist, add to that field
    if (!this.created_at)
        this.created_at = currentDate;
    next();
});


schema.statics.REQUEST = async function() {
    // no arguments - bring all at once
    const args = Array.from(arguments);
    if (arguments.length === 0) {
        debug("request: no arguments - bring all at once")
        return this.find({}).exec();
    }
    // perhaps last argument is a callback for every document
    let callback = arguments[arguments.length - 1];
    if (callback instanceof Function) {
        let asynch = callback.constructor.name === 'AsyncFunction';
        args.pop();
        let cursor, user;
        try {
            cursor = await this.find(...args).cursor();
        } catch (err) { throw err; }
        try {
            while (null !== (user = await cursor.next())) {
                if (asynch) {
                    try {
                        await callback(user);
                    } catch (err) { throw err; }
                }
                else {
                    callback(user);
                }
        }
		}		catch (err) { throw err; }
        return;
    }
    // request by id as a hexadecimal string
    if (args.length === 1 && typeof args === "string") {
        debug("request: by ID");
        return this.findById(args[0]).exec();
    }
    // There is no callback - bring requested at once
    debug(`request: without callback: ${JSON.stringify(args)}`);
    return this.find(...args).exec();
}

schema.statics.DELETE = async function(name) { return this.remove({ name : name }).exec(); };







db.model('Flower', schema); // if model name === collection name
debug("Flower model created");

}

