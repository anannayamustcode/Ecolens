// // src/firebase.js
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// const firebaseConfig = {
//   apiKey: "AIzaSyB7O75NTh2QXO6Spxmoje73XYmIoFb7V4o",
//   authDomain: "barcathon25.firebaseapp.com",
//   projectId: "barcathon25",
//   storageBucket: "barcathon25.firebasestorage.app",
//   messagingSenderId: "873361305196",
//   appId: "1:873361305196:web:460898e4e710ff3c85f249"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Export services
// export const auth = getAuth(app);


// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// Import the functions you need from the SDKs you need
// // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7bG3xi8f9hIAjfQ8bmZmDJ-Ak6DQ5s4M",
  authDomain: "echo-30b8b.firebaseapp.com",
  projectId: "echo-30b8b",
  storageBucket: "echo-30b8b.firebasestorage.app",
  messagingSenderId: "1053916309054",
  appId: "1:1053916309054:web:2a19fee59dd7e696a9536f",
  measurementId: "G-K5K35M9R25"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// const analytics = getAnalytics(app);