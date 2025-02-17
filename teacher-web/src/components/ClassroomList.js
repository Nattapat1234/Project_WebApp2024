import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { updateClassroom, deleteClassroom } from "../services/classroomService";
import "../styles/Classroom.css";

const ClassroomList = ({ uid }) => {
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(null);

  //  ใช้ state เก็บค่าที่ต้องการแก้ไข
  const [editedSubjectCode, setEditedSubjectCode] = useState("");
  const [editedSubjectName, setEditedSubjectName] = useState("");
  const [editedRoomName, setEditedRoomName] = useState("");
  const [editedPhotoURL, setEditedPhotoURL] = useState("");

  useEffect(() => {
    if (!uid) return;

    //  โหลดรายวิชาแบบเรียลไทม์
    const classroomsRef = collection(db, "classroom");
    const q = query(classroomsRef, where("owner", "==", uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setClassrooms(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [uid]);

  //  ฟังก์ชันเลือกห้องเรียนเพื่อแก้ไข
  const handleEditClick = (classroom) => {
    setEditMode(classroom.id);
    setEditedSubjectCode(classroom.info.code);
    setEditedSubjectName(classroom.info.name);
    setEditedRoomName(classroom.info.room);
    setEditedPhotoURL(classroom.info.photo);
  };

  //  ฟังก์ชันบันทึกการแก้ไข
  const handleSaveEdit = async (cid) => {
    if (!editedSubjectCode || !editedSubjectName || !editedRoomName) {
      alert("กรุณากรอกข้อมูลให้ครบ!");
      return;
    }
    try {
      await updateClassroom(cid, {
        code: editedSubjectCode,
        name: editedSubjectName,
        room: editedRoomName,
        photo: editedPhotoURL,
      });
      setEditMode(null);
    } catch (error) {
      alert("ไม่สามารถแก้ไขห้องเรียนได้");
    }
  };

  //  ฟังก์ชันลบห้องเรียน
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
    <div className="classroom-container">
      <h2 className="classroom-header">รายวิชาที่สอน</h2>
      {classrooms.length > 0 ? (
        <ul>
          {classrooms.map((classroom) => (
            <li key={classroom.id} className="classroom-item">
              {editMode === classroom.id ? (
                /* แสดงฟอร์มแก้ไข */
                <div className="edit-form">
                  <input
                    type="text"
                    placeholder="รหัสวิชา"
                    value={editedSubjectCode}
                    onChange={(e) => setEditedSubjectCode(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="ชื่อวิชา"
                    value={editedSubjectName}
                    onChange={(e) => setEditedSubjectName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="ชื่อห้องเรียน"
                    value={editedRoomName}
                    onChange={(e) => setEditedRoomName(e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="URL รูปภาพ (ไม่บังคับ)"
                    value={editedPhotoURL}
                    onChange={(e) => setEditedPhotoURL(e.target.value)}
                  />
                  <div className="button-container">
                    <button onClick={() => handleSaveEdit(classroom.id)} className="update-button">บันทึก</button>
                    <button onClick={() => setEditMode(null)} className="cancel-button">ยกเลิก</button>
                  </div>
                </div>
              ) : (
                /* แสดงข้อมูลปกติ */
                <div className="classroom-actions">
                  <div>
                    <h3>{classroom.info.name}</h3>
                  </div>
                  <div className="button-container">
                    <button onClick={() => navigate(`/classroom/${classroom.id}`)} className="view-button">ดูรายละเอียด</button>
                    <button onClick={() => handleEditClick(classroom)} className="edit-button">แก้ไข</button>
                    <button onClick={() => handleDelete(classroom.id)} className="delete-button">ลบ</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-classroom-message">ยังไม่มีห้องเรียน</p>
      )}
    </div>
  );
};

export default ClassroomList;
