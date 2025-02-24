// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8oF--DbGjeAeaoOD_zWd22ZuoxhnezzM",
  authDomain: "project-web2024.firebaseapp.com",
  projectId: "project-web2024",
  storageBucket: "project-web2024.firebasestorage.app",
  messagingSenderId: "702664470322",
  appId: "1:702664470322:web:00eca43684898b066e312b",
  measurementId: "G-9CLDZHC6PH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);