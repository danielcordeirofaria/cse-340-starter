// All Data interactions are stored in the model of the M-V-C approach.
// This file will have functions that interact with the tables `classification` and `inventory`

const pool = require("../database/");

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

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *";
    const result = await pool.query(sql, [classification_name]);
    return result.rows[0]; // Retorna o registro inserido
  } catch (error) {
    console.error("addClassification error:", error);
    throw error; // Propaga o erro para o controlador
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory({
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
}) {
  try {
    const sql = `
      INSERT INTO public.inventory (
        classification_id, inv_make, inv_model, inv_description, 
        inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const result = await pool.query(sql, [
      classification_id, inv_make, inv_model, inv_description,
      inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
    ]);
    return result.rowCount > 0; // Retorna true se inserido com sucesso
  } catch (error) {
    console.error("addInventory error:", error);
    throw error;
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventory };