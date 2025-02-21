import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, collection, getDocs, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";

const Question = () => {
  const { cid } = useParams();
  const [cno, setCno] = useState(null);
  const [questionNo, setQuestionNo] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionShow, setQuestionShow] = useState(false);
  const [answers, setAnswers] = useState([]);

  /** ✅ โหลดข้อมูลรอบเช็คชื่อล่าสุด */
  useEffect(() => {
    if (!cid) return;

    const fetchLatestCheckin = async () => {
      const checkinRef = collection(db, "classroom", cid, "checkin");
      const snapshot = await getDocs(checkinRef);
      if (!snapshot.empty) {
        const latestDoc = snapshot.docs[snapshot.docs.length - 1];
        setCno(latestDoc.id);
      }
    };

    fetchLatestCheckin();
  }, [cid]);

  /** ✅ โหลดข้อมูลคำถามแบบ Realtime */
  useEffect(() => {
    if (!cid || !cno) return;

    const questionRef = doc(db, "classroom", cid, "checkin", cno);
    const unsubscribe = onSnapshot(questionRef, (snapshot) => {
      if (snapshot.exists()) {
        setQuestionNo(snapshot.data().question_no || "");
        setQuestionText(snapshot.data().question_text || "");
        setQuestionShow(snapshot.data().question_show || false);
      }
    });

    return () => unsubscribe();
  }, [cid, cno]);

  /** ✅ โหลดคำตอบจากนักเรียนแบบ Realtime */
  useEffect(() => {
    if (!cid || !cno || !questionNo || isNaN(questionNo) || questionNo === "") return;

    const answersRef = collection(db, "classroom", cid, "checkin", cno, "answers", String(questionNo), "students");

    const unsubscribe = onSnapshot(answersRef, (snapshot) => {
      setAnswers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [cid, cno, questionNo]);

  /** ✅ ฟังก์ชันตั้งคำถาม */
  const handleCreateQuestion = async () => {
    if (!questionNo || !questionText) {
      alert("กรุณากรอกข้อที่ และ ข้อความคำถาม");
      return;
    }

    if (isNaN(questionNo)) {
      alert("หมายเลขคำถามต้องเป็นตัวเลข");
      return;
    }

    const questionRef = doc(db, "classroom", cid, "checkin", cno);
    try {
      await updateDoc(questionRef, {
        question_no: Number(questionNo),
        question_text: questionText,
        question_show: true,
      });

      // สร้าง collection สำหรับคำถามถ้ายังไม่มี
      const questionCollectionRef = doc(db, "classroom", cid, "checkin", cno, "answers", String(questionNo));
      await setDoc(questionCollectionRef, { createdAt: new Date().toISOString() }, { merge: true });

      alert("✅ ตั้งคำถามสำเร็จ!");
    } catch (error) {
      console.error("❌ Error creating question:", error);
      alert("❌ เกิดข้อผิดพลาดในการตั้งคำถาม");
    }
  };

  /** ✅ ฟังก์ชันปิดคำถาม */
  const handleCloseQuestion = async () => {
    const questionRef = doc(db, "classroom", cid, "checkin", cno);
    try {
      await updateDoc(questionRef, {
        question_show: false,
      });
      alert("✅ ปิดคำถามสำเร็จ!");
    } catch (error) {
      console.error("❌ Error closing question:", error);
      alert("❌ เกิดข้อผิดพลาดในการปิดคำถาม");
    }
  };

  return (
    <div className="p-5 bg-gray-700 min-h-screen text-white">
      <h1 className="text-2xl font-bold text-center">หน้าถาม-ตอบ</h1>

      {/* ฟอร์มตั้งคำถาม */}
      <div className="mt-5 p-4 bg-gray-800 rounded-md shadow-md">
        <h2 className="text-lg font-semibold">ตั้งคำถาม</h2>
        <input
          type="number"
          value={questionNo}
          onChange={(e) => setQuestionNo(e.target.value)}
          className="w-full p-2 border rounded-md mt-2 text-black"
          placeholder="ข้อที่ (เลข)"
        />
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full p-2 border rounded-md mt-2 text-black"
          placeholder="พิมพ์คำถาม"
        />
        <button
          onClick={handleCreateQuestion}
          className="mt-3 w-full bg-blue-500 p-2 rounded-md"
        >
          เริ่มถาม
        </button>
        <button
          onClick={handleCloseQuestion}
          className="mt-3 w-full bg-red-500 p-2 rounded-md"
        >
          ปิดคำถาม
        </button>
      </div>

      {/* แสดงคำถามปัจจุบัน */}
      {questionShow && (
        <div className="mt-5 p-4 bg-gray-800 rounded-md shadow-md">
          <h2 className="text-lg font-semibold">คำถามที่ {questionNo}</h2>
          <p className="text-md">{questionText}</p>
        </div>
      )}

      {/* แสดงคำตอบจากนักเรียน */}
      <h2 className="mt-5 text-lg font-semibold">คำตอบจากนักเรียน</h2>
      <ul>
        {answers.map((answer, index) => (
          <li key={index} className="p-2 bg-gray-800 mt-2">
            {answer.text} ({answer.time})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Question;
