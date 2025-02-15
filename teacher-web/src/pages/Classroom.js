import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useParams } from "react-router-dom";
import { doc, getDoc, collection, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";
import QRCodeGenerator from "../components/QRCodeGenerator";
import AddStudent from "../components/AddStudent";

const Classroom = () => {
  const { cid } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [editName, setEditName] = useState("");
  const [editStdId, setEditStdId] = useState("");

  /** ✅ โหลดข้อมูลห้องเรียน */
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

  /** ✅ โหลดรายชื่อนักเรียนแบบเรียลไทม์ */
  useEffect(() => {
    if (!cid) return;
    
    const studentsRef = collection(db, "classroom", cid, "students");
    const unsubscribe = onSnapshot(studentsRef, (snapshot) => {
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [cid]);

  /** ✅ ฟังก์ชันลบนักเรียน */
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

  /** ✅ ฟังก์ชันแก้ไขนักเรียน */
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

  /** ✅ ฟังก์ชันเปิดฟอร์มแก้ไข */
  const openEditModal = (student) => {
    setEditingStudent(student);
    setEditName(student.name);
    setEditStdId(student.stdid);
  };

  return (
    <div className="p-5">
      {classroom ? (
        <>
          <h1 className="text-xl font-bold">{classroom.info?.name || "ไม่มีชื่อวิชา"}</h1>
          <p>รหัสวิชา: {classroom.info?.code || "ไม่มีรหัสวิชา"}</p>
          <p>ห้องเรียน: {classroom.info?.room || "ไม่มีข้อมูลห้องเรียน"}</p>
          
          <QRCodeGenerator cid={cid} />
          <AddStudent cid={cid} />

          {/* ✅ รายชื่อนักเรียน */}
          <div className="mt-5 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-lg font-semibold">รายชื่อนักเรียน</h2>
            {students.length > 0 ? (
              <ul>
                {students.map((student) => (
                  <li key={student.id} className="mt-2 flex justify-between bg-gray-100 p-2 rounded-md">
                    <span>{student.stdid} - {student.name}</span>
                    <div>
                      <button onClick={() => openEditModal(student)} className="mr-2 text-yellow-500">แก้ไข</button>
                      <button onClick={() => handleDeleteStudent(student.id)} className="text-red-500">ลบ</button>
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

      {/* ✅ Modal แก้ไขข้อมูลนักเรียน */}
      {editingStudent && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">แก้ไขข้อมูลนักเรียน</h2>
            <input type="text" value={editStdId} onChange={(e) => setEditStdId(e.target.value)} className="w-full p-2 border rounded-md mt-2" />
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full p-2 border rounded-md mt-2" />
            <div className="mt-3 flex space-x-2">
              <button onClick={handleEditStudent} className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">บันทึก</button>
              <button onClick={() => setEditingStudent(null)} className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600">ยกเลิก</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Classroom;
