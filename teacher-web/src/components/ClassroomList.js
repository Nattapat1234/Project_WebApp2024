import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { updateClassroom, deleteClassroom } from "../services/classroomService";
import "../styles/ClassroomList.css";

const ClassroomList = ({ ownerName, onEdit, onDelete }) => {
  const [classrooms, setClassrooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ownerName) return;

    const classroomsRef = collection(db, "classroom");
    const q = query(classroomsRef, where("owner", "==", ownerName));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setClassrooms(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [ownerName]);

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
                <button onClick={() => navigate(`/classroom/${classroom.id}`)} className="view-button">
                  ดูรายละเอียด
                </button>
                <button onClick={() => onEdit(classroom)} className="edit-button">
                  แก้ไข
                </button>
                <button onClick={() => onDelete(classroom.id)} className="delete-button">
                  ลบ
                </button>
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
