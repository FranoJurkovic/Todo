import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, database } from '../firebaseconfing';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null); // Postavi tip za user stanje
  const [error, setError] = useState<string | null>(null); // Postavi tip za error stanje
  const [loading, setLoading] = useState<boolean>(true); // Postavi tip za loading stanje

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const register = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Spremljivanje dodatnih podataka u Firestore
      await setDoc(doc(database, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
      });

      setUser(user);
      setError(null);
    } catch (err: any) { // Dodaj tip za err
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      setError(null);
    } catch (err: any) { // Dodaj tip za err
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user, error, loading, register, login };
};