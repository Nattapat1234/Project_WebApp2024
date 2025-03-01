import { db } from "./firebase";
import { doc, setDoc, updateDoc, getDoc, deleteDoc, } from "firebase/firestore";


/** ฟังก์ชันสร้างห้องเรียนใหม่ */
export const createClassroom = async (uid, subjectCode, subjectName, photoURL, roomName) => {
  try {
    const classroomRef = doc(db, "classroom", subjectCode); // ใช้ subjectCode เป็น document ID

    // ตรวจสอบว่า users/{uid} มีอยู่หรือไม่ และดึงชื่อเจ้าของ
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    let ownerName = "ไม่ทราบชื่อ"; // ค่าเริ่มต้นหากไม่พบชื่อ

    if (userDoc.exists()) {
      const userData = userDoc.data();
      ownerName = userData.name || "ไม่ทราบชื่อ"; // ใช้ชื่อจาก Firestore ถ้ามี
    }

    const classroomData = {
      owner: ownerName, // เก็บชื่อแทน UID
      info: {
        code: subjectCode,
        name: subjectName,
        photo: photoURL || "",
        room: roomName,
      },
    };

    await setDoc(classroomRef, classroomData);

    // เพิ่มข้อมูลห้องเรียนใน users/{uid}/classroom
    if (userDoc.exists()) {
      await updateDoc(userRef, {
        [`classroom.${subjectCode}`]: { status: 1 },
      });
    } else {
      await setDoc(userRef, {
        name: ownerName, // บันทึกชื่อเจ้าของ
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
