/* server.js */
const express = require("express");
const env = require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const app = express();
const staticRoutes = require("./routes/static"); 
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute"); // Adicionado

app.use(express.static("public")); 

/* View Engine e Templates */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* Rotas */
app.use(staticRoutes);
// Index Route
app.get("/", baseController.buildHome);
// Inventory routes
app.use("/inv", inventoryRoute);

/* Configuração do servidor */
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});