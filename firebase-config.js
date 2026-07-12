const firebaseConfig = {
  apiKey: "AIzaSyB5J--V0j7RCCqB0wuKlTmTYwpxbu8eqVA",
  authDomain: "n5learn.firebaseapp.com",
  projectId: "n5learn",
  storageBucket: "n5learn.firebasestorage.app",
  messagingSenderId: "629351125594",
  appId: "1:629351125594:web:402fafe2558c8821b5fe63",
  measurementId: "G-E46954TX25"
};

// Initialize Firebase (Compat)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Optional: Enable offline persistence for Firestore
db.enablePersistence()
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
          console.warn('Multiple tabs open, persistence can only be enabled in one tab at a a time.');
      } else if (err.code == 'unimplemented') {
          console.warn('The current browser does not support all of the features required to enable persistence');
      }
  });
