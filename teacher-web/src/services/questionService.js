import { db } from "../services/firebase";
import { doc, setDoc, updateDoc } from "firebase/firestore";

/** ฟังก์ชันสร้างคำถาม */
export const createQuestion = async (cid, cno, questionNo, questionText) => {
  if (!cid || !cno || !questionNo || !questionText) {
    throw new Error("ข้อมูลไม่ครบ กรุณาตรวจสอบค่า cid, cno, questionNo และ questionText");
  }

  const questionRef = doc(db, "classroom", cid, "checkin", cno, "questions", String(questionNo));

  try {
    await setDoc(questionRef, {
      question_no: Number(questionNo),
      question_text: questionText,
      question_show: true,
    });

    console.log(`✅ ตั้งคำถามสำเร็จ: ข้อที่ ${questionNo}`);
  } catch (error) {
    console.error("❌ Error creating question:", error);
    throw error;
  }
};

/** ฟังก์ชันปิดคำถาม */
export const closeQuestion = async (cid, cno, questionNo) => {
  if (!cid || !cno || !questionNo) {
    throw new Error("ข้อมูลไม่ครบ กรุณาตรวจสอบค่า cid, cno และ questionNo");
  }

  const questionRef = doc(db, "classroom", cid, "checkin", cno, "questions", String(questionNo));

  try {
    await updateDoc(questionRef, { question_show: false });

    console.log(`✅ ปิดคำถามข้อที่ ${questionNo} สำเร็จ`);
  } catch (error) {
    console.error("❌ Error closing question:", error);
    throw error;
  }
};
