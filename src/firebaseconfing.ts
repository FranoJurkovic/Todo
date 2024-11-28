import { initializeApp } from "firebase/app";
// eslint-disable-next-line
import { getAnalytics } from "firebase/analytics"
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

if (
  !firebaseConfig.apiKey ||
  !firebaseConfig.authDomain ||
  !firebaseConfig.projectId ||
  !firebaseConfig.storageBucket ||
  !firebaseConfig.messagingSenderId ||
  !firebaseConfig.appId ||
  !firebaseConfig.measurementId
) {
  console.error("FirebaseConfing ne radi.");
} else {
  console.log("FirebaseConfing radi.");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getFirestore(app);

export { app, auth, database };