import { db } from "../services/firebase";
import { doc, setDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

/**  ฟังก์ชันสร้างรอบเช็คชื่อใหม่ */
export const createCheckin = async (cid) => {
  try {
    const checkinRef = collection(db, "classroom", cid, "checkin");

    // ค้นหารอบล่าสุด
    const snapshot = await getDocs(checkinRef);
    const newCno = `cno${snapshot.size + 1}`; // นับจำนวนรอบแล้วเพิ่มขึ้น 1

    const newCheckinRef = doc(checkinRef, newCno);

    const checkinData = {
      code: `CHK${newCno}${Date.now()}`,
      status: "open",
      date: new Date().toISOString(),
    };

    await setDoc(newCheckinRef, checkinData);
    console.log("✅ Check-in created:", checkinData);
    return newCno;
  } catch (error) {
    console.error("❌ Error creating check-in:", error);
    throw error;
  }
};

/** ฟังก์ชันเปิดเช็คชื่อ */
export const openCheckin = async (cid, cno) => {
  try {
    await updateDoc(doc(db, "classroom", cid, "checkin", cno), { status: "open" });
  } catch (error) {
    console.error("Error opening check-in:", error);
    throw error;
  }
};

/**  ฟังก์ชันปิดเช็คชื่อ */
export const closeCheckin = async (cid, cno) => {
  try {
    await updateDoc(doc(db, "classroom", cid, "checkin", cno), { status: "closed" });
  } catch (error) {
    console.error("Error closing check-in:", error);
    throw error;
  }
};

/** ฟังก์ชันบันทึกการเช็คชื่อนักเรียน */
export const checkInStudent = async (cid, cno, studentId, studentName) => {
  const studentRef = doc(db, "classroom", cid, "checkin", cno, "students", studentId);
  try {
    const checkinData = {
      name: studentName,
      checkinTime: new Date().toISOString(),
    };

    await setDoc(studentRef, checkinData);
  } catch (error) {
    console.error("Error checking in student:", error);
    throw error;
  }
};

/**  ฟังก์ชันลบนักเรียนออกจากการเช็คชื่อ */
export const deleteStudent = async (cid, cno, studentId) => {
  try {
    await deleteDoc(doc(db, "classroom", cid, "checkin", cno, "students", studentId));
  } catch (error) {
    console.error("Error deleting student:", error);
    throw error;
  }
};
