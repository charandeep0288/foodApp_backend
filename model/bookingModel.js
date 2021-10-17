// linked database
const mongoose = require("mongoose");

const validator = require("email-validator");

let { db_link } = process.env;

// this as promise based fn
mongoose
  .connect(db_link, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(function (connection) {
    // console.log("connection", connection);
    console.log("db has been connectd");
  })
  .catch(function (error) {
    console.log("err", error);
  });

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        required: true,
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        required: true,
    }, 
    bookedAt: {
        type: Date,
    }, 
    priceAtThatTime: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "failed", "sucess"],
        required: true,
        default: "pending"
    },
});

const bookingModel = mongoose.model("bookingModel", bookingSchema);

module.exports = bookingModel;