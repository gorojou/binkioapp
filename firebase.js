// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCDTgeNWY3_ua1dCFcwhtd8h1TsxC08Hmw",
  authDomain: "fiducredit-43b9f.firebaseapp.com",
  databaseURL: "https://fiducredit-43b9f-default-rtdb.firebaseio.com",
  projectId: "fiducredit-43b9f",
  storageBucket: "fiducredit-43b9f.appspot.com",
  messagingSenderId: "700910958998",
  appId: "1:700910958998:web:262c1fab44cfa9352d05b7",
};

// // Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();
export default firebase;
