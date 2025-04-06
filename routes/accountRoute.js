const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const validate = require("../utilities/account-validation");

// Route to build the account management view (GET)
router.get(
  "/",
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

// Route to build the update account view (GET)
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
);

// Process the account update (POST)
router.post(
  "/update",
  utilities.checkLogin,
  validate.accountUpdateRules(),
  validate.checkAccountUpdateData,
  utilities.handleErrors(accountController.updateAccount)
);

// Process the password update (POST)
router.post(
  "/update-password",
  utilities.checkLogin,
  validate.passwordUpdateRules(),
  validate.checkPasswordUpdateData,
  utilities.handleErrors(accountController.updatePassword)
);

// Route to process logout (GET)
router.get("/logout", utilities.handleErrors(accountController.logout));

module.exports = router;