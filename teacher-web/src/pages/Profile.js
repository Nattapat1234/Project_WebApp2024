import React, { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";

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
    <div className="p-5">
      <h1 className="text-xl font-bold">แก้ไขข้อมูลส่วนตัว</h1>

      {/* แสดงรูปโปรไฟล์ */}
      <div className="flex items-center mt-4">
        <img
          src={photo || "https://via.placeholder.com/100"}
          alt="Profile"
          className="w-24 h-24 rounded-full border mr-4"
        />
        <div>
          <p className="text-gray-600">อัปเดตรูปภาพโดยใช้ URL</p>
        </div>
      </div>

      {/* ฟอร์มแก้ไขข้อมูล */}
      <input
        type="text"
        placeholder="ชื่อ"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 border rounded-md mt-2"
      />
      <input
        type="text"
        placeholder="URL รูปโปรไฟล์"
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
        className="w-full p-2 border rounded-md mt-2"
      />

      {/*ปุ่มบันทึกข้อมูล */}
      <button
        onClick={handleSaveProfile}
        className="mt-3 w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        บันทึกข้อมูล
      </button>

      {/* ปุ่มลบบัญชี */}
      <button
        onClick={handleDeleteProfile}
        className="mt-3 w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
      >
        ลบบัญชีของฉัน
      </button>

      {/*ปุ่มกลับหน้าแรก */}
      <button
        onClick={() => navigate("/")}
        className="mt-3 w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600"
      >
        กลับหน้าแรก
      </button>
    </div>
  );
};

export default Profile;
