import { initializeApp } from "firebase/app";
// eslint-disable-next-line
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBxfO-MAOz8EAvZu4KY7yeD6fxN95IQjLs",
  authDomain: "todo-e553d.firebaseapp.com",
  projectId: "todo-e553d",
  storageBucket: "todo-e553d.firebasestorage.app",
  messagingSenderId: "726812610191",
  appId: "1:726812610191:web:4a576537ed6ceefa46eafa",
  measurementId: "G-V7Q0RN58SF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

export { app, auth, database };