const bcrypt = require("bcryptjs");
const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

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
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process Login Request
 * *************************************** */
accountController.accountLogin = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
        { expiresIn: "1h" }
      );
      console.log("JWT gerado:", accessToken);

      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600 * 1000,
        sameSite: "Lax",
      });
      console.log("Cookie 'jwt' definido com sucesso");

      res.locals.loggedin = true;
      res.locals.accountData = accountData;

      return res.redirect("/account/");
    } else {
      req.flash("notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    console.error("Erro no login:", error);
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
      errors: null,
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

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(account_password, 10);
    } catch (error) {
      req.flash("notice", "Sorry, there was an error processing the registration.");
      return res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      });
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    );

    if (regResult.rows && regResult.rows.length > 0) {
      req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`);
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        errors: null,
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

/* ****************************************
 *  Deliver Account Management View
 * *************************************** */
accountController.buildAccountManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const accountData = res.locals.accountData || {};
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname || "Guest",
      account_type: accountData.account_type || "Unknown",
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Deliver Update Account View
 * *************************************** */
accountController.buildUpdateAccount = async function (req, res, next) {
  try {
    const account_id = parseInt(req.params.account_id);
    if (account_id !== res.locals.accountData.account_id) {
      req.flash("notice", "You can only update your own account.");
      return res.redirect("/account/");
    }
    let nav = await utilities.getNav();
    res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
      account_id: account_id,
    });
  } catch (error) {
    next(error);
  }
};

/* ****************************************
 *  Process Account Update
 * *************************************** */
accountController.updateAccount = async function (req, res, next) {
  try {
    const { account_id, account_firstname, account_lastname, account_email } = req.body;
    const result = await accountModel.updateAccountInfo(
      parseInt(account_id),
      account_firstname,
      account_lastname,
      account_email
    );

    if (result.rowCount > 0) {
      const updatedAccount = await accountModel.getAccountById(parseInt(account_id));
      delete updatedAccount.account_password;
      const accessToken = jwt.sign(
        updatedAccount,
        process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
        { expiresIn: "1h" }
      );
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600 * 1000,
        sameSite: "Lax",
      });
      res.locals.accountData = updatedAccount;
      req.flash("notice", "Account updated successfully!");
      return res.redirect("/account/");
    } else {
      throw new Error("Failed to update account.");
    }
  } catch (error) {
    let nav = await utilities.getNav();
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: error.message }],
      account_firstname: req.body.account_firstname,
      account_lastname: req.body.account_lastname,
      account_email: req.body.account_email,
      account_id: req.body.account_id,
    });
  }
};

/* ****************************************
 *  Process Password Update
 * *************************************** */
accountController.updatePassword = async function (req, res, next) {
  try {
    const { account_id, account_password } = req.body;
    const hashedPassword = await bcrypt.hash(account_password, 10);
    const result = await accountModel.updatePassword(parseInt(account_id), hashedPassword);

    if (result.rowCount > 0) {
      const updatedAccount = await accountModel.getAccountById(parseInt(account_id));
      delete updatedAccount.account_password;
      const accessToken = jwt.sign(
        updatedAccount,
        process.env.ACCESS_TOKEN_SECRET || "your-secret-key",
        { expiresIn: "1h" }
      );
      res.cookie("jwt", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 3600 * 1000,
        sameSite: "Lax",
      });
      res.locals.accountData = updatedAccount;
      req.flash("notice", "Password updated successfully!");
      return res.redirect("/account/");
    } else {
      throw new Error("Failed to update password.");
    }
  } catch (error) {
    let nav = await utilities.getNav();
    res.status(500).render("account/update", {
      title: "Update Account",
      nav,
      errors: [{ msg: error.message }],
      account_firstname: res.locals.accountData.account_firstname,
      account_lastname: res.locals.accountData.account_lastname,
      account_email: res.locals.accountData.account_email,
      account_id: req.body.account_id,
    });
  }
};

/* ****************************************
 *  Process Logout
 * *************************************** */
accountController.logout = async function (req, res, next) {
  try {
    res.clearCookie("jwt");
    req.flash("notice", "You have been logged out.");
    res.redirect("/");
  } catch (error) {
    next(error);
  }
};

module.exports = accountController;