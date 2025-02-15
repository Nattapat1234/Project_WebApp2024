import { db } from "./firebase";

//ฟังก์ชันเพิ่มรอบเช็คชื่อใหม่
export const createCheckinSession = async (cid, code, date) => {
  const checkinRef = db.collection("classroom").doc(cid).collection("checkin").doc();
  const cno = checkinRef.id;

  await checkinRef.set({
    code: code,
    date: date,
    status: 0, // 0 = ยังไม่เริ่ม
    students: {},
    scores: {},
  });

  return cno;
};

// ฟังก์ชันนักเรียนเช็คชื่อ
export const studentCheckin = async (cid, cno, uid, studentId, studentName) => {
  const studentRef = db.collection("classroom").doc(cid).collection("checkin").doc(cno).collection("students").doc(uid);

  await studentRef.set({
    stdid: studentId,
    name: studentName,
    date: new Date().toISOString(),
  });
};

// ฟังก์ชันให้อาจารย์บันทึกคะแนน
export const updateStudentScore = async (cid, cno, studentId, score, status) => {
  const scoreRef = db.collection("classroom").doc(cid).collection("checkin").doc(cno).collection("scores").doc(studentId);

  await scoreRef.set({
    score: score,
    status: status, // 0: ไม่มา, 1: มาเรียน, 2: มาสาย
  }, { merge: true });
};
