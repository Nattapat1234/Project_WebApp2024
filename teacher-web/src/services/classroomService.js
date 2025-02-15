import { db } from "./firebase";

// ฟังก์ชันสร้างห้องเรียนใหม่
export const createClassroom = async (uid, subjectCode, subjectName, photoURL, roomName) => {
  const newClassroomRef = db.collection("classroom").doc();
  const cid = newClassroomRef.id;

  const classroomData = {
    owner: uid,
    info: {
      code: subjectCode,
      name: subjectName,
      photo: photoURL,
      room: roomName,
    },
    students: {},
    checkin: {},
  };

  await newClassroomRef.set(classroomData);

  // เพิ่มห้องเรียนเข้าไปใน user profile
  await db.collection("users").doc(uid).update({
    [`classroom.${cid}`]: { status: 1 },
  });

  return cid;
};

// ฟังก์ชันเพิ่มนักเรียนในห้องเรียน
export const enrollStudentInClassroom = async (uid, cid, studentId, studentName) => {
  const studentRef = db.collection("classroom").doc(cid).collection("students").doc(uid);

  await studentRef.set({
    stdid: studentId,
    name: studentName,
    status: 0, // 0 = รออนุมัติ
  });

  // เพิ่มห้องเรียนใน profile ของผู้ใช้
  await db.collection("users").doc(uid).update({
    [`classroom.${cid}`]: { status: 2 },
  });
};
