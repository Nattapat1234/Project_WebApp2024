import { db } from "./firebase";
import { doc, setDoc, updateDoc, getDoc, deleteDoc, collection } from "firebase/firestore";

/** ✅ ฟังก์ชันสร้างห้องเรียนใหม่ */
export const createClassroom = async (uid, subjectCode, subjectName, photoURL, roomName) => {
  try {
    const newClassroomRef = doc(collection(db, "classroom")); // 🔹 สร้าง reference ห้องเรียนใหม่
    const cid = newClassroomRef.id;

    const classroomData = {
      owner: uid, // 🔹 ระบุเจ้าของห้องเรียน
      info: {
        code: subjectCode,
        name: subjectName,
        photo: photoURL || "",
        room: roomName,
      },
    };

    await setDoc(newClassroomRef, classroomData); // 🔹 บันทึกข้อมูลลง Firestore

    // 🔹 ตรวจสอบว่า `users/{uid}` มีอยู่หรือไม่
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // 🔹 ถ้ามี user อยู่แล้ว อัปเดตข้อมูล
      await updateDoc(userRef, {
        [`classroom.${cid}`]: { status: 1 },
      });
    } else {
      // 🔹 ถ้ายังไม่มี ให้สร้างเอกสารใหม่
      await setDoc(userRef, {
        name: "ไม่ทราบชื่อ",
        email: "",
        photo: "",
        classroom: {
          [cid]: { status: 1 },
        },
      });
    }

    return cid;
  } catch (error) {
    console.error("🔥 Error creating classroom:", error);
    throw error;
  }
};

/** ✅ ฟังก์ชันแก้ไขข้อมูลห้องเรียน */
export const updateClassroom = async (cid, updatedData) => {
  try {
    const classroomRef = doc(db, "classroom", cid);
    await updateDoc(classroomRef, { info: updatedData });
  } catch (error) {
    console.error("🔥 Error updating classroom:", error);
    throw error;
  }
};

/** ✅ ฟังก์ชันลบห้องเรียน */
export const deleteClassroom = async (cid, uid) => {
  try {
    await deleteDoc(doc(db, "classroom", cid));

    // 🔹 ลบห้องเรียนออกจาก `users/{uid}/classroom`
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedClassrooms = { ...userData.classroom };
      delete updatedClassrooms[cid];

      await updateDoc(userRef, { classroom: updatedClassrooms });
    }
  } catch (error) {
    console.error("🔥 Error deleting classroom:", error);
    throw error;
  }
};
