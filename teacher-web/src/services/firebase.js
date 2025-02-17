import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD8oF--DbGjeAeaoOD_zWd22ZuoxhnezzM",
    authDomain: "project-web2024.firebaseapp.com",
    projectId: "project-web2024",
    storageBucket: "project-web2024.appspot.com",
    messagingSenderId: "702664470322",
    appId: "1:702664470322:web:9d9af9fc2d251b8f6e312b",
    measurementId: "G-PD47D82DBR"
};

// สร้าง Firebase App
const app = initializeApp(firebaseConfig);

// ใช้งาน Firebase Auth และ Firestore
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
