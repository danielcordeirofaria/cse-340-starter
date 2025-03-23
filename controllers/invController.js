const invModel = require("../models/inventory-model");
const utilities = require("../utilities");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    if (!data || data.length === 0) {
      throw { status: 404, message: "No vehicles found for this classification." };
    }
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};


/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildVehicleDetail = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId;
    const vehicle = await invModel.getVehicleById(inventory_id);
    if (!vehicle) {
      throw { status: 404, message: "Vehicle not found." };
    }
    const vehicleHTML = await utilities.buildVehicleDetailHTML(vehicle);
    let nav = await utilities.getNav();
    res.render("./inventory/vehicle-detail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicleHTML,
      vehicle,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;