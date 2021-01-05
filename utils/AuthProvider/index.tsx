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
  signUp: (firstName: string, lastName: string, email: string, password: string) => void;
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
  const getUser = async (user: firebaseClient.User) => {
    // Create The Shopping Cart
    const shoppingCartSnap = await firebaseClient
      .firestore()
      .collection("shoppingCarts")
      .doc(user.uid)
      .get();
    if (!shoppingCartSnap.exists) {
      await shoppingCartSnap.ref.set({
        id: user.uid,
      });
    }
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

  const signUp = (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => {
    firebaseClient
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        firebaseClient
          .firestore()
          .collection("users")
          .doc(user.user.uid)
          .set(
            {
              firstName,
              lastName,
              email,
            },
            { merge: true }
          )
          .catch((error) => setError(error.message));
      })
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
        router.push("/auth");
      })
      .catch((error) => setError(error.message));
  };

  const changePassword = () => {
    firebaseClient.auth();
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
