// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDynDQQyzjnUgX1J7M83WmTE6Ne8Q4un38",
  authDomain: "recipe-database-6d6eb.firebaseapp.com",
  projectId: "recipe-database-6d6eb",
  storageBucket: "recipe-database-6d6eb.firebasestorage.app",
  messagingSenderId: "799661729346",
  appId: "1:799661729346:web:665c04e58c99c7bf40efdb",
  measurementId: "G-T1C51ZVNP7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

