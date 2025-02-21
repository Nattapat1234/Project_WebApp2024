import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import { createCheckin, openCheckin, closeCheckin, saveCheckinScores, deleteStudent } from "../services/checkinService";
import { db } from "../services/firebase";
import QRCodeGenerator from "../components/QRCodeGenerator"; // ✅ ใช้ QRCode ใหม่

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
    <div className="p-5 bg-gray-700 min-h-screen text-white">
      <h1 className="text-2xl font-bold text-center">หน้าการเช็คชื่อ</h1>

      <div className="mt-3 p-2 rounded-md text-center font-bold">
        <span className={`p-2 rounded-md ${status === "open" ? "bg-green-500" : "bg-red-500"}`}>
          {status === "open" ? "✅ เปิดเช็คชื่ออยู่" : "❌ ปิดเช็คชื่อแล้ว"}
        </span>
      </div>

      <div className="mt-3 space-x-2">
        <button onClick={() => openCheckin(cid, cno)} className="bg-green-500 p-2 rounded-md">เปิดเช็คชื่อ</button>
        <button onClick={() => closeCheckin(cid, cno)} className="bg-red-500 p-2 rounded-md">ปิดเช็คชื่อ</button>
        <button onClick={() => saveCheckinScores(cid, cno)} className="bg-blue-500 p-2 rounded-md">บันทึกเช็คชื่อ</button>
        <Link to={`/classroom/${cid}/question`} className="bg-yellow-500 p-2 rounded-md">ถาม-ตอบ</Link>
      </div>

      {/* ✅ ใช้ QR Code ใหม่สำหรับเช็คชื่อ */}
      {cno && <QRCodeGenerator cid={cid} cno={cno} type="checkin" />}

      <h2 className="mt-5 text-lg font-semibold">รายชื่อนักเรียน</h2>
      <ul>
        {students.map((student, index) => (
          <li key={student.id} className="p-2 bg-gray-800 mt-2 flex justify-between">
            {index + 1}. {student.stdid} - {student.name}
            <button onClick={() => deleteStudent(cid, cno, student.id)} className="bg-red-500 p-1 rounded-md">ลบ</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checkin;
