// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCDTgeNWY3_ua1dCFcwhtd8h1TsxC08Hmw",
//   authDomain: "fiducredit-43b9f.firebaseapp.com",
//   databaseURL: "https://fiducredit-43b9f-default-rtdb.firebaseio.com",
//   projectId: "fiducredit-43b9f",
//   storageBucket: "fiducredit-43b9f.appspot.com",
//   messagingSenderId: "700910958998",
//   appId: "1:700910958998:web:262c1fab44cfa9352d05b7",
// };
const firebaseConfig = {
  apiKey: "AIzaSyCp0beUUF15QIHNoL2oNwyTiBKt6ig3VJ8",
  authDomain: "binkiobackup.firebaseapp.com",
  projectId: "binkiobackup",
  storageBucket: "binkiobackup.appspot.com",
  messagingSenderId: "807306089882",
  appId: "1:807306089882:web:97a7991d22e4b7dc06d623",
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
