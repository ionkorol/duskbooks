import Cookies from "js-cookie";
import { createContext, useEffect, useState } from "react";
import firebaseClient from "../firebaseClient";
import firebase from "firebase";
import { useRouter } from "next/router";
import { FirebaseUserProp, UserProp } from "../interfaces";

export const AuthContext = createContext<{
  user: UserProp | null;
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
  const [user, setUser] = useState<UserProp | null>(null);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const getUser = (user: firebaseClient.User) => {
    if (user.isAnonymous) {
      setUser({
        data: null,
        credentials: user,
      });
    } else {
      firebaseClient
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then((userSnap) =>
          setUser({
            data: userSnap.data() as FirebaseUserProp,
            credentials: user,
          })
        )
        .catch((error) => {
          setError(error.message);
        });
    }
  };

  const signIn = (email: string, password: string) => {
    firebaseClient
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        router.push("/account");
      })
      .catch((error) => setError(error.message));
  };

  const signUp = (email: string, password: string) => {
    firebaseClient
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        router.push("/account");
      })
      .catch((error) => setError(error.message));
  };

  const signOut = () => {
    firebaseClient
      .auth()
      .signOut()
      .then(() => {
        router.push("/auth/signin");
      })
      .catch((error) => setError(error.message));
  };

  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(() => {
    return firebaseClient.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        const user = await firebaseClient.auth().signInAnonymously();
        getUser(user.user);
        Cookies.set("token", user.user.getIdToken());
      } else {
        const token = await user.getIdToken();
        getUser(user);
        Cookies.set("token", token);
      }
    });
  }, []);

  // Force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebaseClient.auth().currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // Clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user, error, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
}
