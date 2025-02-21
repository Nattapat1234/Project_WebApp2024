import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, onSnapshot } from "firebase/firestore";
import QRCodeGenerator from "../components/QRCodeGenerator";
import AddStudent from "../components/AddStudent";

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
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [cid]);

  return (
    <div className="p-5">
      {classroom ? (
        <>
          <h1 className="text-xl font-bold">{classroom.info?.name || "ไม่มีชื่อวิชา"}</h1>
          <p>รหัสวิชา: {classroom.info?.code || "ไม่มีรหัสวิชา"}</p>
          <p>ห้องเรียน: {classroom.info?.room || "ไม่มีข้อมูลห้องเรียน"}</p>

          {/* ✅ แสดง QR Code สำหรับเข้าห้องเรียน */}
          <QRCodeGenerator cid={cid} type="classroom" />

          <AddStudent cid={cid} />

          <div className="mt-5 p-4 border rounded-lg shadow-md bg-white">
            <h2 className="text-lg font-semibold">รายชื่อนักเรียน</h2>
            {students.length > 0 ? (
              <ul>
                {students.map((student) => (
                  <li key={student.id} className="mt-2 flex justify-between bg-gray-100 p-2 rounded-md">
                    <span>{student.stdid} - {student.name}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>ยังไม่มีนักเรียนในห้องนี้</p>
            )}
          </div>

          <Link to={`/classroom/${cid}/checkin`} className="mt-3 block bg-purple-500 text-white p-2 rounded-md text-center hover:bg-purple-600">
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
