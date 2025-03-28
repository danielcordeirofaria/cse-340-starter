const utilities = require("../utilities");
const accountController = {};

const accountModel = require("../models/account-model");

accountController.buildLogin = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", { title: "Login", nav });
  } catch (error) {
    next(error);
  }
};

accountController.processLogin = async function (req, res, next) {
  try {
    const { email, password } = req.body;
    req.flash("notice", `Login attempted with email: ${email}`);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

accountController.buildRegister = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", { title: "Register", nav });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  } catch (error) {
    next(error);
  }
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(.{12,})$/;
  if (!passwordRegex.test(account_password)) {
    req.flash(
      "notice",
      "Password must be at least 12 characters, including 1 uppercase letter, 1 number, and 1 special character (!@#$%^&*)."
    );
    return res.status(400).render("account/register", {
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    });
  }
}

accountController.registerAccount = registerAccount;
module.exports = accountController;
