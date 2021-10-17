// npm i email-validatior mongoose

// linked database
const mongoose = require("mongoose");

const validator = require("email-validator");

// let { db_link } = process.env;
 
let db_link;
// deployed
if(process.env.db_link) {
    db_link = process.env.db_link;
} else {
    // local
    db_link = require("../secrets").db_link;
}

// this as promise based fn
mongoose.connect(db_link)
    .then(function(connection) {
        // console.log("connection", connection);
        console.log("db has been connectd");
    }).catch(function(error) {
        console.log("err", error);
    });


// mongoose -> data coming is -> exactly same -> data that is reqired to from an entity
// mongoose check for -> data completness, data validation

// name, email, password -> min, max, confirmPassword, required, unique
let userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }, 
    email:  {
        type: String,
        required: true,
        // unique -> ka matlab duplicate email se user nahi bana sakta
        unique: true,

        validate: function() {
            // third party validation library
            return validator.validate(this.email);
        }
    }, 
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: 8,
        validate: function() {
            return this.password == this.confirmPassword; // password & confirmPassword same hai tho hi woo valid hai password
        }
    },
    createAt: {
        type: String,
    },
    token: {
        type: String,
    },
    validUpto: Date,
    role: {
        type: String,
        // enum matlab yaa hi values allowed hai bas aur koi allowed nahi hai iska alawa
        enum: ["admin", "ce", "user"],
        default: "user"
    },
    bookings: {
        type: [mongoose.Schema.ObjectId],
        ref: "bookingModel"
    },
});

// hook
userSchema.pre('save', function(next) {
    // do stuff
    this.confirmPassword = undefined; // undefined karna se yaa data same nahi hoga database mai

    // encryt password
    next();
})

// document method 
userSchema.methods.resetHandler = function (password, confirmPassword) {
    this.password = password;
    this.confirmPassword = confirmPassword;
    this.token = undefined;
}

// model
let userModel = mongoose.model("PABUserModel", userSchema);

module.exports = userModel;