import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { createCheckin, openCheckin, closeCheckin, saveCheckinScores, deleteStudent } from "../services/checkinService";
import { db } from "../services/firebase";
import QRCodeGenerator from "../components/QRCodeGenerator";
import "../styles/Checkin.css"; // ✅ ใช้ไฟล์ CSS

const Checkin = () => {
  const { cid } = useParams();
  const [cno, setCno] = useState(null);
  const [status, setStatus] = useState("loading");
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCheckin = async () => {
      const checkinRef = collection(db, "classroom", cid, "checkin");
      const snapshot = await getDocs(checkinRef);

      if (!snapshot.empty) {
        const latestCheckin = snapshot.docs[snapshot.docs.length - 1];
        setCno(latestCheckin.id);
        setStatus(latestCheckin.data().status);
      } else {
        const newCno = await createCheckin(cid);
        setCno(newCno);
        setStatus("open");
      }
    };

    fetchCheckin();
  }, [cid]);

  useEffect(() => {
    if (!cid || !cno) return;

    const checkinRef = doc(db, "classroom", cid, "checkin", cno);
    const unsubscribeCheckin = onSnapshot(checkinRef, (snapshot) => {
      if (snapshot.exists()) {
        setStatus(snapshot.data().status);
      }
    });

    const studentsRef = collection(db, "classroom", cid, "checkin", cno, "students");
    const unsubscribeStudents = onSnapshot(studentsRef, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      unsubscribeCheckin();
      unsubscribeStudents();
    };
  }, [cid, cno]);

  return (
    <div className="checkin-container">
      <h1 className="checkin-title">หน้าการเช็คชื่อ</h1>

      <div className="checkin-status">
        <span className={`status-badge ${status === "open" ? "status-open" : "status-closed"}`}>
          {status === "open" ? "✅ เปิดเช็คชื่ออยู่" : "❌ ปิดเช็คชื่อแล้ว"}
        </span>
      </div>

      <div className="checkin-actions">
        <button onClick={() => openCheckin(cid, cno)} className="btn btn-open">เปิดเช็คชื่อ</button>
        <button onClick={() => closeCheckin(cid, cno)} className="btn btn-close">ปิดเช็คชื่อ</button>
        <button onClick={() => saveCheckinScores(cid, cno)} className="btn btn-save">บันทึกเช็คชื่อ</button>
        <Link to={`/classroom/${cid}/question`} className="btn btn-question">ถาม-ตอบ</Link>
      </div>

      {/* ✅ ใช้ QR Code ใหม่สำหรับเช็คชื่อ */}
      {cno && <QRCodeGenerator cid={cid} cno={cno} type="checkin" />}

      <h2 className="student-list-title">รายชื่อนักเรียน</h2>
      <ul className="student-list">
        {students.map((student, index) => (
          <li key={student.id} className="student-item">
            {index + 1}. {student.stdid} - {student.name}
            <button onClick={() => deleteStudent(cid, cno, student.id)} className="btn btn-delete">ลบ</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checkin;
