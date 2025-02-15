import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { updateClassroom, deleteClassroom } from "../services/classroomService";

const ClassroomList = ({ uid }) => {
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(null);
  const [updatedName, setUpdatedName] = useState("");

  useEffect(() => {
    if (!uid) return;

    // 🔄 โหลดรายวิชาแบบเรียลไทม์
    const classroomsRef = collection(db, "classroom");
    const q = query(classroomsRef, where("owner", "==", uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setClassrooms(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [uid]);

  // 🆕 ฟังก์ชันบันทึกการแก้ไข
  const handleUpdate = async (cid) => {
    if (!updatedName) return;
    try {
      await updateClassroom(cid, { name: updatedName });
      setEditMode(null);
      setUpdatedName("");
    } catch (error) {
      alert("ไม่สามารถแก้ไขห้องเรียนได้");
    }
  };

  // 🗑️ ฟังก์ชันลบห้องเรียน
  const handleDelete = async (cid) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบห้องเรียนนี้?")) {
      try {
        await deleteClassroom(cid, uid);
        alert("ลบห้องเรียนสำเร็จ");
      } catch (error) {
        alert("ไม่สามารถลบห้องเรียนได้");
      }
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-lg font-bold">รายวิชาที่สอน</h2>
      {classrooms.length > 0 ? (
        <ul>
          {classrooms.map((classroom) => (
            <li key={classroom.id} className="mt-2 flex items-center gap-2">
              {editMode === classroom.id ? (
                <>
                  <input
                    type="text"
                    value={updatedName}
                    onChange={(e) => setUpdatedName(e.target.value)}
                    className="border p-1"
                  />
                  <button onClick={() => handleUpdate(classroom.id)} className="btn btn-success">
                    บันทึก
                  </button>
                  <button onClick={() => setEditMode(null)} className="btn btn-secondary">
                    ยกเลิก
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate(`/classroom/${classroom.id}`)}
                  >
                    {classroom.info?.name || "ไม่มีชื่อวิชา"}
                  </button>
                  <button onClick={() => setEditMode(classroom.id)} className="btn btn-warning">
                    แก้ไข
                  </button>
                  <button onClick={() => handleDelete(classroom.id)} className="btn btn-error">
                    ลบ
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>ยังไม่มีห้องเรียน</p>
      )}
    </div>
  );
};

export default ClassroomList;
