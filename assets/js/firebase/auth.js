import { auth } from './firebase/app.js';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

export async function login(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error de autenticación:", error);
    throw error;
  }
}

export async function register(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error de registro:", error);
    throw error;
  }
}