import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard"; // ✅ ตรวจสอบ path ให้ถูกต้อง
import Classroom from "./pages/Classroom";
import Checkin from "./pages/Checkin";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Question from "./pages/Question";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classroom/:cid" element={<Classroom />} />
        <Route path="/classroom/:cid/checkin/:cno" element={<Checkin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/classroom/:cid/checkin" element={<Checkin />} />
        <Route path="/classroom/:cid/question" element={<Question />} />
      </Routes>
    </Router>
  );
}

export default App;
