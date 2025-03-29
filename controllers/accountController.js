const utilities = require("../utilities");
const accountModel = require("../models/account-model");

const accountController = {};

/* ****************************************
 *  Deliver Login View
 * *************************************** */
accountController.buildLogin = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/login", { 
      title: "Login", 
      nav, 
      errors: null // Adiciona errors como null por padrão
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process Login Request
 * *************************************** */
accountController.processLogin = async function (req, res, next) {
  try {
    const { account_email, account_password } = req.body; // Ajustado para account_email e account_password
    req.flash("notice", `Login attempted with email: ${account_email}`);
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Deliver Registration View
 * *************************************** */
accountController.buildRegister = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("account/register", { 
      title: "Register", 
      nav, 
      errors: null 
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process Registration
 * *************************************** */
accountController.registerAccount = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;

    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/;
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

    if (regResult.rows && regResult.rows.length > 0) { // Ajustado para verificar rows
      req.flash(
        "notice",
        `Congratulations, you're registered ${account_firstname}. Please log in.`
      );
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null // Adicionado para consistência
      });
    } else {
      req.flash("notice", "Sorry, the registration failed.");
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        account_firstname,
        account_lastname,
        account_email,
        errors: null,
      });
    }
  } catch (error) {
    console.error("Erro ao processar registro:", error.stack);
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      account_firstname: req.body.account_firstname || "",
      account_lastname: req.body.account_lastname || "",
      account_email: req.body.account_email || "",
      errors: null,
    });
  }
};

module.exports = accountController;