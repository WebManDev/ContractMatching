// src/AuthPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  doc, setDoc,
  collection, query, where, getDocs
} from "firebase/firestore";
import { auth, db } from "./firebase";

export default function AuthPage() {
  const nav = useNavigate();
  const [authMode, setAuthMode] = useState<"signin"|"signup">("signup");
  const [role, setRole] = useState<"realtor"|"contractor">("realtor");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    if (password !== confirm) {
      setMessage("Passwords must match");
      return;
    }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: username });
      await setDoc(doc(db, `${role}s`, cred.user.uid), {
        id: cred.user.uid,
        username,
        email,
        role,
        connections: []
      });
      nav("/dashboard");
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  const handleLogin = async () => {
    try {
      let emailToUse = email;
      if (!email.includes("@")) {
        let q = query(collection(db, "realtors"), where("username","==",email));
        let snap = await getDocs(q);
        if (snap.empty) {
          q = query(collection(db, "contractors"), where("username","==",email));
          snap = await getDocs(q);
        }
        if (snap.empty) throw new Error("User not found");
        emailToUse = snap.docs[0].data().email;
      }
      await signInWithEmailAndPassword(auth, emailToUse, password);
      nav("/dashboard");
    } catch (e: any) {
      setMessage(e.message);
    }
  };

  return (
    <div style={{ maxWidth:400, margin:"2rem auto", textAlign:"center" }}>
      <h2>ContractMatch</h2>
      <div>
        <button onClick={()=>setAuthMode("signin")} disabled={authMode==="signin"}>Sign In</button>
        <button onClick={()=>setAuthMode("signup")} disabled={authMode==="signup"}>Sign Up</button>
      </div>
      {authMode === "signup" ? (
        <>
          <div>
            <button onClick={()=>setRole("realtor")} style={{ fontWeight: role==="realtor"?"bold":"normal" }}>Realtor</button>
            <button onClick={()=>setRole("contractor")} style={{ fontWeight: role==="contractor"?"bold":"normal" }}>Contractor</button>
          </div>
          <input placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} />
          <input placeholder="Email"    value={email}    onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password"        value={password} onChange={e=>setPassword(e.target.value)} />
          <input type="password" placeholder="Confirm password" value={confirm}  onChange={e=>setConfirm(e.target.value)} />
          <button onClick={handleRegister}>Create Account</button>
        </>
      ) : (
        <>
          <input placeholder="Username or Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          <button onClick={handleLogin}>Sign In</button>
          <div style={{ marginTop:20, padding:10, border:"1px solid #eee" }}>
            <h4>Demo Credentials</h4>
            <p><strong>Realtor</strong><br/>emma / realtor123</p>
            <p><strong>Contractor</strong><br/>john / contractor123</p>
          </div>
        </>
      )}
      {message && <p style={{ color:"red" }}>{message}</p>}
    </div>
  );
}
