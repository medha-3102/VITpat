import { auth, firestore } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";

import { useState, useEffect } from "react";

// Function to display a message popup
const showMessagePopup = (message) => {
  // Implement your message popup logic here, such as using a toast or a modal
  alert(message); // For demonstration purposes, using a simple alert
};

export const doCreateUserWithEmailAndPassword = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await addUserDataToFirestore(userCredential.user.uid, email, name);
    return userCredential;
  } catch (error) {
    // Handle specific authentication errors
    switch (error.code) {
      case 'auth/email-already-in-use':
        showMessagePopup('Email already exists. Please try with a different email.');
        break;
      case 'auth/weak-password':
        showMessagePopup('Password is too weak. Please use a stronger password.');
        break;
      default:
        showMessagePopup('An error occurred during registration. Please try again later.');
    }
    // Prevent re-throwing the error
    return null;
  }
};

export const doSignInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true; // Sign in successful
  } catch (error) {
    // Handle specific authentication errors

        showMessagePopup('Invalid email or password. Please try again.');
        
   
    
    // Prevent re-throwing the error
    return false;
  }
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

export const doSignOut = async () => {
  await auth.signOut();
};
export const useSignOutMessage = () => {
  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await auth.signOut();
        showMessagePopup('You have been successfully signed out.');
      } catch (error) {
        console.error('Error occurred during sign-out:', error);
      }
    };

    handleSignOut();
  }, []);
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
