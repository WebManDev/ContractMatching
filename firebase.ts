// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKzwGwWKOQ8vUdzZuflIMieJYKVivLK-s",
  authDomain: "contractmatch-ef2c5.firebaseapp.com",
  projectId: "contractmatch-ef2c5",
  storageBucket: "contractmatch-ef2c5.firebasestorage.app",
  messagingSenderId: "970578936002",
  appId: "1:970578936002:web:a3eed296badf5b28f1bb5b",
  measurementId: "G-84YB3L31NC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);