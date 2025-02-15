import React, { useState } from "react";
import { auth } from "../services/firebase"; // ตรวจสอบให้แน่ใจว่า `firebase.js` ถูกต้อง
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

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
      navigate("/"); // 🔄 นำผู้ใช้ไปที่ Dashboard หลังจากล็อกอิน
    } catch (err) {
      setError(err.message);
    }
  };

  // ฟังก์ชันล็อกอินด้วย Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border rounded-md"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">
            Login
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
