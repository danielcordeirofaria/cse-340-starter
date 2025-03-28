// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation"); // Add this line

// Route to build the login view (GET)
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to process the login form (POST)
router.post("/login", accountController.processLogin);

// Route to build the registration view (GET)
router.get("/register", accountController.buildRegister);

// Process the registration data (POST)
router.post(
  "/register",
  regValidate.registrationRules(), // Apply validation rules
  regValidate.checkRegData,       // Check validation results
  utilities.handleErrors(accountController.registerAccount) // Handle errors
);

module.exports = router;