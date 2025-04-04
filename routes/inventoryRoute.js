// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const validate = require("../utilities/inventory-validation"); // Importa o arquivo de validação

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
  validate.classificationRules(), // Regras de validação para nova classificação
  validate.checkClassificationData, // Verifica dados e retorna erros para add-classification
  utilities.handleErrors(invController.addClassification) // Trata erros do controlador
);

// Route to build add inventory view
router.get("/add-inventory", invController.buildAddInventory);

// Route to process add inventory
router.post(
  "/add-inventory",
  validate.newInventoryRules(), // Regras de validação para novo inventário
  validate.checkInventoryData, // Verifica dados e retorna erros para add-inventory
  utilities.handleErrors(invController.addInventory) // Trata erros do controlador
);

// Route to get inventory as JSON
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);

// Route to build edit inventory view
router.get(
  "/edit/:inventory_id",
  utilities.handleErrors(invController.buildEditInventoryView)
);

// Route to process update inventory
router.post(
  "/update/",
  validate.newInventoryRules(), // Regras de validação para atualização de inventário
  validate.checkUpdateData, // Verifica dados e retorna erros para edit-inventory
  utilities.handleErrors(invController.updateInventory) // Trata erros do controlador
);

module.exports = router;