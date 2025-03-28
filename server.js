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
const session = require("express-session");
const flash = require("connect-flash");
const messages = require("express-messages");
const pool = require("./database/");
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser")


// Logs para depuração
console.log("session loaded:", !!session);
console.log("flash loaded:", !!flash);
console.log("messages loaded:", !!messages);

app.use(express.static("public")); 

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* ***********************
 * Middleware
 *************************/
app.use(session({
  store: new (require("connect-pg-simple")(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET || "fallback_secret",
  resave: false,
  saveUninitialized: false,
  name: "sessionId",
}));

app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = messages(req, res); 
  console.log("req.flash available:", typeof req.flash === "function"); 
  next();
});

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

/* ***********************
 * Routes
 *************************/
app.use(staticRoutes);
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);
app.use("/account", require("./routes/accountRoute"))
app.get("/trigger-error", baseController.triggerError);

app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});



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
  const message = status === 404 ? err.message : "Oh no! There was a crash. Maybe try a different route?";
  res.status(status).render("errors/error", {
    title: `${status} - ${status === 404 ? "Not Found" : "Server Error"}`,
    message,
    nav,
    status,
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

