// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const validate = require("../utilities/inventory-validation");

// Route to build inventory by classification view (pública)
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route for vehicle detail view (pública)
router.get("/detail/:inventoryId", invController.buildVehicleDetail);

// Route to build inventory management view (protegida - apenas Employee/Admin)
router.get("/", utilities.checkLogin, utilities.checkAdminAccess, invController.buildManagementView);

// Route to build add classification view (protegida - apenas Employee/Admin)
router.get("/add-classification", utilities.checkLogin, utilities.checkAdminAccess, invController.buildAddClassification);

// Route to process add classification (protegida - apenas Employee/Admin)
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkAdminAccess,
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Route to build add inventory view (protegida - apenas Employee/Admin)
router.get("/add-inventory", utilities.checkLogin, utilities.checkAdminAccess, invController.buildAddInventory);

// Route to process add inventory (protegida - apenas Employee/Admin)
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkAdminAccess,
  validate.newInventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// Route to get inventory as JSON (protegida - apenas Employee/Admin)
router.get(
  "/getInventory/:classification_id",
  utilities.checkLogin,
  utilities.checkAdminAccess,
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build edit inventory view (protegida - apenas Employee/Admin)
router.get(
  "/edit/:inventory_id",
  utilities.checkLogin,
  utilities.checkAdminAccess,
  utilities.handleErrors(invController.buildEditInventoryView)
);

// Route to process update inventory (protegida - apenas Employee/Admin)
router.post(
  "/update/",
  utilities.checkLogin,
  utilities.checkAdminAccess,
  validate.newInventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Route to build delete confirmation view (protegida - apenas Employee/Admin)
router.get(
  "/delete/:inventory_id",
  utilities.checkLogin,
  utilities.checkAdminAccess,
  utilities.handleErrors(invController.buildDeleteConfirmView)
);

// Route to process delete inventory (protegida - apenas Employee/Admin)
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.checkAdminAccess,
  utilities.handleErrors(invController.deleteInventory)
);

module.exports = router;