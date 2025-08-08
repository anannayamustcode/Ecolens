// app/contexts/AuthContext.tsx
"use client"; // Add this directive

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from './firebase/config'; // Update this path to your Firebase config

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<any>;
  logIn: (email: string, password: string) => Promise<any>;
  logOut: () => Promise<void>;
  updateUserProfile: (profile: { displayName?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const signUp = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = () => {
    return signOut(auth);
  };

  const updateUserProfile = (profile: { displayName?: string }) => {
    if (!auth.currentUser) throw new Error('No user logged in');
    return updateProfile(auth.currentUser, profile);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    signUp,
    logIn,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// // contexts/AuthContext.js
// import { createContext, useContext, useEffect, useState } from 'react';
// import { 
//   createUserWithEmailAndPassword, 
//   signInWithEmailAndPassword, 
//   signOut, 
//   onAuthStateChanged,
//   updateProfile
// } from 'firebase/auth';
// import { auth } from '../firebase';

// const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   function signUp(email, password) {
//     return createUserWithEmailAndPassword(auth, email, password);
//   }

//   function logIn(email, password) {
//     return signInWithEmailAndPassword(auth, email, password);
//   }

//   function logOut() {
//     return signOut(auth);
//   }

//   function updateUserProfile(profile) {
//     return updateProfile(auth.currentUser, profile);
//   }

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ 
//       signUp, 
//       logIn, 
//       logOut, 
//       updateUserProfile,
//       user, 
//       loading 
//     }}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   return useContext(AuthContext);
// }// // src/contexts/AuthContext.jsx


// // import { createContext, useContext, useEffect, useState } from 'react';
// // import { 
// //   getAuth, 
// //   createUserWithEmailAndPassword, 
// //   signInWithEmailAndPassword, 
// //   signOut, 
// //   onAuthStateChanged 
// // } from 'firebase/auth';
// // import { auth } from '../firebase';

// // const AuthContext = createContext();

// // export function AuthProvider({ children }) {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true); // ✅ ADD THIS

// //   function signUp(email, password) {
// //     return createUserWithEmailAndPassword(auth, email, password);
// //   }

// //   function logIn(email, password) {
// //     return signInWithEmailAndPassword(auth, email, password);
// //   }

// //   function logOut() {
// //     return signOut(auth);
// //   }

// //   useEffect(() => {
// //     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
// //       setUser(currentUser);
// //       setLoading(false); // ✅ FIXED: now this works
// //     });
// //     return () => unsubscribe();
// //   }, []);

// //   return (
// //     <AuthContext.Provider value={{ signUp, logIn, logOut, user, loading }}>
// //       {!loading && children} {/* ✅ Prevent rendering until auth is ready */}
// //     </AuthContext.Provider>
// //   );
// // }

// // export function useAuth() {
// //   return useContext(AuthContext);
// // }
