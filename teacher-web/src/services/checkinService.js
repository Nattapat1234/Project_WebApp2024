import { db } from "../services/firebase";
import { doc, updateDoc } from "firebase/firestore";

/** ✅ ฟังก์ชันสร้างเช็คชื่อ */
export const createCheckin = async (cid) => {
  // ฟังก์ชันนี้จะใช้สร้างการเช็คชื่อใหม่
};

/** ✅ ฟังก์ชันเปิดเช็คชื่อ */
export const openCheckin = async (cid, cno) => {
  const checkinRef = doc(db, "classroom", cid, "checkin", cno);
  try {
    await updateDoc(checkinRef, {
      status: "open",
    });
    console.log(`✅ เปิดเช็คชื่อสำเร็จ: ${cid}/${cno}`);
  } catch (error) {
    console.error("❌ Error opening check-in:", error);
    throw error;
  }
};

/** ✅ ฟังก์ชันปิดเช็คชื่อ */
export const closeCheckin = async (cid, cno) => {
  const checkinRef = doc(db, "classroom", cid, "checkin", cno);
  try {
    await updateDoc(checkinRef, {
      status: "closed",
    });
    console.log(`✅ ปิดเช็คชื่อสำเร็จ: ${cid}/${cno}`);
  } catch (error) {
    console.error("❌ Error closing check-in:", error);
    throw error;
  }
};

/** ✅ ฟังก์ชันบันทึกคะแนน */
export const saveCheckinScores = async (cid, cno) => {
  // ฟังก์ชันนี้ใช้บันทึกคะแนนการเช็คชื่อ
};

/** ✅ ฟังก์ชันลบนักเรียนออกจากการเช็คชื่อ */
export const deleteStudent = async (cid, cno, studentId) => {
  // ฟังก์ชันนี้ใช้ลบนักเรียน
};
