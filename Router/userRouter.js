// dependency ------------------------------------
// express
const express = require("express");
const userModel = require("../model/userModel");
const { createElement, getElement, getElements, updateElement, deleteElement } = require("../helpers/factory");
const { protectRoute, bodyChecker, isAuthorized } = require("./utilFns");

// router ---------------------------------------
const userRouter = express.Router();

// functions ----------------------------------------------
const createUser = createElement(userModel);
const deleteUser = deleteElement(userModel);
const updateUser = updateElement(userModel);
const getUser = getElement(userModel);
const getUsers = getElements(userModel);


// routes -----------------------------------------
userRouter.use(protectRoute);

// let authCheckerCE = isAuthorized(["admin", "ce"]);
// let authChecker = isAuthorized(["admin"]);

console.log(1);

userRouter
  .route("/")
  // localhost/user -> post
  .post(bodyChecker, isAuthorized(["admin"]), createUser)
  // localhost/user -> get
  // "ce" -> customer executive
  .get(protectRoute, isAuthorized(["admin", "ce"]), getUsers);

console.log(2);  

userRouter
  .route("/:id")
  .get(getUser)
  // ce -> customer executive
  .patch(bodyChecker, isAuthorized(["admin", "ce"]), updateUser) // post
  .delete(bodyChecker, isAuthorized(["admin"]), deleteUser);
  
console.log(3);


// // functions ----------------------------------------
// // moderator, user
// async function getUser(req, res) {
//   let { id } = req.params;
//   try {
//     let users = await userModel.findById(id);
//     console.log(users);
//     res.status(200).json({
//       message: users,
//     });
//   } catch (err) {
//     res.status(502).json({
//       message: err.message,
//     });
//   }
// }

// async function getUsers(req, res) {
//   let id = req.body;
//   try {
//     let users = await userModel.find();
//     res.status(200).json({
//       message: users,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(502).json({
//       message: err.message,
//     });
//   }
// }

// async function updateUser(req, res) {
//   let { id } = req.params;
//   try {
//     if(res.body.password || req.body.confirmPassword) {
//       return res.json({
//         message: "use forget password instead"
//       });
//     }

//     let user = await userModel.findById(id);
//     console.log("userRouter.js -> in update user fn ", user);
//     if (user) {
//       for (let key in req.body) {
//         user[key] = req.body[key];
//       }

//       // save  -> confirmPassword, password
//       await user.save({
//         validateBeforeSave: false // password & confirmPassword naa dena padhra postman se -> iss lia humna yaa use kia hai
//       });

//       res.status(200).json({
//         user: user,
//       });

//     } else {
      
//       res.status(404).json({
//         message: "user not found",
//       });
//     }
//   } catch (err) {
    
//     console.log(err);
//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// }

// // only authorized to admin
// async function createUser(req, res) {
//   try {
//     let user = await userModel.create(req.body);
//     res.status(200).json({
//       user: user,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// }

// async function deleteUser(req, res) {
//   let { id } = req.user;
//   try {
//     let users = await userModel.findByIdAndDelete(id);
    
//     res.status(200).json({
//       user: users,
//     });

//   } catch (err) {
    
//     console.log(err);
//     res.status(500).json({
//       message: "Server error",
//     });
//   }
// }

module.exports = userRouter;
