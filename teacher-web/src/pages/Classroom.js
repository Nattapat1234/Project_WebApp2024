import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import QRCodeGenerator from "../components/QRCodeGenerator";
import AddStudent from "../components/AddStudent";
import "../styles/Classroom.css"; // ✅ นำเข้าไฟล์ CSS

const Classroom = () => {
  const { cid } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStdId, setEditStdId] = useState("");

  useEffect(() => {
    const fetchClassroom = async () => {
      const classroomRef = doc(db, "classroom", cid);
      const docSnap = await getDoc(classroomRef);
      
      if (docSnap.exists()) {
        setClassroom(docSnap.data());
      } else {
        console.log("❌ ไม่มีข้อมูลห้องเรียนนี้");
      }
    };

    fetchClassroom();
  }, [cid]);

  useEffect(() => {
    if (!cid) return;
    
    const studentsRef = collection(db, "classroom", cid, "students");
    const unsubscribe = onSnapshot(studentsRef, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [cid]);

  const handleDeleteStudent = async (sid) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบนักเรียนคนนี้?")) return;
    
    try {
      await deleteDoc(doc(db, "classroom", cid, "students", sid));
      alert("ลบนักเรียนสำเร็จ!");
    } catch (error) {
      console.error("❌ Error deleting student:", error);
      alert("ไม่สามารถลบนักเรียนได้");
    }
  };

  const handleEditStudent = async () => {
    if (!editingStudent) return;

    try {
      const studentRef = doc(db, "classroom", cid, "students", editingStudent.id);
      await updateDoc(studentRef, {
        name: editName,
        stdid: editStdId,
      });

      alert("อัปเดตข้อมูลนักเรียนสำเร็จ!");
      setEditingStudent(null);
    } catch (error) {
      console.error("❌ Error updating student:", error);
      alert("ไม่สามารถแก้ไขข้อมูลนักเรียนได้");
    }
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditStdId(student.stdid);
  };

  return (
    <div className="classroom-container">
      {classroom ? (
        <>
          <h1 className="classroom-title">{classroom.info?.name || "ไม่มีชื่อวิชา"}</h1>
          <p>รหัสวิชา: {classroom.info?.code || "ไม่มีรหัสวิชา"}</p>
          <p>ห้องเรียน: {classroom.info?.room || "ไม่มีข้อมูลห้องเรียน"}</p>
          
          <QRCodeGenerator cid={cid} />
          <AddStudent cid={cid} />

          <div className="student-list">
            <h2>รายชื่อนักเรียน</h2>
            {students.length > 0 ? (
              <ul>
                {students.map((student) => (
                  <li key={student.id} className="student-item">
                    <span>{student.stdid} - {student.name}</span>
                    <div className="student-actions">
                      <button onClick={() => openEditModal(student)} className="edit-btn">แก้ไข</button>
                      <button onClick={() => handleDeleteStudent(student.id)} className="delete-btn">ลบ</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>ยังไม่มีนักเรียนในห้องนี้</p>
            )}
          </div>
        </>
      ) : (
        <p>กำลังโหลดข้อมูล...</p>
      )}

      {editingStudent && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <h2>แก้ไขข้อมูลนักเรียน</h2>
            <input type="text" value={editStdId} onChange={(e) => setEditStdId(e.target.value)} />
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} />
            <div>
              <button onClick={handleEditStudent}>บันทึก</button>
              <button onClick={() => setEditingStudent(null)}>ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
