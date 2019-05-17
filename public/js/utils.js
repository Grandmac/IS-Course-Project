'use strict';

function authenticatedRequest(method, url, body) {

  // Get the Firebase auth token to authenticate the request
  return firebase.auth().currentUser.getIdToken().then(function(token) {

    let request = {
      method: method,
      url: url,
      dataType: 'json',
      beforeSend: function(xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + token); }
    };

    if (method === 'POST' || method === 'PUT') {
      request.contentType = 'application/json';
      request.data = JSON.stringify(body);
    }

    console.log('Making authenticated request:', method, url);
    return $.ajax(request).catch(function() {
      throw new Error('Request error: ' + method + ' ' + url);
    });
  });
};

function validateEmail(email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validatePhone(p) {
  let phoneRe = /^[2-9]\d{2}[2-9]\d{2}\d{4}$/;
  let digits = p.replace(/\D/g, "");
  return phoneRe.test(digits);
}

let getUrlParameter = function getUrlParameter(sParam) {
  let sPageURL = window.location.search.substring(1),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

  for (i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
    }
  }
};