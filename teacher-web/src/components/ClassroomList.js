import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useNavigate } from "react-router-dom";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { updateClassroom, deleteClassroom } from "../services/classroomService";

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
      alert(" ไม่สามารถแก้ไขห้องเรียนได้");
    }
  };

  //  ฟังก์ชันลบห้องเรียน
  const handleDelete = async (cid) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบห้องเรียนนี้?")) {
      try {
        await deleteClassroom(cid, uid);
        alert(" ลบห้องเรียนสำเร็จ");
      } catch (error) {
        alert(" ไม่สามารถลบห้องเรียนได้");
      }
    }
  };

  return (
    <div className="mt-5">
      <h2 className="text-lg font-bold">รายวิชาที่สอน</h2>
      {classrooms.length > 0 ? (
        <ul>
          {classrooms.map((classroom) => (
            <li key={classroom.id} className="mt-2 border p-3 rounded-lg shadow-md bg-white">
              {editMode === classroom.id ? (
                /* แสดงฟอร์มแก้ไข */
                <div>
                  <input type="text" placeholder="รหัสวิชา" value={editedSubjectCode} onChange={(e) => setEditedSubjectCode(e.target.value)} className="w-full p-2 border rounded-md mt-2" />
                  <input type="text" placeholder="ชื่อวิชา" value={editedSubjectName} onChange={(e) => setEditedSubjectName(e.target.value)} className="w-full p-2 border rounded-md mt-2" />
                  <input type="text" placeholder="ชื่อห้องเรียน" value={editedRoomName} onChange={(e) => setEditedRoomName(e.target.value)} className="w-full p-2 border rounded-md mt-2" />
                  <input type="text" placeholder="URL รูปภาพ (ไม่บังคับ)" value={editedPhotoURL} onChange={(e) => setEditedPhotoURL(e.target.value)} className="w-full p-2 border rounded-md mt-2" />

                  <div className="mt-3 flex space-x-2">
                    <button onClick={() => handleSaveEdit(classroom.id)} className="w-full bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600">บันทึก</button>
                    <button onClick={() => setEditMode(null)} className="w-full bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600">ยกเลิก</button>
                  </div>
                </div>
              ) : (
                /* แสดงข้อมูลปกติ */
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{classroom.info.name}</h3>

                  </div>
                  <div className="space-x-2">
                    <button onClick={() => navigate(`/classroom/${classroom.id}`)} className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">ดูรายละเอียด</button>
                    <button onClick={() => handleEditClick(classroom)} className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600">แก้ไข</button>
                    <button onClick={() => handleDelete(classroom.id)} className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600">ลบ</button>
                  </div>
                </div>
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
