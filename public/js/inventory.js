'use strict';

// Get a list of items in inventory based on the classification_id
let classificationList = document.querySelector("#classificationList");
classificationList.addEventListener("change", function () {
  let classification_id = classificationList.value;
  console.log(`classification_id is: ${classification_id}`);
  let classIdURL = "/inv/getInventory/" + classification_id;
  fetch(classIdURL)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      }
      throw Error("Network response was not OK");
    })
    .then(function (data) {
      console.log(data);
      buildInventoryList(data);
    })
    .catch(function (error) {
      console.log('There was a problem: ', error.message);
    });
});

// Build inventory items into card components and inject into DOM
function buildInventoryList(data) {
  let inventoryDisplay = document.getElementById("inventoryDisplay");
  let cards = '';

  if (data.length === 0) {
    cards = '<p>No vehicles found for this classification.</p>';
  } else {
    data.forEach(function (element) {
      console.log(element.inv_id + ", " + element.inv_model);
      cards += `
        <div class="inventory-card">
          <img src="${element.inv_thumbnail}" alt="${element.inv_make} ${element.inv_model}" class="thumbnail">
          <h3>${element.inv_make} ${element.inv_model}</h3>
          <div class="card-buttons">
            <a href="/inv/edit/${element.inv_id}" title="Click to update" class="button">Modify</a>
            <a href="/inv/delete/${element.inv_id}" title="Click to delete" class="button">Delete</a>
          </div>
        </div>
      `;
    });
  }

  inventoryDisplay.innerHTML = cards;
}