import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyB9KSoBD8sGKHm3YemkQx2MpPt6th8N0r8",
    authDomain: "vitpat-9109d.firebaseapp.com",
    projectId: "vitpat-9109d",
    storageBucket: "vitpat-9109d.appspot.com",
    messagingSenderId: "746311304143",
    appId: "1:746311304143:web:9d4ed3cea4e8b3800208ba"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)


const firestore = getFirestore(app);
export { app, auth,firestore };

