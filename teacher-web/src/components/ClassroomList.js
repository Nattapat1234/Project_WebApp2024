import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { updateClassroom, deleteClassroom } from "../services/classroomService";
import "../styles/ClassroomList.css";

const ClassroomList = ({ uid }) => {
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(null);
  const [editedSubjectCode, setEditedSubjectCode] = useState("");
  const [editedSubjectName, setEditedSubjectName] = useState("");
  const [editedRoomName, setEditedRoomName] = useState("");
  const [editedPhotoURL, setEditedPhotoURL] = useState("");

  useEffect(() => {
    if (!uid) return;

    const classroomsRef = collection(db, "classroom");
    const q = query(classroomsRef, where("owner", "==", uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setClassrooms(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [uid]);

  const handleEditClick = (classroom) => {
    setEditMode(classroom.id);
    setEditedSubjectCode(classroom.info.code);
    setEditedSubjectName(classroom.info.name);
    setEditedRoomName(classroom.info.room);
    setEditedPhotoURL(classroom.info.photo);
  };

  const handleSaveEdit = async (cid) => {
    if (!editedSubjectCode || !editedSubjectName || !editedRoomName) {
      alert("กรุณากรอกข้อมูลให้ครบ");
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

  const handleDelete = async (cid) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบห้องเรียนนี้")) {
      try {
        await deleteClassroom(cid, uid);
        alert("ลบห้องเรียนสำเร็จ");
      } catch (error) {
        alert("ไม่สามารถลบห้องเรียนได้");
      }
    }
  };

  return (
    <div className="classroom-grid">
      {classrooms.length > 0 ? (
        classrooms.map((classroom) => (
          <div key={classroom.id} className="classroom-card">
            <img
              src={classroom.info.photo || "https://via.placeholder.com/300x150"}
              alt={classroom.info.name}
              className="classroom-image"
            />
            <div className="classroom-content">
              <h3>{classroom.info.name}</h3>
              <p>รหัสวิชา: {classroom.info.code}</p>
              <p>ห้อง: {classroom.info.room}</p>
              <div className="button-group">
                <button onClick={() => navigate(`/classroom/${classroom.id}`)} className="view-button">ดูรายละเอียด</button>
                <button onClick={() => handleEditClick(classroom)} className="edit-button">แก้ไข</button>
                <button onClick={() => handleDelete(classroom.id)} className="delete-button">ลบ</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="no-classroom-message">ยังไม่มีห้องเรียน</p>
      )}
    </div>
  );
};

export default ClassroomList;
