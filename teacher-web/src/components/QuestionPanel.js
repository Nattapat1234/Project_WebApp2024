import React, { useState } from "react";
import { createQuestion, submitAnswer } from "../services/questionService";

const QuestionPanel = ({ cid, cno, isTeacher }) => {
  const [questionText, setQuestionText] = useState("");
  const [answer, setAnswer] = useState("");

  const handleCreateQuestion = async () => {
    if (!questionText) return;
    await createQuestion(cid, cno, 1, questionText);
    alert("ตั้งคำถามสำเร็จ!");
  };

  const handleSubmitAnswer = async () => {
    if (!answer) return;
    await submitAnswer(cid, cno, 1, "STUDENT_UID", answer);
    alert("ส่งคำตอบสำเร็จ!");
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      {isTeacher ? (
        <>
          <h2 className="text-lg font-bold">ตั้งคำถาม</h2>
          <input type="text" placeholder="คำถาม" value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="input input-bordered" />
          <button className="btn btn-primary mt-3" onClick={handleCreateQuestion}>
            ส่งคำถาม
          </button>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold">ตอบคำถาม</h2>
          <input type="text" placeholder="คำตอบ" value={answer} onChange={(e) => setAnswer(e.target.value)} className="input input-bordered" />
          <button className="btn btn-primary mt-3" onClick={handleSubmitAnswer}>
            ส่งคำตอบ
          </button>
        </>
      )}
    </div>
  );
};

export default QuestionPanel;
