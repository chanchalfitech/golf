import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCfhY84RHXd-Nd13bY9_mr9sHIAB9XWfhk",
  authDomain: "bitesize-golf.firebaseapp.com",
  projectId: "bitesize-golf",
  storageBucket: "bitesize-golf.firebasestorage.app",
  messagingSenderId: "552392197011",
  appId: "1:552392197011:web:2d0eb9d9fa8d3472989e66",
  measurementId: "G-WSY3M6M9P4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);