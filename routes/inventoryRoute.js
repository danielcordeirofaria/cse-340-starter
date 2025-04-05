// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const validate = require("../utilities/inventory-validation");

// Route to build inventory management view (protegida)
router.get("/", utilities.checkLogin, invController.buildManagementView);

// Route to build inventory by classification view (pública)
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for vehicle detail view (pública)
router.get("/detail/:inventoryId", invController.buildVehicleDetail);

// Route to build add classification view (protegida)
router.get("/add-classification", utilities.checkLogin, invController.buildAddClassification);

// Route to process add classification (protegida)
router.post(
  "/add-classification",
  utilities.checkLogin,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view
router.get("/add-inventory", utilities.checkLogin, invController.buildAddInventory);

// Route to process add inventory
router.post(
  "/add-inventory",
  utilities.checkLogin,
  validate.newInventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to get inventory as JSON
router.get(
  "/getInventory/:classification_id",
  utilities.checkLogin,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build edit inventory view
router.get(
  "/edit/:inventory_id",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildEditInventoryView)
);

// Route to process update inventory
router.post(
  "/update/",
  utilities.checkLogin,
  validate.newInventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to build delete confirmation view
router.get(
  "/delete/:inventory_id",
  utilities.checkLogin,
  utilities.handleErrors(invController.buildDeleteConfirmView)
);

// Route to process delete inventory
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;