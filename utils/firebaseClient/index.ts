import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
  apiKey: "AIzaSyDL28PkXRPyB6z8dnY1sY9cDUZXpDS-kko",
  authDomain: "duskbooks-245d0.firebaseapp.com",
  databaseURL: "https://duskbooks-245d0.firebaseio.com",
  projectId: "duskbooks-245d0",
  storageBucket: "duskbooks-245d0.appspot.com",
  messagingSenderId: "240873174711",
  appId: "1:240873174711:web:1e12835d2479eb3eaabf32",
  measurementId: "G-CMSMY18S9N",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
}

export default firebase;
