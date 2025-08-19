import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDfmgWWhJlccc02-j40-9tPsy4P9Vu8IW0",
  authDomain: "naturocare-ce0ca.firebaseapp.com",
  projectId: "naturocare-ce0ca",
  storageBucket: "naturocare-ce0ca.firebasestorage.app",
  messagingSenderId: "157295915835",
  appId: "1:157295915835:web:134faab4cf3158ab133d1e",
  measurementId: "G-8RDXGW5DC0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };