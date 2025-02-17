import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { useParams } from "react-router-dom";

const Checkin = () => {
  const { cid, cno } = useParams();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchCheckinData = async () => {
      const snapshot = await db.collection("classroom").doc(cid).collection("checkin").doc(cno).collection("students").get();
      setStudents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCheckinData();
  }, [cid, cno]);

  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">เช็คชื่อนักเรียน</h1>
      <ul>
        {students.map((student, index) => (
          <li key={student.id}>
            {index + 1}. {student.name} ({student.stdid})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Checkin;
