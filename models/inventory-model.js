// All Data interactions are stored in the model of the M-V-C appraoch.
// This file will have functions that interact with the tables `classification` and `inventory`

const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
  try {
    return await pool.query(
      "SELECT * FROM public.classification ORDER BY classification_name"
    );
  } catch (error) {
    console.error("getClassifications error:", error);
    throw error; // Propaga o erro para o controlador
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getInventoryByClassificationId error:", error);
    throw error;
  }
}

/* ***************************
 *  Get vehicle detail
 * ************************** */
async function getVehicleById(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
       WHERE inv_id = $1`,
      [inventory_id]
    );
    return data.rows[0];
  } catch (error) {
    console.error("getVehicleById error:", error);
    throw error;
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById };