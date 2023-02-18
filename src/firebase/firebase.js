// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOeGpK_6SZCoXA2oboLSJwQOMYHBXu6kQ",
  authDomain: "peliculed-43e93.firebaseapp.com",
  projectId: "peliculed-43e93",
  storageBucket: "peliculed-43e93.appspot.com",
  messagingSenderId: "223588095983",
  appId: "1:223588095983:web:7f6897f43d74ccf225481a",
  measurementId: "G-CBG6RVXQ33"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
