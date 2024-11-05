import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Certifique-se de que está aqui
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYXy0tkHNsHmmKDmEFjRnwcdJDMDPKpcc",
  authDomain: "smartbinderbd.firebaseapp.com",
  projectId: "smartbinderbd",
  storageBucket: "smartbinderbd.appspot.com",
  messagingSenderId: "408806461317",
  appId: "1:408806461317:web:659e0af037379ce32f3eec",
};

// Inicializar o app Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth com AsyncStorage
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Inicializar Firestore
export const db = getFirestore(app); 
