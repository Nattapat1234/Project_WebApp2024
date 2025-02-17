import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import "../styles/Profile.css";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/login");
      return;
    }
    setUser(auth.currentUser);

    const fetchUserData = async () => {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        setName(userData.name || "");
        setPhoto(userData.photo || "");
      } else {
        console.log("⚠️ ไม่มีข้อมูลผู้ใช้ใน Firestore");
      }
    };

    fetchUserData();
  }, [navigate]);

  /** ฟังก์ชันบันทึกข้อมูล */
  const handleSaveProfile = async () => {
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        //  อัปเดตข้อมูลหากมีเอกสารอยู่แล้ว
        await updateDoc(userRef, { name, photo });
      } else {
        //  สร้างเอกสารใหม่หากยังไม่มี
        await setDoc(userRef, { name, photo });
      }

      alert("บันทึกข้อมูลสำเร็จ!");
    } catch (error) {
      console.error("🔥 Error updating profile:", error);
      alert("ไม่สามารถบันทึกข้อมูลได้");
    }
  };

  /** ฟังก์ชันลบข้อมูลผู้ใช้ */
  const handleDeleteProfile = async () => {
    if (!window.confirm(" คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีของคุณ?")) return;

    try {
      // รีโหลดผู้ใช้ก่อนการลบ
      await auth.currentUser.reload();

      // ลบข้อมูลใน Firestore
      await deleteDoc(doc(db, "users", user.uid));

      // ลบบัญชีจาก Firebase Authentication
      await auth.currentUser.delete();

      alert("บัญชีของคุณถูกลบเรียบร้อยแล้ว!");
      navigate("/login");
    } catch (error) {
      console.error(" Error deleting profile:", error);
      alert("ไม่สามารถลบบัญชีได้ โปรดลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">แก้ไขข้อมูลส่วนตัว</h1>

      <div className="profile-picture-container">
        <img
          src={photo || "https://via.placeholder.com/100"}
          alt="Profile"
          className="profile-image"
        />
        <div>
          <p className="profile-text">อัปเดตรูปภาพโดยใช้ URL</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="ชื่อ"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="profile-input"
      />
      <input
        type="text"
        placeholder="URL รูปโปรไฟล์"
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
        className="profile-input"
      />

      <button onClick={handleSaveProfile} className="save-btn">
        บันทึกข้อมูล
      </button>

      <button onClick={handleDeleteProfile} className="delete-btn">
        ลบบัญชีของฉัน
      </button>

      <button onClick={() => navigate("/dashboard")} className="back-btn">
        กลับหน้าแรก
      </button>
    </div>
  );
};

export default Profile;
