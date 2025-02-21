import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, onSnapshot, deleteDoc } from "firebase/firestore";
import QRCodeGenerator from "../components/QRCodeGenerator";
import AddStudent from "../components/AddStudent";
import "../styles/Classroom.css";

const Classroom = () => {
  const { cid } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchClassroom = async () => {
      const classroomRef = doc(db, "classroom", cid);
      const docSnap = await getDoc(classroomRef);

      if (docSnap.exists()) {
        setClassroom(docSnap.data());
      } else {
        console.log("ไม่มีข้อมูลห้องเรียนนี้");
      }
    };
    fetchClassroom();
  }, [cid]);

  useEffect(() => {
    if (!cid) return;

    const studentsRef = collection(db, "classroom", cid, "students");
    const unsubscribe = onSnapshot(studentsRef, (snapshot) => {
      setStudents(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [cid]);

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบนักเรียนคนนี้?")) {
      try {
        await deleteDoc(doc(db, "classroom", cid, "students", studentId));
        alert("ลบนักเรียนสำเร็จ!");
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("ไม่สามารถลบนักเรียนได้");
      }
    }
  };

  return (
    <div className="classroom-container">
      {classroom ? (
        <>
          <h1 className="classroom-title">{classroom.info?.name || "ไม่มีชื่อวิชา"}</h1>
          <p>รหัสวิชา: {classroom.info?.code || "ไม่มีรหัสวิชา"}</p>
          <p>ห้องเรียน: {classroom.info?.room || "ไม่มีข้อมูลห้องเรียน"}</p>

          {/* ✅ แสดง QR Code สำหรับเข้าห้องเรียน */}
          <div className="qr-box">
            <QRCodeGenerator cid={cid} type="classroom" />
          </div>

          <div className="add-student-container">
            <AddStudent cid={cid} />
          </div>

          <div className="student-list">
            <h2>รายชื่อนักเรียน</h2>
            {students.length > 0 ? (
              <ul>
                {students.map((student) => (
                  <li key={student.id} className="student-item">
                    <span>{student.stdid} - {student.name}</span>
                    <button
                      className="student-delete-btn"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      ลบ
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>ยังไม่มีนักเรียนในห้องนี้</p>
            )}
          </div>

          <Link to={`/classroom/${cid}/checkin`} className="checkin-button">
            ไปที่หน้าเช็คชื่อ
          </Link>
        </>
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}
    </div>
  );
};

export default Classroom;