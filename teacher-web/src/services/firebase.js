import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyD8oF--DbGjeAeaoOD_zWd22ZuoxhnezzM",
    authDomain: "project-web2024.firebaseapp.com",
    projectId: "project-web2024",
    storageBucket: "project-web2024.firebasestorage.app",
    messagingSenderId: "702664470322",
    appId: "1:702664470322:web:9d9af9fc2d251b8f6e312b",
    measurementId: "G-PD47D82DBR"
  };

firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export default firebase;
