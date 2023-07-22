// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use

const firebaseConfig = {
  apiKey: "AIzaSyC241pF7yHOEjQHK8Y_86RdMXbgEkEgbGI",
  authDomain: "react-qrcode-generator.firebaseapp.com",
  projectId: "react-qrcode-generator",
  storageBucket: "react-qrcode-generator.appspot.com",
  messagingSenderId: "359546481644",
  appId: "1:359546481644:web:304db90d2ff34fcb242ec9",
  measurementId: "G-8BQKX4JG7D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
