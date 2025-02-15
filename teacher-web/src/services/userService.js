import { db } from "./firebase";

// บันทึกข้อมูลผู้ใช้เมื่อ Login
export const saveUserToFirestore = async (user) => {
  if (!user) return;

  const userRef = db.collection("users").doc(user.uid);
  const doc = await userRef.get();

  if (!doc.exists) {
    await userRef.set({
      name: user.displayName || "",
      email: user.email || "",
      photo: user.photoURL || "",
      classroom: {},
    });
  }
};

// ดึงข้อมูลผู้ใช้จาก Firestore
export const getUserData = async (uid) => {
  const userRef = db.collection("users").doc(uid);
  const doc = await userRef.get();
  return doc.exists ? doc.data() : null;
};
