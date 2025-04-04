const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const validate = require("../utilities/account-validation");

// Route to build the account management view (GET) - com middleware JWT e checkLogin
router.get(
  "/", 
  utilities.checkJWTToken, 
  utilities.checkLogin, 
  utilities.handleErrors(accountController.buildAccountManagement)
);

// Route to build the login view (GET)
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build the registration view (GET)
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data (POST)
router.post(
  "/register",
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login request (POST)
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router;