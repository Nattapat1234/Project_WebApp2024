import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, collection, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../services/firebase";
import "../styles/CheckinDetail.css";

const CheckinDetail = () => {
  const { cid, cno } = useParams();
  const navigate = useNavigate();
  const [checkinInfo, setCheckinInfo] = useState(null);
  const [students, setStudents] = useState([]);

  /** โหลดข้อมูลการเช็คชื่อ */
  useEffect(() => {
    if (!cid || !cno) return;

    const fetchCheckinData = async () => {
      try {
        const checkinRef = doc(db, "classroom", cid, "checkin", cno);
        const checkinSnap = await getDoc(checkinRef);

        if (checkinSnap.exists()) {
          setCheckinInfo(checkinSnap.data());
        } else {
          console.error("❌ ไม่พบข้อมูลรอบเช็คชื่อ");
        }
      } catch (error) {
        console.error("❌ เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchCheckinData();
  }, [cid, cno]);

  /** โหลดรายชื่อนักเรียนที่เช็คชื่อแบบ Realtime */
  useEffect(() => {
    if (!cid || !cno) return;

    const studentsRef = collection(db, "classroom", cid, "checkin", cno, "students");
    const unsubscribeStudents = onSnapshot(studentsRef, (snapshot) => {
      setStudents(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          stdid: data.stdid,
          checkinTime: data.checkinTime?.toDate ? data.checkinTime.toDate().toLocaleString() : "ไม่มีข้อมูลเวลา" // ✅ แปลง Timestamp
        };
      }));
    });

    return () => unsubscribeStudents();
  }, [cid, cno]);

  return (
    <div className="checkin-detail-container">
      <h1 className="checkin-title">รายละเอียดการเช็คชื่อ</h1>

      {checkinInfo ? (
        <div className="checkin-card">
          <div className="checkin-header">
            <p>เช็คชื่อรอบที่ {cno} วันที่ {new Date(checkinInfo.date).toLocaleDateString()} 
            เวลา {new Date(checkinInfo.date).toLocaleTimeString()}</p>
          </div>
          <div className="checkin-body">
            <div className="checkin-status">
              <span className={`status-label ${checkinInfo.status === "open" ? "status-open" : "status-closed"}`}>
                {checkinInfo.status === "open" ? "เปิดอยู่" : "ปิดแล้ว"}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}

      <h2 className="student-list-title">รายชื่อนักเรียนที่เช็คชื่อ</h2>
      <div className="student-list-container">
        {students.length > 0 ? (
          students.map((student, index) => (
            <div key={student.id} className="student-item">
              <p>{index + 1}. {student.stdid} - {student.name}</p>
              <span className="checkin-time">เช็คชื่อเมื่อ: {student.checkinTime}</span>
            </div>
          ))
        ) : (
          <p className="no-student-text">ยังไม่มีนักเรียนที่เช็คชื่อ</p>
        )}
      </div>

      <button onClick={() => navigate(-1)} className="btn btn-back">ย้อนกลับ</button>
    </div>
  );
};

export default CheckinDetail;
