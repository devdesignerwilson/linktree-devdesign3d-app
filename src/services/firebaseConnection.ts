import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDKYq7Nqlemw-C1-sNmYEm-nvbFxdl2vJY",
  authDomain: "devdesigner-linktree.firebaseapp.com",
  projectId: "devdesigner-linktree",
  storageBucket: "devdesigner-linktree.firebasestorage.app",
  messagingSenderId: "146529035196",
  appId: "1:146529035196:web:d084b3917d0894bc6941b9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
