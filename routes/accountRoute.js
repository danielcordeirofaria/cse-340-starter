// Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

// Route to build the login view (GET)
// router.get("/login", accountController.buildLogin);
router.get("/login", utilities.handleErrors(accountController.buildLogin))


// Route to process the login form (POST)
router.post("/login", accountController.processLogin);

// Route to build the registration view (GET)
router.get("/register", accountController.buildRegister);

// New route to process the registration form (POST)
router.post('/register', utilities.handleErrors(accountController.registerAccount));

module.exports = router;