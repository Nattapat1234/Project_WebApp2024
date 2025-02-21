import { db } from "../services/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

/** ✅ ฟังก์ชันตั้งคำถาม */
export const createQuestion = async (cid, cno, questionNo, questionText) => {
  if (!cid || !cno || !questionNo || !questionText) {
    throw new Error("❌ ข้อมูลไม่ครบ กรุณาตรวจสอบค่า cid, cno, questionNo และ questionText");
  }

  const questionRef = doc(db, "classroom", cid, "checkin", cno);

  try {
    const docSnap = await getDoc(questionRef);
    if (!docSnap.exists()) {
      throw new Error("❌ ไม่พบรอบเช็คชื่อ");
    }

    await updateDoc(questionRef, {
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

/** ✅ ฟังก์ชันปิดคำถาม */
export const closeQuestion = async (cid, cno) => {
  if (!cid || !cno) {
    throw new Error("❌ ข้อมูลไม่ครบ กรุณาตรวจสอบค่า cid และ cno");
  }

  const questionRef = doc(db, "classroom", cid, "checkin", cno);

  try {
    await updateDoc(questionRef, {
      question_show: false,
    });

    console.log("✅ ปิดคำถามสำเร็จ");
  } catch (error) {
    console.error("❌ Error closing question:", error);
    throw error;
  }
};
