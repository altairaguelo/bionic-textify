//test

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoCr-DLRJeL4AZP1SQxfRq1NF7fKWTLG4",
  authDomain: "bionic-textify.firebaseapp.com",
  databaseURL: "https://bionic-textify-default-rtdb.firebaseio.com",
  projectId: "bionic-textify",
  storageBucket: "bionic-textify.firebasestorage.app",
  messagingSenderId: "686491080725",
  appId: "1:686491080725:web:33b7e2c44503bcf4ef161c",
  measurementId: "G-DN46CQB16F"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);

signInAnonymously(auth).catch(console.error);