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

    document.getElementById('name').value = response.name;
    document.getElementById('email').value = response.email;
    document.getElementById('phone').value = response.phone;

  }.bind(this)).catch(function(error) {
    console.error(error.message);
    alert(error.message);
    document.location.href = '/home.html';
    throw error;
  });
}

function updateContact(name, email, phone) {
  authenticatedRequest('PUT', 'https://us-central1-is-445.cloudfunctions.net/api/contacts/' + getUrlParameter('id'), {name, email, phone}).then(function(response) {
    document.location.href = '/home.html';

  }.bind(this)).catch(function(error) {
    console.error(error.message);
    throw error;
  });
}

document.getElementById("createForm").onsubmit = function(e) {
  e.preventDefault();
  let form = document.getElementById("createForm");
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;

  if (!form.checkValidity() || name.length <= 0 || email.length <= 0 || phone.length <= 0) {
    alert('invalid form');
    return;
  }

  if (!validateEmail(email)) {
    alert('invalid email');
    return;
  }

  if (!validatePhone(phone)) {
    alert('invalid phone');
    return;
  }

  updateContact(name, email, phone);
}

//getContacts();
