const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += `
      <li>
        <a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>`;
  });
  list += '<li><a href="/inv/ranking" title="View vehicle rankings">Rankings</a></li>';
  list += "</ul>";
  return list;
};

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = `<ul id="inv-display">`;
    data.forEach((vehicle) => {
      // Escapar os valores para evitar quebra de HTML
      const safeMake = String(vehicle.inv_make).replace(/"/g, '"').replace(/</g, '<').replace(/>/g, '>');
      const safeModel = String(vehicle.inv_model).replace(/"/g, '"').replace(/</g, '<').replace(/>/g, '>');
      const safeThumbnail = String(vehicle.inv_thumbnail).replace(/"/g, '"');

      grid += `<li>`;
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${safeMake} ${safeModel} details">`;
      grid += `<img src="${safeThumbnail}" alt="Image of ${safeMake} ${safeModel} on CSE Motors" />`;
      grid += `</a>`;
      grid += `<div class="namePrice">`;
      grid += `<h2>`;
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${safeMake} ${safeModel} details">${safeMake} ${safeModel}</a>`;
      grid += `</h2>`;
      grid += `<span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`;
      grid += `</div>`;
      grid += `</li>`;
    });
    grid += `</ul>`;
  } else {
    grid = `<p class="notice">Sorry, no matching vehicles could be found.</p>`;
  }
  console.log("Generated grid HTML:", grid);
  return grid;
};

/* ****************************************
 * Build the vehicle detail HTML
 **************************************** */
Util.buildVehicleDetailHTML = async function (vehicle) {
  let html = `<div class="vehicle-detail-container">`;
  html += `<div class="vehicle-image">`;
  html += `<picture>`;
  html += `<source media="(max-width: 520px)" srcset="${vehicle.inv_thumbnail}">`;
  html += `<img src="${vehicle.inv_image}" alt="${vehicle.inv_make} ${vehicle.inv_model}">`;
  html += `</picture>`;
  html += `</div>`;
  html += `<div class="vehicle-details">`;
  html += `<h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>`;
  html += `<p class="vehicle-year">Year: ${vehicle.inv_year}</p>`;
  html += `<p class="vehicle-price">Price: $${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</p>`;
  html += `<p class="vehicle-mileage">Mileage: ${new Intl.NumberFormat("en-US").format(vehicle.inv_miles)} miles</p>`;
  html += `<p class="vehicle-description">Description: ${vehicle.inv_description}</p>`;
  html += `<p class="vehicle-color">Color: ${vehicle.inv_color}</p>`;
  html += `</div>`;
  html += `</div>`;
  return html;
};

/* ****************************************
 * Build classification list for dropdown
 **************************************** */
Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList = `<select name="classification_id" id="classificationList" required>`;
  classificationList += `<option value="">Choose a Classification</option>`;
  data.rows.forEach((row) => {
    classificationList += `<option value="${row.classification_id}"`;
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += ` selected`;
    }
    classificationList += `>${row.classification_name}</option>`;
  });
  classificationList += `</select>`;
  return classificationList;
};

/* ****************************************
 * Middleware For Handling Errors
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("notice", "Please log in");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    next();
  }
};

/* ****************************************
 * Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  console.log("Valor de res.locals.loggedin em checkLogin:", res.locals.loggedin);
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};

/* ****************************************
 * Apply handleErrors to async functions
 **************************************** */
Util.getNav = Util.handleErrors(Util.getNav);
Util.buildClassificationGrid = Util.handleErrors(Util.buildClassificationGrid);
Util.buildVehicleDetailHTML = Util.handleErrors(Util.buildVehicleDetailHTML);
Util.buildClassificationList = Util.handleErrors(Util.buildClassificationList);

/* ****************************************
 * Middleware to check account type (Employee or Admin)
 **************************************** */
Util.checkAdminAccess = (req, res, next) => {
  console.log("Verificando acesso administrativo para:", req.originalUrl);
  if (res.locals.loggedin && (res.locals.accountData.account_type === "Employee" || res.locals.accountData.account_type === "Admin")) {
    console.log("Acesso administrativo concedido para:", res.locals.accountData.account_email);
    next();
  } else {
    req.flash("notice", "You must be an Employee or Admin to access this page. Please log in with appropriate credentials.");
    console.log("Acesso administrativo negado para:", res.locals.accountData?.account_email || "usuário não logado");
    res.redirect("/account/login");
  }
};

/* **************************************
 * Build the ranking view HTML
 * ************************************ */
Util.buildRankingGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = `<ul id="inv-display">`;
    data.forEach((vehicle, index) => {
      const safeMake = String(vehicle.inv_make).replace(/"/g, '"').replace(/</g, '<').replace(/>/g, '>');
      const safeModel = String(vehicle.inv_model).replace(/"/g, '"').replace(/</g, '<').replace(/>/g, '>');
      const safeThumbnail = String(vehicle.inv_thumbnail).replace(/"/g, '"');

      grid += `<li>`;
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${safeMake} ${safeModel} details">`;
      grid += `<img src="${safeThumbnail}" alt="Image of ${safeMake} ${safeModel} on CSE Motors" />`;
      grid += `</a>`;
      grid += `<div class="namePrice">`;
      grid += `<h2>`;
      grid += `<span class="rank">#${index + 1}</span> `;
      grid += `<a href="../../inv/detail/${vehicle.inv_id}" title="View ${safeMake} ${safeModel} details">${safeMake} ${safeModel}</a>`;
      grid += `</h2>`;
      grid += `<span>$${new Intl.NumberFormat("en-US").format(vehicle.inv_price)}</span>`;
      grid += `<p>Likes: <span id="likes-${vehicle.inv_id}">${vehicle.inv_likes || 0}</span></p>`;
      grid += `</div>`;
      grid += `</li>`;
    });
    grid += `</ul>`;
  } else {
    grid = `<p class="notice">No vehicles have been liked yet.</p>`;
  }
  console.log("Generated ranking grid HTML:", grid);
  return grid;
};

module.exports = Util;