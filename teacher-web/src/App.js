import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Classroom from "./pages/Classroom";
import Checkin from "./pages/Checkin";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Question from "./pages/Question"; // ✅ Import หน้า Question
import CheckinDetail from "./pages/CheckinDetail";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/classroom/:cid" element={<Classroom />} />

        {/* ✅ Route สำหรับหน้า Check-in และรายละเอียด Check-in */}
        <Route path="/classroom/:cid/checkin" element={<Checkin />} />
        <Route path="/classroom/:cid/checkin/:cno" element={<CheckinDetail />} />

        {/* ✅ Route ใหม่สำหรับหน้าถาม-ตอบของแต่ละรอบเช็คชื่อ */}
        <Route path="/classroom/:cid/checkin/:cno/question" element={<Question />} />
      </Routes>
    </Router>
  );
}

export default App;
