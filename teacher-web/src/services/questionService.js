import { db } from "../services/firebase";
import { doc, setDoc, updateDoc, collection, query, orderBy, onSnapshot, getDoc } from "firebase/firestore";

/** ✅ ฟังก์ชันสร้างคำถาม */
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

/** ✅ ฟังก์ชันปิดคำถาม */
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

/** ✅ ฟังก์ชันดึงคำตอบแบบ Realtime */
export const listenToAnswers = (cid, cno, questionNo, callback) => {
  if (!cid || !cno || !questionNo) {
    throw new Error("ข้อมูลไม่ครบ กรุณาตรวจสอบค่า cid, cno และ questionNo");
  }

  const answersRef = collection(db, "classroom", cid, "checkin", cno, "answers", String(questionNo));

  const q = query(answersRef, orderBy("time", "asc")); // เรียงลำดับตามเวลาที่ส่งคำตอบ

  // ใช้ onSnapshot เพื่อรับการอัปเดตแบบเรียลไทม์
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const answers = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(answers); // ส่งข้อมูลคำตอบกลับไปที่ Component
  });

  return unsubscribe; // ส่งฟังก์ชันปิด Listener กลับไปใช้ภายหลัง
};

/** ✅ ฟังก์ชันดึงข้อมูลคำถาม */
export const getQuestion = async (cid, cno, questionNo) => {
  const questionRef = doc(db, "classroom", cid, "checkin", cno, "questions", String(questionNo));
  const questionDoc = await getDoc(questionRef);
  return questionDoc.exists() ? questionDoc.data() : null;
};
