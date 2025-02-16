import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/** ฟังก์ชันเพิ่มนักเรียนเข้าห้องเรียน */
export const enrollStudentInClassroom = async (uid, cid, studentId, studentName) => {
  try {
    const studentRef = doc(db, "classroom", cid, "students", uid);

    // 🔹 เพิ่มข้อมูลนักเรียนใน `/classroom/{cid}/students/{sid}`
    await setDoc(studentRef, {
      stdid: studentId,
      name: studentName,
      status: 0, // 0 = รออนุมัติ
    });

    // 🔹 เพิ่มห้องเรียนลงใน `users/{uid}/classroom`
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        [`classroom.${cid}`]: { status: 2 }, // 2 = นักเรียน
      });
    } else {
      await setDoc(userRef, {
        name: studentName,
        email: "",
        photo: "",
        classroom: {
          [cid]: { status: 2 },
        },
      });
    }

    return true;
  } catch (error) {
    console.error("Error enrolling student:", error);
    throw error;
  }
};
