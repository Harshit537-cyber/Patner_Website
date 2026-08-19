import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBTE0OFRibSmhcqFsU3n7P6-gCV2Jdqz3k",
  authDomain: "astroshriyam.firebaseapp.com",
  projectId: "astroshriyam",
  storageBucket: "astroshriyam.firebasestorage.app",
  messagingSenderId: "256699637886",
  appId: "1:256699637886:web:0a81fb7349ea7d2cdd782f",
  measurementId: "G-11NM1H97F2",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;