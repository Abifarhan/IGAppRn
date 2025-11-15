// Replace the below config with your Firebase project credentials
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCetp1TvKxEbyvjmXeP_v2Gk-U5uWgwGww",
  authDomain: "myinstagram-e724b.firebaseapp.com",
  projectId: "myinstagram-e724b",
  storageBucket: "myinstagram-e724b.firebasestorage.app",
  messagingSenderId: "228649095030",
  appId: "1:228649095030:web:636e781fc32ca0d82db457",
  measurementId: "G-455Q7JGTRR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
