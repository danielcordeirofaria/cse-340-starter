const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/* ***************************
 *  Rules for new classification
 * ************************** */
validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name must contain only letters and numbers, no spaces or special characters."),
  ];
};

/* ***************************
 * Check classification data and return to add view if errors
 * ************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    return res.status(400).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: req.flash(),
      errors: errors.array(),
      classification_name,
    });
  }
  next();
};

/* ***************************
 *  Rules for new inventory data
 * ************************** */
validate.newInventoryRules = () => {
  return [
    body("classification_id")
      .isInt()
      .withMessage("Please select a valid classification."),
    body("inv_make")
      .matches(/^[A-Za-z0-9]{3,}$/)
      .withMessage("Make must be at least 3 characters, letters and numbers only."),
    body("inv_model")
      .matches(/^[A-Za-z0-9]{3,}$/)
      .withMessage("Model must be at least 3 characters, letters and numbers only."),
    body("inv_description")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters."),
    body("inv_price")
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),
    body("inv_year")
      .isInt({ min: 1900, max: new Date().getFullYear() })
      .withMessage("Year must be between 1900 and current year."),
    body("inv_miles")
      .isInt({ min: 0 })
      .withMessage("Miles cannot be negative."),
    body("inv_color")
      .matches(/^[A-Za-z]{3,}$/)
      .withMessage("Color must be at least 3 letters, letters only."),
  ];
};

/* ***************************
 * Check new inventory data and return to add view if errors
 * ************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(classification_id);
    return res.status(400).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      messages: req.flash(),
      errors: errors.array(),
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
  }
  next();
};

/* ***************************
 * Check update inventory data and return to edit view if errors
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      messages: req.flash(),
      errors: errors.array(),
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
  next();
};

module.exports = validate;