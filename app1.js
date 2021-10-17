// npm init -y
// npm i express

const express = require("express");
const fs = require("fs");
const path = require("path");
const cookieParser = require("cookie-parser");
const userRouter = require("./Router/userRouter");
const authRouter = require("./Router/authRouter");
const planRouter = require("./Router/planRouter");
const reviewRouter = require('./Router/reviewRouter');
const bookingRouter = require('./Router/bookingRouter');

// Server // route -> request -> response/file/..
const app = express();

// this line
// post -> '/'
// app.post("/", function(req, res){

//     let body = req.body;
//     console.log("before", req.body);
//     next(); // next middleware fn ko call kar doo
// });

// reserve a folder only from which client can access the files
app.use(express.static("Frontend_folder"));
app.use(express.json());
app.use(cookieParser());



// function -> route path
// frontend -> req -> /
// read data storage
// localhost/user/10 -> post
// let content = JSON.parse(fs.readFileSync("./data.json"));

app.use("/api/user", userRouter);
app.use("/api/plan", planRouter);
app.use("/api/auth", authRouter);
app.use("/api/review", reviewRouter);
app.use("/api/booking", bookingRouter);

// heroku physical -> multiple server run
app.listen(process.env.PORT || 8081, function () {
  console.log("server started");
});

// -------------------------------------------
// 404 page
app.use(function (req, res) {
  let rest_of_the_path = path.join("./Frontend_folder", "404.html");
  console.log("rest_of_the_path", rest_of_the_path);

  res.status(404).sendFile(path.join(__dirname, rest_of_the_path));

  // res.status(404).sendFile(path.join(__dirname, "404.html"));
});


// // --------------------------------------------
// // explained next() concept here
// app.post("/", function (req, res) {
//     let body = req.body;
//     console.log("inside first post ", body);
//     next(); // next middleware fn ko call kar doo
// });

// app.use(function (req, res, next) {
//     console.log("inside app.use ");
//     next();
// });

// app.get("/", function (req, res, next) {
//     let body = req.body;
//     console.log("inside first get ", body);
// });

// app.post("/", function (req, res) {
//     let body = req.body;
//     console.log("inside second post ", body);
//     res.send("tested next");
// });


// --------------------------------------------

// app.put("/", function(req, res){
//     console.log("hello from home page");
//     res.send("<h1>Hello from Backend</h1>");
// });

// app.update("/", function(req, res){
//     console.log("hello from home page");
//     res.send("<h1>Hello from Backend</h1>");
// });

// app.delete("/", function(req, res){
//     console.log("hello from home page");
//     res.send("<h1>Hello from Backend</h1>");
// });

// app.post("/", function(req, res){

//     let body = req.body;
//     console.log("after", req.body);
//     res.status(200).json({
//         message: body
//     });
// });