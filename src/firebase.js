import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCoIHM5ZQSaYwlqM-BAXLztOk8LfzvxzS8",
  authDomain: "city-ride-31b68.firebaseapp.com",
  projectId: "city-ride-31b68",
  storageBucket: "city-ride-31b68.firebasestorage.app",
  messagingSenderId: "768090682902",
  appId: "1:768090682902:web:b839d40ee35e565aade737",
  measurementId: "G-TMQDC1LZ76"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
