// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "auctionit-997a2.firebaseapp.com",
  projectId: "auctionit-997a2",
  storageBucket: "auctionit-997a2.appspot.com",
  messagingSenderId: "946243062492",
  appId: "1:946243062492:web:f1cd5a2c65f9b92c89c219"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);