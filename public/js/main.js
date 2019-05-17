'use strict';

function signIn() {
  firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider());
}

document.getElementById("sign-id-btn").onclick = function() {
  signIn();
}

firebase.auth().onAuthStateChanged((user) => {
  if (firebase.auth().currentUser) {
    document.location.href = '/home.html'
  }
});


// function Home() {
//   $(function() {
//     this.$signInButton = $('#demo-sign-in-button');
//     this.$signOutButton = $('#demo-sign-out-button');
//     this.$messageTextarea = $('#demo-message');
//     this.$createMessageButton = $('#demo-create-message');
//     this.$createMessageResult = $('#demo-create-message-result');
//     this.$messageListButtons = $('.message-list-button');
//     this.$messageList = $('#demo-message-list');
//     this.$messageDetails = $('#demo-message-details');
//
//     this.$signInButton.on('click', this.signIn.bind(this));
//     this.$signOutButton.on('click', this.signOut.bind(this));
//     this.$createMessageButton.on('click', this.createMessage.bind(this));
//     this.$messageListButtons.on('click', this.listMessages.bind(this));
//     firebase.auth().onAuthStateChanged(this.onAuthStateChanged.bind(this));
//   }.bind(this));
// }

// Home.prototype.signIn = function() {
//
// };
//
// Home.prototype.signOut = function() {
//   firebase.auth().signOut();
// };
//
// Home.prototype.onAuthStateChanged = function(user) {
//   if (user) {
//     // If we have a user, simulate a click to get all their messages.
//     // Material Design Lite will create a <span> child that we'll expect to be clicked
//     $('#message-list-button-all > span').click();
//     this.$messageTextarea.removeAttr('disabled');
//     this.$createMessageButton.removeAttr('disabled');
//   } else {
//     this.$messageTextarea.attr('disabled', true);
//     this.$createMessageButton.attr('disabled', true);
//     this.$createMessageResult.html('');
//     this.$messageList.html('');
//     this.$messageDetails.html('');
//   }
// };
//
// Home.prototype.createMessage = function() {
//   var message = this.$messageTextarea.val();
//
//   if (message === '') return;
//
//   // Make an authenticated POST request to create a new message
//   this.authenticatedRequest('POST', '/api/messages', {message: message}).then(function(response) {
//     this.$messageTextarea.val('');
//     this.$messageTextarea.parent().removeClass('is-dirty');
//
//     this.$createMessageResult.html('Created <b>' + response.category + '</b> message: ' + response.message);
//   }.bind(this)).catch(function(error) {
//     console.log('Error creating message:', message);
//     throw error;
//   });
// };
//
// Home.prototype.listMessages = function(event) {
//   this.$messageListButtons.removeClass('mdl-button--accent');
//   $(event.target).parent().addClass('mdl-button--accent');
//   this.$messageList.html('');
//   this.$messageDetails.html('');
//
//   // Make an authenticated GET request for a list of messages
//   // Optionally specifying a category (positive, negative, neutral)
//   var label = $(event.target).parent().text().toLowerCase();
//   var category = label === 'all' ? '' : label;
//   var url = category ? '/api/messages?category=' + category : '/api/messages';
//   this.authenticatedRequest('GET', url).then(function(response) {
//     var elements = response.map(function(message) {
//       return $('<li>')
//           .text(message.message)
//           .addClass('mdl-list__item')
//           .data('key', message.key)
//           .on('click', this.messageDetails.bind(this));
//     }.bind(this));
//
//     // Append items to the list and simulate a click to fetch the first message's details
//     this.$messageList.append(elements);
//
//     if (elements.length > 0) {
//       elements[0].click();
//     }
//   }.bind(this)).catch(function(error) {
//     console.log('Error listing messages.');
//     throw error;
//   });
// };
//
// Home.prototype.messageDetails = function(event) {
//   $('li').removeClass('selected');
//   $(event.target).addClass('selected');
//
//   var key = $(event.target).data('key');
//   this.authenticatedRequest('GET', '/api/message/' + key).then(function(response) {
//     this.$messageDetails.text(JSON.stringify(response, null, 2));
//   }.bind(this)).catch(function(error) {
//     console.log('Error getting message details.');
//     throw error;
//   });
// };
//
// Home.prototype.authenticatedRequest = function(method, url, body) {
//   if (!firebase.auth().currentUser) {
//     throw new Error('Not authenticated. Make sure you\'re signed in!');
//   }
//
//   // Get the Firebase auth token to authenticate the request
//   return firebase.auth().currentUser.getIdToken().then(function(token) {
//     console.log(token);
//     return;
//     var request = {
//       method: method,
//       url: url,
//       dataType: 'json',
//       beforeSend: function(xhr) { xhr.setRequestHeader('Authorization', 'Bearer ' + token); }
//     };
//
//     if (method === 'POST') {
//       request.contentType = 'application/json';
//       request.data = JSON.stringify(body);
//     }
//
//     console.log('Making authenticated request:', method, url);
//     return $.ajax(request).catch(function() {
//       throw new Error('Request error: ' + method + ' ' + url);
//     });
//   });
// };
//
// window.home = new Home();