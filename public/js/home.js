'use strict';

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    getContacts();
  } else {
    document.location.href = '/index.html'
  }
});

function getContacts() {
  authenticatedRequest('GET', 'https://us-central1-is-445.cloudfunctions.net/api/contacts').then(function(response) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('addContact').style.display = 'flex';

    if (response.length === 0) {
      document.getElementById('emptyContainer').style.display = 'flex';
      return;
    }

    let table = document.querySelector("table");

    document.getElementById('tableContainer').style.display = 'flex';

    for (let element of response) {
      let row = table.insertRow();
      row.setAttribute('rowId', element.id);
      row.onclick = function (e) {
        //let selector = "tr[rowId='" + element.id + "']";
        document.location.href = '/detail.html?id=' + element.id
      }
      for (let key in element) {
        if (key !== 'id') {
          let cell = row.insertCell();
          let text = document.createTextNode(element[key]);
          cell.appendChild(text);
        }
      }
    }
  }.bind(this)).catch(function(error) {
    console.error(error.message);
    throw error;
  });
}