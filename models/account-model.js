const pool = require("../database/")

/* *****************************
 *   Register new account
 * *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    const result = await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    console.log("Resultado da query:", result.rows) // Log para depuração
    return result
  } catch (error) {
    console.error("Erro ao registrar conta:", error.stack)
    throw error
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount // Retorna o número de linhas encontradas (0 se não existe, 1 ou mais se existe)
  } catch (error) {
    console.error("Erro ao verificar email existente:", error.stack)
    throw error // Propaga o erro em vez de retornar a mensagem
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
    )
    return result.rows[0] // Retorna o primeiro registro encontrado
  } catch (error) {
    console.error("Erro ao buscar conta pelo email:", error.stack)
    throw new Error("No matching email found") // Lança um erro se não encontrar
  }
}

module.exports = { 
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail // Adiciona a nova função ao objeto exportado
}