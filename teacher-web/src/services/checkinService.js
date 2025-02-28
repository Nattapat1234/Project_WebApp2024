import { db } from "../services/firebase";
import { doc, setDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";

/**  ฟังก์ชันสร้างรอบเช็คชื่อใหม่ */
export const createCheckin = async (cid) => {
  try {
    const checkinRef = collection(db, "classroom", cid, "checkin");
    const snapshot = await getDocs(checkinRef);

    // ✅ หาค่า cno ล่าสุด และเพิ่ม +1
    let newCno = 1;
    if (!snapshot.empty) {
      const cnoList = snapshot.docs
        .map(doc => parseInt(doc.id.replace("cno", ""), 10))
        .filter(num => !isNaN(num));
      if (cnoList.length > 0) {
        newCno = Math.max(...cnoList) + 1;
      }
    }

    const newCheckinId = `cno${newCno}`;
    const newCheckinRef = doc(checkinRef, newCheckinId);

    const checkinData = {
      code: `CHK${newCheckinId}${Date.now()}`,
      status: "closed", // ปิดเช็คชื่อเริ่มต้น
      date: new Date().toISOString(),
    };

    await setDoc(newCheckinRef, checkinData);
    console.log("✅ Check-in created:", checkinData);
    return newCheckinId;
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
