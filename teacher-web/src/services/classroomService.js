import { db } from "./firebase";
import { 
  doc, setDoc, updateDoc, getDoc, deleteDoc, collection, getDocs 
} from "firebase/firestore";

/**  ฟังก์ชันสุ่มรหัส 6 ตัว */
const generateRandomCID = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase(); 
};

/**  ฟังก์ชันลบคอลเลกชันย่อยทั้งหมด */
const deleteSubcollections = async (parentDocPath) => {
  const subcollections = ["checkin", "students", "question"]; //  ระบุคอลเลกชันย่อยที่ต้องการลบ
  try {
    for (const subcollection of subcollections) {
      const subcollectionRef = collection(db, `${parentDocPath}/${subcollection}`);
      const snapshot = await getDocs(subcollectionRef);
      snapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
      });
    }
  } catch (error) {
    console.error(`Error deleting subcollections in ${parentDocPath}:`, error);
    throw error;
  }
};

/**  ฟังก์ชันสร้างห้องเรียนใหม่ */
export const createClassroom = async (uid, subjectCode, subjectName, photoURL, roomName) => {
  try {
    const cid = generateRandomCID(); //  สร้างรหัสสุ่ม 6 ตัว
    const classroomRef = doc(db, "classroom", cid);

    //  ตรวจสอบว่า users/{uid} มีอยู่หรือไม่ และดึงชื่อเจ้าของ
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    let ownerName = "ไม่ทราบชื่อ"; // ค่าเริ่มต้นหากไม่พบชื่อ

    if (userDoc.exists()) {
      const userData = userDoc.data();
      ownerName = userData.name || "ไม่ทราบชื่อ"; // ใช้ชื่อจาก Firestore ถ้ามี
    }

    const classroomData = {
      owner: ownerName, //  เก็บชื่อแทน UID
      info: {
        code: subjectCode,
        name: subjectName,
        photo: photoURL || "",
        room: roomName,
      },
    };

    await setDoc(classroomRef, classroomData);

    //  เพิ่มข้อมูลห้องเรียนใน users/{uid}/classroom
    if (userDoc.exists()) {
      await updateDoc(userRef, {
        [`classroom.${cid}`]: { status: 1 },
      });
    } else {
      await setDoc(userRef, {
        name: ownerName,
        email: "",
        photo: "",
        classroom: {
          [cid]: { status: 1 },
        },
      });
    }

    return cid;
  } catch (error) {
    console.error("Error creating classroom:", error);
    throw error;
  }
};

/**  ฟังก์ชันแก้ไขข้อมูลห้องเรียน */
export const updateClassroom = async (cid, updatedData) => {
  try {
    const classroomRef = doc(db, "classroom", cid);
    await updateDoc(classroomRef, { info: updatedData });
  } catch (error) {
    console.error("Error updating classroom:", error);
    throw error;
  }
};

/**  ฟังก์ชันลบห้องเรียน */
export const deleteClassroom = async (cid, uid) => {
  try {
    const classroomPath = `classroom/${cid}`;

    //  ลบคอลเลกชันย่อยก่อน
    await deleteSubcollections(classroomPath);

    //  ลบเอกสารห้องเรียน
    await deleteDoc(doc(db, classroomPath));

    //  ลบห้องเรียนออกจาก users/{uid}/classroom
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedClassrooms = { ...userData.classroom };
      delete updatedClassrooms[cid];

      await updateDoc(userRef, { classroom: updatedClassrooms });
    }

    console.log(`ห้องเรียน ${cid} และคอลเลกชันย่อยถูกลบเรียบร้อยแล้ว`);
  } catch (error) {
    console.error("Error deleting classroom:", error);
    throw error;
  }
};
