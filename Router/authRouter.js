// dependencies -------------------------------------------
// express
const express = require("express");
const jwt = require("jsonwebtoken");
// const { JWT_SECRET } = require("../secrets");
const { JWT_SECRET } = process.env;
const userModel = require("../model/userModel");
const { bodyChecker } = require("./utilFns");
const emailSender = require("../helpers/emailSender");

// router ----------------------------------------------
const authRouter = express.Router();

// routes ---------------------------------------
authRouter.use(bodyChecker);

authRouter.route("/signup").post(signupUser);

authRouter.route("/login").post(loginUser);

authRouter.route("/forgetPassword").post(forgetPassword);

authRouter.route("/resetPassword").post(resetPassword);

// routes -> functions ----------------------------------------
async function signupUser(req, res) {
  try {
    let newUser = await userModel.create(req.body);

    res.status(201).json({
      message: "user created sucessfully",
      user: newUser,
    });
  } catch (err) {
    console.log("signup User error: ", err);
    res.status(500).json({
      message: err.message,
    });
  }
}

async function loginUser(req, res) {
  // JWT
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      // password
      if (user.password == password) {
        let token = jwt.sign({ id: user["_id"] }, JWT_SECRET);

        res.cookie("JWT", token);

        res.status(200).json({
          data: user,
          message: "user logged In",
        });
      } else {
        res.status(404).json({
          message: "email or password incorrect",
        });
      }
      //jwt
      // response
    } else {
      res.status(404).json({
        message: "user not found with creds",
      });
    }
  } catch (err) {
    console.log("login User error: ", err);
    res.status(500).json({
      message: err.message,
    });
  }
}

// forget password
async function forgetPassword(req, res) {
  try {
    let { email } = req.body;
    // search on the basis of email
    let user = await userModel.findOne({ email });
    console.log("user", user);
    if (user) {
      let token = (Math.floor(Math.random() * 10000) + 10000)
        .toString()
        .substring(1);
        console.log("res",token);
      await userModel.updateOne({ email }, { token });
      // console.log("updateQuery", updateQuery);
      let newUser = await userModel.findOne({ email });
      console.log("new User", newUser);
      // email send
      await emailSender(token, user.email);

      res.status(200).json({
        message: "user token send to your email",
        user: newUser,
        token,
      });

    } else {

      res.status(404).json({
        message: err.message,
      });
    }

    res.status(200).send("hi")
  } catch (err) {

    console.log("forget User error: ", err);
    res.status(500).json({
      message: err.message,
    });
  }
}

// reset password
async function resetPassword(req, res) {
  // token, confirmPassword, password
  // when 10 lakh users come then -> this code will not work
  try {
    let { token, confirmPassword, password} = req.body;
    let user = await userModel.findOne({ token });
    if(user) { 
      // yaa part of code chal nahi raha tha -> updateOne() fn vala part
      // await userModel.updateOne({token}, {
      //   token: undefined,
      //   password: password,
      //   confirmPassword: confirmPassword,
      // }, {runValidators: true});

      // user.password = password;
      // user.cofirmPassword = confirmPassword;
      // user.token = undefined;

      // alternate of above code
      user.resetHandler(password, confirmPassword);
      // database entry
      await user.save(); // userModel puri file run hogi iss line saa 

      let newUser = await userModel.findOne({ email: user.email });

      res.status(200).json({
        message: "user token send to your email",
        user: newUser,
        token
      })
    } else {
      res.status(404).json({
        message: "user with this token not found",
      });
    }

  } catch(err) {
    console.log("forget User error: ", err);
    res.status(500).json({
      message: err.message,
    });
  }
}

// ---------------------------------
// function tempLoginUser(req, res) {
//   let { email, password } = req.body;
//   let obj = content.find((obj) => {
//     return obj.email == email;
//   });

//   if (!obj) {
//     return res.status(404).json({
//       message: "User not found",
//     });
//   }
//   if (obj.password == password) {
//     let token = jwt.sign({ email: obj.email }, JWT_SECRET);
//     console.log(token);
//     //header
//     res.cookie("JWT", token);

//     // sign with RSA SHA256
//     // res body
//     res.status(200).json({
//       message: "user logged In",
//     });
//   } else {
//     res.status(422).json({
//       message: "password dosen't match",
//     });
//   }
// }

module.exports = authRouter;
