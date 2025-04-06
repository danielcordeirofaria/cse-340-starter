const pool = require("../database/");

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    console.log("Resultado da query:", result.rows);
    return result;
  } catch (error) {
    console.error("Erro ao registrar conta:", error.stack);
    throw error;
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount ? email.rows[0] : null; // Retorna a conta ou null
  } catch (error) {
    console.error("Erro ao verificar email existente:", error.stack);
    throw error;
  }
}

/* *****************************
 *   Return account data using email address
 * ***************************** */
async function getAccountByEmail(account_email) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1",
      [account_email]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Erro ao buscar conta pelo email:", error.stack);
    throw new Error("No matching email found");
  }
}

/* *****************************
 *   Return account data using account ID
 * ***************************** */
async function getAccountById(account_id) {
  try {
    const result = await pool.query(
      "SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1",
      [account_id]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Erro ao buscar conta pelo ID:", error.stack);
    throw new Error("No matching account ID found");
  }
}

/* *****************************
 *   Update account information
 * ***************************** */
async function updateAccountInfo(account_id, account_firstname, account_lastname, account_email) {
  try {
    const sql = 
      "UPDATE account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_id]);
    console.log("Conta atualizada:", result.rows[0]);
    return result;
  } catch (error) {
    console.error("Erro ao atualizar informações da conta:", error.stack);
    throw error;
  }
}

/* *****************************
 *   Update account password
 * ***************************** */
async function updatePassword(account_id, account_password) {
  try {
    const sql = "UPDATE account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const result = await pool.query(sql, [account_password, account_id]);
    console.log("Senha atualizada:", result.rows[0]);
    return result;
  } catch (error) {
    console.error("Erro ao atualizar senha:", error.stack);
    throw error;
  }
}

module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail,
  getAccountById,
  updateAccountInfo,
  updatePassword
};