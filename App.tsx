// src/App.tsx
import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { auth } from "./firebase";

const App: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const register = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setMessage("Account created!");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Logged in!");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setMessage("Logged out!");
    } catch (error: any) {
      setMessage(error.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "1rem", textAlign: "center" }}>
      <h2>Firebase Auth Demo</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", margin: "8px auto", width: "100%" }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", margin: "8px auto", width: "100%" }}
      />
      <button onClick={register} style={{ marginRight: "8px" }}>Register</button>
      <button onClick={login} style={{ marginRight: "8px" }}>Login</button>
      <button onClick={logout}>Logout</button>

      <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>

      <p>{user ? `Logged in as: ${user.email}` : "Not logged in"}</p>
    </div>
  );
};

export default App;
