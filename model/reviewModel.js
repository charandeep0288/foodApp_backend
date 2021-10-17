// linked database
const mongoose = require("mongoose");

const validator = require("email-validator");

let { db_link } = process.env;

// this as promise based fn
mongoose.connect(db_link)
    .then(function(connection) {
        // console.log("connection", connection);
        console.log("db has been connectd");
    }).catch(function(error) {
        console.log("err", error);
    });

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, "Review can't be empty"]
    },
    rating: {
        type: Number,
        min: 1, 
        max: 5,
        required: [true, "Review must contain some rating"]
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    user: {
        // info 
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must belong to a user"],
        ref: "PABUserModel"
    }, 
    plan: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must belong to a plan"],
        ref: "PABPlanModel",
    }
});

const ReviewModel = mongoose.model("reviewModel", reviewSchema);

module.exports = ReviewModel;