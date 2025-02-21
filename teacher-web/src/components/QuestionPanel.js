import React, { useState } from "react";
import { createQuestion, submitAnswer, closeQuestion } from "../services/questionService";
import { auth } from "../services/firebase";
import "../styles/Question.css";

const QuestionPanel = ({ cid, cno, isTeacher }) => {
  const [questionText, setQuestionText] = useState("");
  const [answer, setAnswer] = useState("");

  const handleCreateQuestion = async () => {
    if (!questionText) return alert("กรุณากรอกคำถาม");
    try {
      await createQuestion(cid, cno, 1, questionText);
      alert("ตั้งคำถามสำเร็จ!");
      setQuestionText("");
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการตั้งคำถาม");
    }
  };

  return (
    <div className="question-panel">
      {isTeacher ? (
        <>
          <h2 className="question-title">ตั้งคำถาม</h2>
          <input
            type="text"
            placeholder="คำถาม"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="question-input"
          />
          <button className="question-button submit" onClick={handleCreateQuestion}>ส่งคำถาม</button>
          <button className="question-button close" onClick={() => closeQuestion(cid, cno)}>ปิดคำถาม</button>
        </>
      ) : (
        <>
          <h2 className="question-title">ตอบคำถาม</h2>
          <input
            type="text"
            placeholder="คำตอบ"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="answer-input"
          />
          <button className="answer-button submit" onClick={() => submitAnswer(cid, cno, 1, auth.currentUser.uid, answer)}>ส่งคำตอบ</button>
        </>
      )}
    </div>
  );
};

export default QuestionPanel;
