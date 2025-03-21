// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,setPersistence, browserLocalPersistence, GoogleAuthProvider} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/compat/app";
import { getFirestore } from "firebase/firestore"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPffiCDmqS344LZzsLhD0J2fLCMCXSfn0",
  authDomain: "fyp-2025-3637b.firebaseapp.com",
  projectId: "fyp-2025-3637b",
  storageBucket: "fyp-2025-3637b.firebasestorage.app",
  messagingSenderId: "962714965836",
  appId: "1:962714965836:web:b871d2e8f03e68494de1e9",
  measurementId: "G-6H7XJ96RJJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const analytics = getAnalytics(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence);

export { auth, provider,db };