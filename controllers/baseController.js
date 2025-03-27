const utilities = require("../utilities");

const baseController = {};

baseController.buildHome = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("index", { title: "Home", nav });
    // req.flash("notice", "This is a flash message.");
  } catch (error) {
    next(error);
  }
};

baseController.triggerError = async function (req, res, next) {
  try {
    throw new Error("Intentional server error triggered!");
  } catch (error) {
    error.status = 500;
    next(error);
  }
};

module.exports = baseController;