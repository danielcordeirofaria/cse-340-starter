// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const { body } = require("express-validator");

// Middleware de validação para adicionar classificação
const validateClassification = [
  body("classification_name")
    .trim()
    .matches(/^[A-Za-z0-9]+$/)
    .withMessage("Classification name must contain only letters and numbers, no spaces or special characters."),
];

// Middleware de validação para adicionar inventário
const validateInventory = [
  body("classification_id").isInt().withMessage("Please select a valid classification."),
  body("inv_make").matches(/^[A-Za-z0-9]{3,}$/).withMessage("Make must be at least 3 characters, letters and numbers only."),
  body("inv_model").matches(/^[A-Za-z0-9]{3,}$/).withMessage("Model must be at least 3 characters, letters and numbers only."),
  body("inv_description").isLength({ min: 10 }).withMessage("Description must be at least 10 characters."),
  body("inv_price").isFloat({ min: 0 }).withMessage("Price must be a positive number."),
  body("inv_year").isInt({ min: 1900, max: new Date().getFullYear() }).withMessage("Year must be between 1900 and current year."),
  body("inv_miles").isInt({ min: 0 }).withMessage("Miles cannot be negative."),
  body("inv_color").matches(/^[A-Za-z]{3,}$/).withMessage("Color must be at least 3 letters, letters only."),
];

// Route to build inventory management view
router.get("/", invController.buildManagementView);

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for vehicle detail view
router.get("/detail/:inventoryId", invController.buildVehicleDetail);

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassification);

// Route to process add classification
router.post(
  "/add-classification",
  validateClassification,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", invController.buildAddInventory);

// Route to process add inventory
router.post(
  "/add-inventory",
  validateInventory,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;