import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, collection, getDocs, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "../styles/Question.css";

const Question = () => {
  const { cid } = useParams();
  const [cno, setCno] = useState(null);
  const [questionNo, setQuestionNo] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [questionShow, setQuestionShow] = useState(false);
  const [answers, setAnswers] = useState([]);

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

  useEffect(() => {
    if (!cid || !cno || !questionNo || isNaN(questionNo) || questionNo === "") return;
    const answersRef = collection(db, "classroom", cid, "checkin", cno, "answers", String(questionNo), "students");
    const unsubscribe = onSnapshot(answersRef, (snapshot) => {
      setAnswers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [cid, cno, questionNo]);

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
      const questionCollectionRef = doc(db, "classroom", cid, "checkin", cno, "answers", String(questionNo));
      await setDoc(questionCollectionRef, { createdAt: new Date().toISOString() }, { merge: true });
      alert("✅ ตั้งคำถามสำเร็จ!");
    } catch (error) {
      console.error("❌ Error creating question:", error);
      alert("❌ เกิดข้อผิดพลาดในการตั้งคำถาม");
    }
  };

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
    <div className="question-container">
      <h1 className="question-title">หน้าถาม-ตอบ</h1>
      <div className="question-form">
        <h2 className="form-title">ตั้งคำถาม</h2>
        <input
          type="number"
          value={questionNo}
          onChange={(e) => setQuestionNo(e.target.value)}
          className="input-field"
          placeholder="ข้อที่ (เลข)"
        />
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="input-field"
          placeholder="พิมพ์คำถาม"
        />
        <div className="button-container">
        <button onClick={handleCreateQuestion} className="btn-create">เริ่มถาม</button>
        <button onClick={handleCloseQuestion} className="btn-close">ปิดคำถาม</button>
        </div>
      </div>
      {questionShow && (
        <div className="question-display">
          <h2 className="display-title">คำถามที่ {questionNo}</h2>
          <p className="display-text">{questionText}</p>
        </div>
      )}
      <h2 className="answer-title">คำตอบจากนักเรียน</h2>
      <ul className="answer-list">
        {answers.map((answer, index) => (
          <li key={index} className="answer-item">{answer.text} ({answer.time})</li>
        ))}
      </ul>
    </div>
  );
};

export default Question;