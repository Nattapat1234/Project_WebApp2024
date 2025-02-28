import { db } from "./firebase";
import { doc, setDoc, updateDoc, getDoc, deleteDoc, } from "firebase/firestore";

/** ฟังก์ชันสร้างห้องเรียนใหม่ โดยใช้ subjectCode เป็น document ID */
export const createClassroom = async (uid, subjectCode, subjectName, photoURL, roomName) => {
  try {
    const classroomRef = doc(db, "classroom", subjectCode); // ใช้ subjectCode เป็น document ID

    const classroomData = {
      owner: uid, 
      info: {
        code: subjectCode,
        name: subjectName,
        photo: photoURL || "",
        room: roomName,
      },
    };

    await setDoc(classroomRef, classroomData);

    // ตรวจสอบว่า users/{uid} มีอยู่หรือไม่
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      await updateDoc(userRef, {
        [`classroom.${subjectCode}`]: { status: 1 },
      });
    } else {
      await setDoc(userRef, {
        name: "ไม่ทราบชื่อ",
        email: "",
        photo: "",
        classroom: {
          [subjectCode]: { status: 1 },
        },
      });
    }

    return subjectCode;
  } catch (error) {
    console.error("Error creating classroom:", error);
    throw error;
  }
};

/** ฟังก์ชันแก้ไขข้อมูลห้องเรียน */
export const updateClassroom = async (subjectCode, updatedData) => {
  try {
    const classroomRef = doc(db, "classroom", subjectCode);
    await updateDoc(classroomRef, { info: updatedData });
  } catch (error) {
    console.error("Error updating classroom:", error);
    throw error;
  }
};

/** ฟังก์ชันลบห้องเรียน */
export const deleteClassroom = async (subjectCode, uid) => {
  try {
    await deleteDoc(doc(db, "classroom", subjectCode));

    // ลบห้องเรียนออกจาก users/{uid}/classroom
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedClassrooms = { ...userData.classroom };
      delete updatedClassrooms[subjectCode];

      await updateDoc(userRef, { classroom: updatedClassrooms });
    }
  } catch (error) {
    console.error("Error deleting classroom:", error);
    throw error;
  }
};
