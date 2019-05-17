'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const express = require('express');
const app = express();
const cors = require("cors");

app.use(cors({ origin: true }));

const authenticate = async (req, res, next) => {
  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
    res.status(403).send('Unauthorized');
    return;
  }
  const idToken = req.headers.authorization.split('Bearer ')[1];
  try {
    const decodedIdToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedIdToken;
    next();
    return;
  } catch(e) {
    console.error(e);
    res.status(403).send('Unauthorized');
    return;
  }
};

app.use(authenticate);

app.post('/contacts', async (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;

  if (!name || !email || !phone || name.length <= 0 || email.length <= 0 || phone.length <= 0) {
    return res.status(422).json({email, phone, name});
  }

  try {
    const data = {email, phone, name};
    await admin.database().ref(`/users/${req.user.uid}/contacts`).push(data);
    res.status(201).json({email, phone, name});
  } catch(error) {
    console.log('Error detecting sentiment or saving message', error.message);
    return res.sendStatus(500);
  }
});

app.get('/contacts', async (req, res) => {
  try {
    const snapshot = await admin.database().ref(`/users/${req.user.uid}/contacts`).once('value');

    let items = [];
    if (snapshot.exists()) {
      snapshot.forEach((item) => {
        items.push({
          id: item.key,
          name: item.val().name,
          email: item.val().email,
          phone: item.val().phone,
        });
      });
    }

    return res.status(200).json(items);
  } catch(error) {
    console.log('Error getting messages', error.message);
    return res.sendStatus(500);
  }
});

app.get('/contacts/:contactId', async (req, res) => {
  const contactId = req.params.contactId;
  try {
    const snapshot = await admin.database().ref(`/users/${req.user.uid}/contacts/${contactId}`).once('value');
    if (!snapshot.exists()) {
      return res.status(404).json({errorCode: 404, errorMessage: `contact '${contactId}' not found`});
    }

    return res.status(200).json(snapshot);
  } catch(error) {
    console.log('Error getting contact', contactId, error.message);
    return res.sendStatus(500);
  }
});


app.delete('/contacts/:contactId', async (req, res) => {
  const contactId = req.params.contactId;
  try {
    let ref = await admin.database().ref(`/users/${req.user.uid}/contacts/${contactId}`);

    await ref.remove().catch((error) => {
      return res.sendStatus(500);
    })

    return res.status(200).json({'status': 'ok'});
  } catch (error) {
    console.log('Error getting messages', error.message);
    return res.sendStatus(500);
  }
});

app.put('/contacts/:contactId', async (req, res) => {
  const contactId = req.params.contactId;
  const name = req.body.name;
  const email = req.body.email;
  const phone = req.body.phone;

  if (!name || !email || !phone || name.length <= 0 || email.length <= 0 || phone.length <= 0) {
    return res.status(422).json({email, phone, name});
  }

  try {
    let ref = await admin.database().ref(`/users/${req.user.uid}/contacts/${contactId}`);

    await ref.set({name, email, phone}).catch((error) => {
      return res.sendStatus(500);
    })

    return res.status(200).json({name, email, phone});
  } catch (error) {
    console.log('Error getting messages', error.message);
    return res.sendStatus(500);
  }
});


// Expose the API as a function
exports.api = functions.https.onRequest(app);
