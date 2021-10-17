const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

module.exports.protectRoute = function protectRoute(req, res, next) {
  try {
    console.log("reached body checker");

    // cookie-parser
    console.log("93", req.cookies);
    // jwt.verify();

    let decryptedToken = jwt.verify(req.cookies.JWT, JWT_SECRET);
    console.log("97", decryptedToken);
    //jwt -> verify everytime that if you are brining the token to get your response

    // let isallowed = true;
    // isallowed -> true -> user aga jaa sakta hai next middleware fn pai i.e, getUser()
    //  isallowed -> false -> user aga nahi jaa sakta hai next middleware fn pai i.e, getUser()

    if (decryptedToken) {
      next();
    } else {
      res.send("kindly login to access this resource");
    }
  } catch (err) {
    console.log(err);
    res.status(200).json({
      message: err.message,
    });
  }
};

module.exports.bodyChecker = function bodyChecker(req, res, next) {
  console.log("reached body checker");
  let isPresent = Object.keys(req.body).length;
  
  console.log("ispresent", isPresent);
  if (isPresent) {
    next();
  } else {
    res.send("Kind send details in body");
  }
};


module.exports.isAuthorized = function (roles) {
  console.log("I will run when the server is started");
  
  // function call
  return async function(req, res) {
    console.log("inner function");
    console.log("I will run when a call is made");

    let { userId } = req;
    // id -> user get, user role,
    // role -> i will allow the user to user
    // otherwise not 
    try {
      let user = await userModel.findById(userId);
      let userisAuthorized = roles.includes(user.role);
      
      if(userisAuthorized) {
        res.user = user;
        next();
      } else {
        res.status(200).json({
          message: "user not authorized"
        })
      }

    } catch(err) {
      console.log(err);
      res.status(500).json({
        message: "Server error",
      });
    }
  }
}
