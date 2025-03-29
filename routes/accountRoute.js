const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const validate = require("../utilities/account-validation");

// Route to build the login view (GET)
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the registration view (GET)
router.get("/register", accountController.buildRegister);

// Process the registration data (POST)
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt (POST)
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors((req, res) => {
    res.status(200).send("login process");
  })
);

module.exports = router;