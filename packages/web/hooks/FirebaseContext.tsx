import { Analytics, getAnalytics } from 'firebase/analytics';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signInWithRedirect, signOut } from 'firebase/auth';
import React, { useContext, useEffect, useState } from 'react';

// all the IDs and keys here are okay to be exposed to public
const firebaseConfig = {
  apiKey: 'AIzaSyCCkGwgj9ClfbUuBI3Hygdg5npdGyBWMfw',
  authDomain: 'aicmd-a1065.firebaseapp.com',
  projectId: 'aicmd-a1065',
  storageBucket: 'aicmd-a1065.appspot.com',
  messagingSenderId: '758692303030',
  appId: '1:758692303030:web:8e6ad00ee0e92f837f1617',
  measurementId: 'G-1G0239E28M',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

interface IFirebaseContextData {
  app: FirebaseApp;
  analytics: Analytics | null;
  user: IUser | null;
  loadingAuth: boolean;
  getIdToken: () => Promise<string | null>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

interface IUser {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  displayName: string | null;
  photoURL: string | null;
}

const FirebaseContext = React.createContext<IFirebaseContextData>({
  app,
  analytics: null,
  user: null,
  loadingAuth: true,
  getIdToken: () => Promise.reject(),
  signInWithGoogle: () => Promise.reject(),
  signOut: () => Promise.reject(),
});

interface IProps {
  children: React.ReactNode | React.ReactNode[];
}

export const FirebaseContextProvider = (props: IProps) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const analytics = getAnalytics(app);
    setAnalytics(analytics);

    return onAuthStateChanged(auth, (user) => {
      if (user && user.uid) {
        setUser({
          uid: user.uid,
          email: user.email,
          emailVerified: user.emailVerified || false,
          displayName: user.displayName,
          photoURL: user.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });
  }, []);

  return (
    <FirebaseContext.Provider
      value={{
        app,
        analytics,
        user,
        loadingAuth,
        getIdToken: async () => {
          const idToken = await auth.currentUser?.getIdToken();
          return idToken ?? null;
        },
        signInWithGoogle: () => {
          const provider = new GoogleAuthProvider();
          return signInWithRedirect(auth, provider);
        },
        signOut: () => {
          return signOut(auth);
        },
      }}
    >
      {props.children}
    </FirebaseContext.Provider>
  );
};

export const useFirebaseContext = () => {
  return useContext(FirebaseContext);
};
