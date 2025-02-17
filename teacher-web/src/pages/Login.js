// filepath: /d:/File/CS Term 6/MobileWeb/MobileWebProject/Project_WebApp2024/teacher-web/src/pages/Login.js
import React, { useState } from "react";
import { auth } from "../services/firebase"; // ตรวจสอบให้แน่ใจว่า `firebase.js` ถูกต้อง
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // เรียกใช้ไฟล์ Login.css

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ฟังก์ชันล็อกอินด้วย Email/Password
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard"); // 🔄 นำผู้ใช้ไปที่ Dashboard หลังจากล็อกอิน
    } catch (err) {
      setError(err.message);
    }
  };

  // ฟังก์ชันล็อกอินด้วย Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard"); // 🔄 นำผู้ใช้ไปที่ Dashboard หลังจากล็อกอิน
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Login</h2>
        
        {error && <p className="login-error">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="google-button"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;