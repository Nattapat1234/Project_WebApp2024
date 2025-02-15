import { db } from "./firebase";

// ฟังก์ชันตั้งคำถาม
export const createQuestion = async (cid, cno, questionNo, questionText) => {
  const questionRef = db.collection("classroom").doc(cid).collection("checkin").doc(cno);

  await questionRef.update({
    question_no: questionNo,
    question_text: questionText,
    question_show: true,
  });
};

// ฟังก์ชันนักเรียนตอบคำถาม
export const submitAnswer = async (cid, cno, questionNo, uid, answerText) => {
  const answerRef = db.collection("classroom").doc(cid).collection("checkin").doc(cno).collection("answers").doc(questionNo);

  await answerRef.set({
    [`students.${uid}.text`]: answerText,
    [`students.${uid}.time`]: new Date().toISOString(),
  }, { merge: true });
};
