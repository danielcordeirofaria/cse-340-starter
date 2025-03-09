/* server.js */
const express = require("express");
const env = require("dotenv").config();
const expressLayouts = require("express-ejs-layouts");
const app = express();
const staticRoutes = require("./routes/static"); // Renomeei para evitar conflito

/* Servir arquivos estáticos (CSS, imagens, etc.) */
app.use(express.static("public")); // Adicione esta linha

/* View Engine e Templates */
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

/* Rotas */
app.use(staticRoutes);

// Index Route
app.get("/", (req, res) => {
  res.render("index", { title: "First Page" });
});

/* Configuração do servidor */
const port = process.env.PORT || 3000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});