'use strict';

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    document.location.href = '/index.html';
  } else {
    if (!getUrlParameter('id')) {
      document.location.href = '/home.html';
    }
    getContact();

  }
});

function getContact() {
  authenticatedRequest('GET', 'https://us-central1-is-445.cloudfunctions.net/api/contacts/' + getUrlParameter('id')).then(function(response) {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('addContact').style.display = 'flex';
    document.getElementById('createContainer').style.display = 'flex';

    document.getElementById('name').innerText = response.name;
    document.getElementById('email').innerText = response.email;
    document.getElementById('phone').innerText = response.phone;

    document.getElementById('delete').onclick = function () {
      deleteContact();
    }

    document.getElementById('edit').onclick = function () {
      document.location.href = '/edit.html?id=' + getUrlParameter('id');
    }

  }.bind(this)).catch(function(error) {
    console.error(error.message);
    alert(error.message);
    document.location.href = '/home.html';
    throw error;
  });
}

function deleteContact() {
  let confirmation = confirm("Are you sure ?");

  console.log(confirmation)

  if (confirmation === true) {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('createContainer').style.display = 'none';

    authenticatedRequest('DELETE', 'https://us-central1-is-445.cloudfunctions.net/api/contacts/' + getUrlParameter('id')).then(function(response) {
      console.log(response);
      document.location.href = '/home.html';
    }.bind(this)).catch(function(error) {
      console.error(error.message);
      document.getElementById('loading').style.display = 'none';
      document.getElementById('createContainer').style.display = 'flex';
      alert(error.message);
      throw error;
    });
  }


}

