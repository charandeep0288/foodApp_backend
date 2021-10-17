// dependencies -------------------------------------------
const express = require("express");
const bookingModel = require("../model/bookingModel");
const userModel = require("../model/userModel");
const { protectRoute } = require("./utilFns");
const { getElement, getElements, updateElement } = require("../helpers/factory");
const Razerpay = require("razorpay");
let { KEY_ID, KEY_SECRET } = require("../secrets");
var razorpay = new Razerpay({
    key_id: KEY_ID,
    key_secret: KEY_SECRET,
});

// router -------------------------------------------
const bookingRouter = express.Router();

// functions ------------------------------------------
const updatebooking = updateElement(bookingModel);
const getbooking = getElement(bookingModel);
const getbookings = getElements(bookingModel);

// createBooking
const intinalBooking = async function (req, res) {
    try {
        let booking = await bookingModel.create(req.body);
        let bookingId = booking["_id"];
        let userId = req.body.user;
        let user = await userModel.findById(userId);
        user.bookings.push(bookingId);

        await user.save();

        const payment_capture = 1;
        const amount = 500;
        const currency = "INR";
        const optoins = { 
            amount,
            currency,
            receipt: `rs_${bookingId}`,
            payment_capture,
        };
        const response = await razerpayOrder.create(options);
        console.log(response);

        res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            booking: booking,
            message: "booking created",
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}

// deleteBooking
const deleteBooking = async function(req, res) {
    try {
        let booking = await bookingModel.findByIdDelete(req.body);
        console.log("booking", booking);
        
        let userId = booking.user;
        let user = await userModel.findById(userId);
        let idxOfbooking = user.bookings.indexOf(booking["_id"]);
        
        user.booking.splice(idxOfBooking, 1);
        await user.save();

        res.status(200).json({
            message: "booking deleted",
            booking: booking,
        });
        
    } catch(err) {
        res.status(500).json({
            message: err.message
        });
    }
}

async function verifyPayment(req, res) {
    // JWT
    const secret = KEY_SECRET;

    // console.log(req.body);
    const shasum = crypto.create.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    console.log(digest, req.headers["x-razorpay-signature"]);

    if(digest === req.headers["x-razorpay-signature"]) {
        console.log("request is legit");

        res.status(200).json({
            message: "OK",
        });

    } else {
        res.status(403).json({
            message: "Invalid"
        });
    }
}

// routes ----------------------------------------------------
bookingRouter.route("/verification")
            .post(verifyPayment);

bookingRouter
    .route("/:id")
    .get(getbooking)
    .patch(protectRoute, updatebooking)
    .delete(protectRoute, deleteBooking);

bookingRouter
    .route("/")
    .get(getbooking)
    .post(protectRoute, intinalBooking);

module.exports = bookingRouter;