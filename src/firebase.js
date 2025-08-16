import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyBj3tw6bOD4Nl6hh_vtODNszj9MXTfYicI",
  authDomain: "courseapp-8b8f2.firebaseapp.com",
  projectId: "courseapp-8b8f2",
  storageBucket: "courseapp-8b8f2.firebasestorage.app",
  messagingSenderId: "370718828790",
  appId: "1:370718828790:web:219cf7b14b34f99f3ee4d7"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
