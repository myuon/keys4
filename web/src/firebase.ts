// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD2MeK8VyY1ywRMjwF4rX16X7yUoiMsyvo",
  authDomain: "keys4-ebdd8.firebaseapp.com",
  projectId: "keys4-ebdd8",
  storageBucket: "keys4-ebdd8.appspot.com",
  messagingSenderId: "992824461113",
  appId: "1:992824461113:web:e943dcd300a24fd2f74ae8",
  measurementId: "G-PJK9S9PM8V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
