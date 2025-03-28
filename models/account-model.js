const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password]);
    console.log("Resultado da query:", result.rows); // Log para depuração
    return result;
  } catch (error) {
    console.error("Erro ao registrar conta:", error.stack);
    throw error;
  }
}

module.exports = { registerAccount };