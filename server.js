/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const env = require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const app = express();
const staticRoutes = require("./routes/static"); 
const baseController = require("./controllers/baseController");
console.log("baseController:", baseController);
const inventoryRoute = require("./routes/inventoryRoute");
const utilities = require("./utilities");

app.use(express.static("public")); 

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes);
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);
app.get("/trigger-error", baseController.triggerError);

app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav().catch((navErr) => {
    console.error("Erro ao carregar nav:", navErr);
    return "";
  });
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  console.error(`Error at: "${req.originalUrl}": ${err.stack}`);
  const status = err.status || 500;
  const message = status === 404 ? err.message: "Oh no! There was a crash. Maybe try a different route?";
  res.status(status).render("errors/error", {
    title: `${status} - ${status === 404 ? "Not Found" : "Server Error"}`,
    message,
    nav,
    status
  });
});

/* ***********************
 * Server Configuration
 *************************/
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

