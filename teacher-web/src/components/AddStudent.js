
import React, { useState } from "react";
import { db } from "../services/firebase";
import { doc, setDoc, collection } from "firebase/firestore";

const AddStudent = ({ cid }) => {
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");

  const handleAddStudent = async () => {
    if (!studentId || !studentName) return alert("กรุณากรอกข้อมูลให้ครบ");
    try {
      const studentRef = doc(collection(db, `classroom/${cid}/students`));
      await setDoc(studentRef, {
        stdid: studentId,
        name: studentName,
        status: 0, // 0 = ยังไม่อนุมัติ
      });
      alert("เพิ่มนักเรียนสำเร็จ!");
      setStudentId("");
      setStudentName("");
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      alert("ไม่สามารถเพิ่มนักเรียนได้");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="รหัสนักเรียน"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <input
        type="text"
        placeholder="ชื่อนักเรียน"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <button onClick={handleAddStudent}>เพิ่มนักเรียน</button>
    </div>
  );
};

export default AddStudent; // ✅ ตรวจสอบว่า export ถูกต้อง
