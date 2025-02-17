// filepath: /d:/File/CS Term 6/MobileWeb/MobileWebProject/Project_WebApp2024/teacher-web/src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import ClassroomList from "../components/ClassroomList";
import { createClassroom, updateClassroom, deleteClassroom } from "../services/classroomService";
import { doc, getDoc } from "firebase/firestore";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [subjectCode, setSubjectCode] = useState("");
  const [subjectName, setSubjectName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [editingClassroom, setEditingClassroom] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        //ดึงข้อมูลเพิ่มเติมของผู้ใช้จาก Firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  /*ฟังก์ชันเพิ่มห้องเรียน */
  const handleCreateClassroom = async () => {
    if (!user) return;
    if (!subjectCode || !subjectName || !roomName) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    try {
      const cid = await createClassroom(user.uid, subjectCode, subjectName, photoURL, roomName);
      alert(`สร้างห้องเรียนสำเร็จ! รหัสห้องเรียน: ${cid}`);
      resetForm();
    } catch (error) {
      console.error("Error creating classroom:", error);
      alert("ไม่สามารถสร้างห้องเรียนได้");
    }
  };

  /*ฟังก์ชันแก้ไขห้องเรียน */
  const handleEditClassroom = async () => {
    if (!editingClassroom) return;
    try {
      await updateClassroom(editingClassroom.id, {
        code: subjectCode,
        name: subjectName,
        photo: photoURL,
        room: roomName,
      });
      alert("อัปเดตห้องเรียนเรียบร้อย!");
      resetForm();
    } catch (error) {
      console.error("Error updating classroom:", error);
      alert("ไม่สามารถอัปเดตห้องเรียนได้");
    }
  };

  /*ฟังก์ชันลบห้องเรียน */
  const handleDeleteClassroom = async (cid) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบห้องเรียนนี้?")) return;
    try {
      await deleteClassroom(cid, user.uid);
      alert("ลบห้องเรียนสำเร็จ!");
    } catch (error) {
      console.error("Error deleting classroom:", error);
      alert("ไม่สามารถลบห้องเรียนได้");
    }
  };

  /*ฟังก์ชันเลือกห้องเรียนสำหรับแก้ไข */
  const handleSelectClassroom = (classroom) => {
    setEditingClassroom(classroom);
    setSubjectCode(classroom.info.code);
    setSubjectName(classroom.info.name);
    setRoomName(classroom.info.room);
    setPhotoURL(classroom.info.photo);
  };

  /*ฟังก์ชัน Reset Form */
  const resetForm = () => {
    setSubjectCode("");
    setSubjectName("");
    setRoomName("");
    setPhotoURL("");
    setEditingClassroom(null);
  };

  return (
    <div className="dashboard-container">
      {/*ส่วนโปรไฟล์ผู้ใช้ */}
      {user && (
        <div className="profile-card">
          <img
            src={userData?.photo || "https://via.placeholder.com/80"}
            alt="Profile"
          />
          <div>
            <h2>
              สวัสดี, {userData?.name || user.email.split("@")[0]}
            </h2>
            <p>{user.email}</p>
            <button
              onClick={() => navigate("/profile")}
            >
              แก้ไขข้อมูลส่วนตัว
            </button>
          </div>
        </div>
      )}

      <h1>Dashboard</h1>

      {/* ฟอร์มเพิ่ม/แก้ไขห้องเรียน */}
      {user && (
        <div className="form-container">
          <h2>
            {editingClassroom ? "แก้ไขห้องเรียน" : "เพิ่มห้องเรียน"}
          </h2>
          <input type="text" placeholder="รหัสวิชา" value={subjectCode} onChange={(e) => setSubjectCode(e.target.value)} />
          <input type="text" placeholder="ชื่อวิชา" value={subjectName} onChange={(e) => setSubjectName(e.target.value)} />
          <input type="text" placeholder="ชื่อห้องเรียน" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
          <input type="text" placeholder="URL รูปภาพ (ไม่บังคับ)" value={photoURL} onChange={(e) => setPhotoURL(e.target.value)} />
          
          {editingClassroom ? (
            <div className="mt-3 flex space-x-2">
              <button onClick={handleEditClassroom} className="edit-button">บันทึกการแก้ไข</button>
              <button onClick={resetForm} className="cancel-button">ยกเลิก</button>
            </div>
          ) : (
            <button onClick={handleCreateClassroom} className="create-button">เพิ่มห้องเรียน</button>
          )}
        </div>
      )}

      {/*รายชื่อห้องเรียน */}
      {user && (
        <ClassroomList uid={user.uid} onEdit={handleSelectClassroom} onDelete={handleDeleteClassroom} />
      )}
      
      {/*ปุ่มออกจากระบบ */}
      <button onClick={() => auth.signOut()} className="logout-button">
        ออกจากระบบ
      </button>
    </div>
  );
};

export default Dashboard;