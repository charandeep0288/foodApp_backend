// only authorized to admin
function createElement(elementModel) {
  return async function (req, res) {
    try {
      let element = await elementModel.create(req.body);
      res.status(200).json({
        element: element,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server error",
      });
    }
  };
}

function deleteElement(elementModel) {
  return async function (req, res) {
    let { id } = req.user;
    try {
      let element = await elementModel.findByIdAndDelete(id);

      res.status(200).json({
        element: element,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server error",
      });
    }
  };
}

function getElement(elementModel) {
  return async function (req, res) {
    let { id } = req.params;
    try {
      let elements = await elementModel.findById(id);
      console.log(users);
      res.status(200).json({
        message: elements,
      });
    } catch (err) {
      res.status(502).json({
        message: err.message,
      });
    }
  };
}

function getElements(elementModel) {
  return async function (req, res) {
    try {
      // let elements = await elementModel.find();
      let requestPromise;
      // query
      if(res.query.myQuery) {
        requestPromise = elementMode.find(req.query.myQuery);
      } else {
        requestpromisr = elementModel.find();
      }

      // sort
      if(req.query.select) {
        requestPromise = requestPromise.sort(req.query.sort);
      }

      // select 
      if(req.query.select) {
        let params = req.query.select.split("%").join(" ");
        requestPromise = requestPromise.select(params);
      }

      // paginate 
      let page = Number(req.query.page) || 1;
      let limit = Number(req.query.limit) || 4;
      let toSkip = (page - 1) * limit;
      requestPromise = requestPromise
                          .skip(toSkip)
                          .limit(limit);

      let elements = await requestPromise;
      res.status(200).json({
        message: elements,
      });
    } catch (err) {
      console.log(err);
      res.status(502).json({
        message: err.message,
      });
    }
  };
}

function updateElement(elementModel) {
  return async function (req, res) {
    let { id } = req.params;
    try {
      if (res.body.password || req.body.confirmPassword) {
        return res.json({
          message: "use forget password instead",
        });
      }

      let element = await elementModel.findById(id);
      console.log("userRouter.js -> in update user fn ", user);
      if (element) {
        for (let key in req.body) {
          element[key] = req.body[key];
        }

        // save  -> confirmPassword, password
        await element.save({
          validateBeforeSave: false, // password & confirmPassword naa dena padhra postman se -> iss lia humna yaa use kia hai
        });

        res.status(200).json({
          element: element,
        });
      } else {
        res.status(404).json({
          message: "user not found",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Server error",
      });
    }
  };
}

module.exports.createElement = createElement;
module.exports.deleteElement = deleteElement;
module.exports.updateElement = updateElement;
module.exports.getElements = getElements;
module.exports.getElement = getElement;