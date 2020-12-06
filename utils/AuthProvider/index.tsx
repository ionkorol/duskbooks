import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import firebaseClient from "../firebaseClient";
import firebase from "firebase";

export const AuthContext = createContext<{
  user: firebase.firestore.DocumentData | null;
  error: string | null;
  signIn: (email: string, password: string) => void;
  signOut: () => void;
  signUp: (email: string, password: string) => void;
}>({
  user: null,
  error: null,
  signIn: null,
  signOut: null,
  signUp: null,
});

export default function AuthProvider({ children }: any) {
  const [user, setUser] = useState<firebase.firestore.DocumentData | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const getUser = (uid: string) => {
    firebaseClient
      .firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((userSnap) => setUser(userSnap.data()))
      .catch((error) => setError(error.message));
  };

  const signIn = (email: string, password: string) => {
    firebaseClient
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => setError(error.message));
  };

  const signUp = (email: string, password: string) => {
    firebaseClient
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((error) => setError(error.message));
  };

  const signOut = () => {
    firebaseClient
      .auth()
      .signOut()
      .catch((error) => setError(error.message));
  };

  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(() => {
    return firebaseClient.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        Cookies.remove("token");
      } else {
        const token = await user.getIdToken();
        getUser(user.uid);
        Cookies.set("token", token);
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebaseClient.auth().currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user, error, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}
