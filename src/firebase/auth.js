import { auth, firestore } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

export const doCreateUserWithEmailAndPassword = async (email, password, name) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await addUserDataToFirestore(userCredential.user.uid, email, name);
  return userCredential;
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  const user = result.user;

  // Add user's email, name, and password to Firestore
  try {
    await addUserDataToFirestore(user.uid, user.email, user.displayName || 'Google User');
    console.log("Google authenticated user added to Firestore successfully");
  } catch (error) {
    console.error('Error adding Google authenticated user to Firestore: ', error);
  }
};

export const doSignOut = () => {
  return auth.signOut();
};

export const doPasswordReset = (email) => {
  return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {
  return updatePassword(auth.currentUser, password);
};

export const doSendEmailVerification = () => {
  return sendEmailVerification(auth.currentUser, {
    url: `${window.location.origin}/planner`,
  });
};

const addUserDataToFirestore = async (uid, email, name) => {
  try {
    await addDoc(collection(firestore, 'students'), { uid, email, name });
    console.log("User added to Firestore successfully");
  } catch (error) {
    console.error('Error adding user to Firestore: ', error);
  }
};
