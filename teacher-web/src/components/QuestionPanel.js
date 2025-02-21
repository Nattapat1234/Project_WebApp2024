import React, { useState } from "react";
import { createQuestion, submitAnswer, closeQuestion } from "../services/questionService";
import { auth } from "../services/firebase";

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
    <div className="p-4 bg-white shadow-md rounded-lg">
      {isTeacher ? (
        <>
          <h2 className="text-lg font-bold">ตั้งคำถาม</h2>
          <input type="text" placeholder="คำถาม" value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="w-full p-2 border rounded-md mt-2" />
          <button className="mt-3 w-full bg-blue-500 p-2 rounded-md" onClick={handleCreateQuestion}>ส่งคำถาม</button>
          <button className="mt-3 w-full bg-red-500 p-2 rounded-md" onClick={() => closeQuestion(cid, cno)}>ปิดคำถาม</button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold">ตอบคำถาม</h2>
          <input type="text" placeholder="คำตอบ" value={answer} onChange={(e) => setAnswer(e.target.value)} className="w-full p-2 border rounded-md mt-2" />
          <button className="mt-3 w-full bg-green-500 p-2 rounded-md" onClick={() => submitAnswer(cid, cno, 1, auth.currentUser.uid, answer)}>ส่งคำตอบ</button>
        </>
      )}
    </div>
  );
};

export default QuestionPanel;
