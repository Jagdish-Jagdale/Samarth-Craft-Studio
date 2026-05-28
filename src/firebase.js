// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpx0Tj38AgzN2cnYeh6rn6p3JpWkg4aG8",
  authDomain: "kolhapuri-chappals-56bdc.firebaseapp.com",
  projectId: "kolhapuri-chappals-56bdc",
  storageBucket: "kolhapuri-chappals-56bdc.firebasestorage.app",
  messagingSenderId: "888767512643",
  appId: "1:888767512643:web:2b23cf46cf908e268714f6",
  measurementId: "G-49S6NPNGNP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);

export { app, analytics, auth, db, functions, storage };
