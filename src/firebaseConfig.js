// firebaseConfig.js
import firebase from "firebase/compat/app";
import "firebase/database"; // if using Firebase Realtime Database
import "firebase/auth"; // if using Firebase Authentication

const firebaseConfig = {
  apiKey: "AIzaSyBG0ewYSt_pttcOsU8NDzvi12cpVKxCJW0",
  authDomain: "todolist-ea761.firebaseapp.com",
  projectId: "todolist-ea761",
  storageBucket: "todolist-ea761.appspot.com",
  messagingSenderId: "3931707408",
  appId: "1:3931707408:web:7194a257c8eb2ffe7b5295",
  measurementId: "G-L4Z2P4HY1J",
};

// Initialize Firebase
export const fireApp = firebase.initializeApp(firebaseConfig);

