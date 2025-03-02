import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, collection, onSnapshot, updateDoc, setDoc, deleteDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";
import "../styles/Question.css";

const Question = () => {
  const { cid, cno } = useParams();
  const [questionList, setQuestionList] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [selectedQuestionNo, setSelectedQuestionNo] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [nextQuestionNo, setNextQuestionNo] = useState(1);

  /** ✅ โหลดรายการคำถามแบบ Realtime */
  useEffect(() => {
    if (!cid || !cno) return;

    const questionRef = collection(db, "classroom", cid, "checkin", cno, "questions");
    const unsubscribe = onSnapshot(questionRef, (snapshot) => {
      const questions = snapshot.docs.map(doc => ({
        question_no: Number(doc.id),
        ...doc.data(),
      })).sort((a, b) => a.question_no - b.question_no);

      setQuestionList(questions);
      setNextQuestionNo(questions.length > 0 ? questions[questions.length - 1].question_no + 1 : 1);
    });

    return () => unsubscribe();
  }, [cid, cno]);

  /** ✅ โหลดคำตอบแบบ Realtime เมื่อเลือกคำถาม */
  useEffect(() => {
    if (!cid || !cno || !selectedQuestionNo) {
      setAnswers([]);
      return;
    }

    const answersRef = collection(db, "classroom", cid, "checkin", cno, "questions", String(selectedQuestionNo), "answers");
    const unsubscribe = onSnapshot(answersRef, (snapshot) => {
      setAnswers(snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          stdid: data.stdid,
          student_name: data.student_name,
          text: data.text,
          time: data.time?.toDate ? data.time.toDate().toLocaleString() : "ไม่มีข้อมูลเวลา", // ✅ แปลง Timestamp เป็น String
        };
      }));
    });

    return () => unsubscribe();
  }, [cid, cno, selectedQuestionNo]);

  /** ✅ เพิ่มคำถามใหม่ */
  const handleCreateQuestion = async () => {
    if (!questionText.trim()) {
      alert("กรุณากรอกข้อความคำถาม");
      return;
    }

    const questionRef = doc(db, "classroom", cid, "checkin", cno, "questions", String(nextQuestionNo));

    try {
      await setDoc(questionRef, {
        question_no: nextQuestionNo,
        question_text: questionText,
        question_show: false,
      });

      alert(`✅ เพิ่มคำถามข้อที่ ${nextQuestionNo} สำเร็จ!`);
      setQuestionText("");
    } catch (error) {
      console.error("❌ Error creating question:", error);
      alert("❌ เกิดข้อผิดพลาดในการเพิ่มคำถาม");
    }
  };

  /** ✅ เปิด-ปิดคำถาม */
  const handleToggleQuestion = async (qno, isShowing) => {
    const questionRef = doc(db, "classroom", cid, "checkin", cno, "questions", String(qno));

    try {
      await updateDoc(questionRef, { question_show: !isShowing });
      alert(`✅ ${!isShowing ? "เริ่มถาม" : "ปิดคำถาม"} ข้อที่ ${qno} สำเร็จ!`);
    } catch (error) {
      console.error("❌ Error toggling question:", error);
      alert("❌ เกิดข้อผิดพลาดในการเปลี่ยนสถานะคำถาม");
    }
  };

  /** ✅ ลบคำถามพร้อมคำตอบ */
  const handleDeleteQuestion = async (qno) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบคำถามข้อที่ ${qno} และคำตอบทั้งหมด?`)) {
      const questionRef = doc(db, "classroom", cid, "checkin", cno, "questions", String(qno));

      try {
        // ✅ ลบคำตอบทั้งหมดของคำถามนี้
        const answersRef = collection(db, "classroom", cid, "checkin", cno, "questions", String(qno), "answers");
        const answersSnapshot = await getDocs(answersRef);
        answersSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });

        // ✅ ลบคำถาม
        await deleteDoc(questionRef);
        alert(`✅ ลบคำถามข้อที่ ${qno} และคำตอบทั้งหมดสำเร็จ!`);
        if (selectedQuestionNo === qno) setSelectedQuestionNo(null);
      } catch (error) {
        console.error("❌ Error deleting question:", error);
        alert("❌ เกิดข้อผิดพลาดในการลบคำถาม");
      }
    }
  };

  return (
    <div className="question-container">
      <h1 className="question-title">หน้าถาม-ตอบ</h1>

      <div className="question-form">
        <h2 className="form-title">เพิ่มคำถามใหม่</h2>
        <p>หมายเลขคำถามถัดไป: <strong>{nextQuestionNo}</strong></p>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="input-field"
          placeholder="พิมพ์คำถาม"
        />
        <button onClick={handleCreateQuestion} className="btn-create">เพิ่มคำถาม</button>
      </div>

      <h2 className="question-list-title">รายการคำถาม</h2>
      <ul className="question-list">
        {questionList.map((q) => (
          <li key={q.question_no} className="question-item">
            <span onClick={() => setSelectedQuestionNo(selectedQuestionNo === q.question_no ? null : q.question_no)}>
              {q.question_no}. {q.question_text}
            </span>
            <div className="question-actions">
              <button onClick={() => handleToggleQuestion(q.question_no, q.question_show)}
                className={q.question_show ? "btn-close" : "btn-create"}>
                {q.question_show ? "ปิดคำถาม" : "เริ่มถาม"}
              </button>
              <button onClick={() => handleDeleteQuestion(q.question_no)} className="btn-delete">
                ลบคำถาม
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedQuestionNo && (
        <div className="answer-container">
          <h2 className="answer-title">คำตอบของคำถามที่ {selectedQuestionNo}</h2>
          <ul className="answer-list">
            {answers.length > 0 ? (
              answers.map((answer, index) => (
                <li key={index} className="answer-item">
                  <strong>{answer.stdid} - {answer.student_name}:</strong> {answer.text} 
                  <span className="text-gray-500"> ({answer.time})</span>
                </li>
              ))
            ) : (
              <p>ยังไม่มีคำตอบ</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Question;
