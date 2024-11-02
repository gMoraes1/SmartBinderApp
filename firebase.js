import firebase  from 'firebase/app';
import 'firebase/firestore';
import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyAYXy0tkHNsHmmKDmEFjRnwcdJDMDPKpcc",
    authDomain: "smartbinderbd.firebaseapp.com",
    projectId: "smartbinderbd",
    storageBucket: "smartbinderbd.appspot.com",
    messagingSenderId: "408806461317",
    appId: "1:408806461317:web:659e0af037379ce32f3eec"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  export const firestore = getFirestore(app);