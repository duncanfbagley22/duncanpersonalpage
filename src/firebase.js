// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Import Firebase Storage
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQn0seQsyNBWZyQC7yJbPHVASMvGpQXzg",
  authDomain: "duncan-personal-page.firebaseapp.com",
  projectId: "duncan-personal-page",
  storageBucket: "duncan-personal-page.appspot.com",
  messagingSenderId: "361252486469",
  appId: "1:361252486469:web:a76e8daa1d00a877f5922c",
  measurementId: "G-N11X1ES6L8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app); // Initialize storage
const db = getFirestore(app);

export { app, db, storage };