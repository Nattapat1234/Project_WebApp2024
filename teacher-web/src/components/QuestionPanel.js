import React, { useEffect, useState } from "react";
import { listenToAnswers } from "../services/firebaseFunctions";

const AnswerList = ({ cid, cno, questionNo }) => {
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        if (!cid || !cno || !questionNo) return;

        // เรียกใช้งานฟังก์ชันดึงข้อมูลแบบ Realtime
        const unsubscribe = listenToAnswers(cid, cno, questionNo, (data) => {
            setAnswers(data);
        });

        return () => unsubscribe(); // Cleanup เมื่อ Component ถูก unmount
    }, [cid, cno, questionNo]);

    return (
        <div>
            <h3>คำตอบสำหรับคำถามที่ {questionNo}</h3>
            <ul>
                {answers.map((answer) => (
                    <li key={answer.id}>
                        <strong>{answer.id}</strong>: {answer.text} <br />
                        <small>เวลาส่ง: {new Date(answer.time).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AnswerList;
