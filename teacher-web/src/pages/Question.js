import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, collection, getDocs, onSnapshot, updateDoc, setDoc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import "../styles/Question.css";

const Question = () => {
  const { cid, cno } = useParams();
  const [questionList, setQuestionList] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [students, setStudents] = useState([]);
  const [nextQuestionNo, setNextQuestionNo] = useState(1);

  useEffect(() => {
    if (!cid || !cno) return;
    const questionRef = collection(db, "classroom", cid, "checkin", cno, "questions");

    const unsubscribe = onSnapshot(questionRef, (snapshot) => {
      const questions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })).sort((a, b) => a.question_no - b.question_no);

      setQuestionList(questions);
      setNextQuestionNo(questions.length > 0 ? questions[questions.length - 1].question_no + 1 : 1);
    });

    return () => unsubscribe();
  }, [cid, cno]);

  useEffect(() => {
    if (!cid || !cno || !selectedQuestion) {
      setAnswers([]);
      setStudents([]);
      return;
    }

    const answersRef = collection(db, "classroom", cid, "checkin", cno, "answers", selectedQuestion, "students");
    const unsubscribe = onSnapshot(answersRef, (snapshot) => {
      const answersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAnswers(answersData);
      setStudents([...new Set(answersData.map(a => a.student_name))]);
    });

    return () => unsubscribe();
  }, [cid, cno, selectedQuestion]);

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

  const handleToggleQuestion = async (qid, isShowing) => {
    const questionRef = doc(db, "classroom", cid, "checkin", cno, "questions", qid);

    try {
      await updateDoc(questionRef, { question_show: !isShowing });
      alert(`✅ ${!isShowing ? "เริ่มถาม" : "ปิดคำถาม"} ข้อที่ ${qid} สำเร็จ!`);
    } catch (error) {
      console.error("❌ Error toggling question:", error);
      alert("❌ เกิดข้อผิดพลาดในการเปลี่ยนสถานะคำถาม");
    }
  };

  const handleDeleteQuestion = async (qid) => {
    if (window.confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบคำถามข้อที่ ${qid}?`)) {
      const questionRef = doc(db, "classroom", cid, "checkin", cno, "questions", qid);

      try {
        await deleteDoc(questionRef);
        alert(`✅ ลบคำถามข้อที่ ${qid} สำเร็จ!`);
        if (selectedQuestion === qid) setSelectedQuestion(null);
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
          <li key={q.id} className="question-item">
            <span onClick={() => setSelectedQuestion(selectedQuestion === q.id ? null : q.id)}>
              {q.question_no}. {q.question_text}
            </span>
            <div className="question-actions">
              <button onClick={() => handleToggleQuestion(q.id, q.question_show)}
                className={q.question_show ? "btn-close" : "btn-create"}>
                {q.question_show ? "ปิดคำถาม" : "เริ่มถาม"}
              </button>
              <button onClick={() => handleDeleteQuestion(q.id)} className="btn-delete">
                ลบคำถาม
              </button>
            </div>
          </li>
        ))}
      </ul>

      {selectedQuestion && (
        <div className="answer-container">
          <h2 className="answer-title">คำตอบของคำถามที่ {selectedQuestion}</h2>

          <h3 className="student-title">นักเรียนที่ตอบคำถาม</h3>
          <ul className="student-list">
            {students.length > 0 ? (
              students.map((student, index) => (
                <li key={index} className="student-item">{student}</li>
              ))
            ) : (
              <p>ยังไม่มีนักเรียนที่ตอบ</p>
            )}
          </ul>

          <h3 className="answer-list-title">คำตอบจากนักเรียน</h3>
          <ul className="answer-list">
            {answers.length > 0 ? (
              answers.map((answer, index) => (
                <li key={index} className="answer-item">
                  <strong>{answer.student_name}:</strong> {answer.text} ({answer.time})
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
