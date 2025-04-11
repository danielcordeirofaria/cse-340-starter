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

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList();
    res.render("./inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      messages: req.flash(),
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: req.flash(),
      errors: null,
      classification_name: "",
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process add classification
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body;
    const result = await invModel.addClassification(classification_name);

    if (result) {
      let nav = await utilities.getNav();
      req.flash("success", `Classification "${classification_name}" added successfully!`);
      res.redirect("/inv/");
    } else {
      throw new Error("Failed to add classification.");
    }
  } catch (error) {
    let nav = await utilities.getNav();
    req.flash("error", error.message || "Failed to add classification.");
    res.status(500).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      messages: req.flash(),
      errors: error.errors || [],
      classification_name: req.body.classification_name || "",
    });
  }
};

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      messages: req.flash(),
      errors: null,
      inv_make: "",
      inv_model: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.jpg",
      inv_thumbnail: "/images/vehicles/no-image-tn.jpg",
      inv_price: "",
      inv_year: "",
      inv_miles: "",
      inv_color: "",
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process add inventory
 * ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
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

    const result = await invModel.addInventory({
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
    });

    if (result) {
      let nav = await utilities.getNav();
      req.flash("success", `Vehicle "${inv_make} ${inv_model}" added successfully!`);
      res.redirect("/inv/");
    } else {
      throw new Error("Failed to add inventory item.");
    }
  } catch (error) {
    let nav = await utilities.getNav();
    let classificationList = await utilities.buildClassificationList(req.body.classification_id);
    req.flash("error", error.message || "Failed to add inventory.");
    res.status(500).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      messages: req.flash(),
      errors: error.errors || [],
      inv_make: req.body.inv_make || "",
      inv_model: req.body.inv_model || "",
      inv_description: req.body.inv_description || "",
      inv_image: req.body.inv_image || "/images/vehicles/no-image.jpg",
      inv_thumbnail: req.body.inv_thumbnail || "/images/vehicles/no-image-tn.jpg",
      inv_price: req.body.inv_price || "",
      inv_year: req.body.inv_year || "",
      inv_miles: req.body.inv_miles || "",
      inv_color: req.body.inv_color || "",
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inventory_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleById(inv_id);
    if (!itemData) {
      throw { status: 404, message: "Vehicle not found." };
    }
    const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process update inventory
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  try {
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

    const result = await invModel.updateInventory({
      inv_id: parseInt(inv_id),
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
    });

    if (result) {
      let nav = await utilities.getNav();
      req.flash("success", `Vehicle "${inv_make} ${inv_model}" updated successfully!`);
      res.redirect("/inv/");
    } else {
      throw new Error("Failed to update inventory item.");
    }
  } catch (error) {
    let nav = await utilities.getNav();
    let classificationSelect = await utilities.buildClassificationList(req.body.classification_id);
    const itemName = `${req.body.inv_make} ${req.body.inv_model}`;
    req.flash("error", error.message || "Failed to update inventory.");
    res.status(500).render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      messages: req.flash(),
      errors: error.errors || [],
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make || "",
      inv_model: req.body.inv_model || "",
      inv_description: req.body.inv_description || "",
      inv_image: req.body.inv_image || "/images/vehicles/no-image.jpg",
      inv_thumbnail: req.body.inv_thumbnail || "/images/vehicles/no-image-tn.jpg",
      inv_price: req.body.inv_price || "",
      inv_year: req.body.inv_year || "",
      inv_miles: req.body.inv_miles || "",
      inv_color: req.body.inv_color || "",
      classification_id: req.body.classification_id,
    });
  }
};

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invCont.buildDeleteConfirmView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inventory_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleById(inv_id);
    if (!itemData) {
      throw { status: 404, message: "Vehicle not found." };
    }
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Process delete inventory
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    let nav = await utilities.getNav();
    const itemData = await invModel.getVehicleById(inv_id);
    const deleteResult = await invModel.deleteInventoryItem(inv_id);

    if (deleteResult.rowCount > 0) {
      req.flash("notice", `The ${itemData.inv_make} ${itemData.inv_model} was successfully deleted.`);
      res.redirect("/inv/");
    } else {
      const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
      req.flash("notice", "Sorry, the delete failed.");
      res.status(501).render("inventory/delete-confirm", {
        title: "Delete " + itemName,
        nav,
        errors: null,
        inv_id,
        inv_make: itemData.inv_make,
        inv_model: itemData.inv_model,
        inv_year: itemData.inv_year,
        inv_price: itemData.inv_price,
      });
    }
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Like a vehicle
 * ************************** */
invCont.likeVehicle = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    if (!inv_id) {
      throw { status: 400, message: "Invalid vehicle ID." };
    }
    const vehicle = await invModel.getVehicleById(inv_id);
    if (!vehicle) {
      throw { status: 404, message: "Vehicle not found." };
    }
    const likeData = await invModel.incrementLikes(inv_id);
    res.json({ success: true, likes: likeData.inv_likes });
  } catch (error) {
    console.error("likeVehicle error:", error);
    res.status(error.status || 500).json({ error: error.message || "Failed to like vehicle." });
  }
};

/* ***************************
 *  Build ranking view
 * ************************** */
invCont.buildRankingView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();
    const vehicles = await invModel.getRanking();
    if (!vehicles || vehicles.length === 0) {
      throw { status: 404, message: "No vehicles found for ranking." };
    }
    const grid = await utilities.buildRankingGrid(vehicles); // Nova função
    res.render("./inventory/ranking", {
      title: "Vehicle Rankings",
      nav,
      grid,
      messages: req.flash(),
      errors: null,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;