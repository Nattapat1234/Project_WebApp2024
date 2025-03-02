import React, { useEffect, useState } from "react";
import { listenToAnswers } from "../services/firebaseFunctions";

const AnswerList = ({ cid, cno, questionNo }) => {
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        if (!cid || !cno || !questionNo) return;

        const unsubscribe = listenToAnswers(cid, cno, questionNo, (data) => {
            setAnswers(data);
        });

        return () => unsubscribe();
    }, [cid, cno, questionNo]);

    return (
        <div>
            <h2>📝 คำตอบของคำถามข้อที่ {questionNo}</h2>
            <ul>
                {answers.length > 0 ? (
                    answers.map((answer) => (
                        <li key={answer.id}>
                            <strong>{answer.id}</strong>: {answer.text} <br />
                            <small>📅 เวลาส่ง: {new Date(answer.time).toLocaleString()}</small>
                        </li>
                    ))
                ) : (
                    <p>❌ ยังไม่มีคำตอบ</p>
                )}
            </ul>
        </div>
    );
};

export default AnswerList;
