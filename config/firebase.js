
// config/firebase.js
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCDCSkX_VHiZvFtS4_mlMkhKm_qGN-asqg",
  authDomain: "mysimpleapp-e8492.firebaseapp.com",
  projectId: "mysimpleapp-e8492",
  storageBucket: "mysimpleapp-e8492.firebasestorage.app",
  messagingSenderId: "608623244726",
  appId: "1:608623244726:web:4134492e97347d36ef3d17",
  measurementId: "G-2GHC6V9GSS"
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Initialize Auth once
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (e) {
  auth = getAuth(app);
}

// Firestore
const db = getFirestore(app);

export { app, auth, db };





 



