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

// mongoose -> data -> exact -> data -> that is required to from an entity
// data completness, data validation
// name, email, password, confirmPassword -> min, max, confirmPassword, required, unique

const planSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Kindly pass the name"],
        unique: [true, "plan name should be unique"],
        // errors
        maxlength: [40, "Your plan length is more than 40 characters"],
    },
    duration: {
        type: Number,
        required: [true, "You Need to provide duaration"]
    },
    price: {
        type: Number, 
        required: true,
    },
    discount: {
        type: Number, 
        validate: {
            validator: function () { 
                return this.discount < this.price;
            },
            message: "Discont must be less than actual price",
        }
    },
    planImages: { 
        type: [String],
    }, 
    // reviews, averageRating
    reviews: {
        // array of object id
        type: [mongoose.Schema.ObjectId],
        ref: "reviewModel",
    },
    averageRating: Number,
});

// model 
let planModel = mongoose.model("PABPlanModel", planSchema);

module.exports = planModel;