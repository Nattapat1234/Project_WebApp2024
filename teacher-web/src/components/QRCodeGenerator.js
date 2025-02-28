import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const QRCodeGenerator = ({ cid, cno, type }) => {
  const [subjectCode, setSubjectCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjectCode = async () => {
      if (!cid) return;
      try {
        const docRef = doc(db, "classroom", cid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().info?.code) {
          setSubjectCode(docSnap.data().info.code);
        } else {
          console.error("❌ ไม่พบข้อมูลรหัสวิชา");
          setSubjectCode(cid); // ✅ ใช้ `cid` เป็นค่าหลักหากไม่มีรหัสวิชา
        }
      } catch (error) {
        console.error("⚠️ เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
        setSubjectCode(cid);
      }
      setLoading(false);
    };
    fetchSubjectCode();
  }, [cid]);

  // ✅ สร้างค่า QR Code เป็นแค่ **รหัสห้องเรียน หรือ รหัสเช็คชื่อ**
  let qrValue = "";
  if (type === "classroom") {
    qrValue = subjectCode; // ✅ แสดงรหัสห้องเรียน
  } else if (type === "checkin" && cno) {
    qrValue = `${subjectCode}-${cno}`; // ✅ แสดงเป็น `รหัสห้อง-รหัสเช็คชื่อ`
  }

  return (
    <div className="qr-container">
      <h2 className="qr-title">
        {type === "classroom" ? "QR Code สำหรับเข้าห้องเรียน" : "QR Code เช็คชื่อ"}
      </h2>
      <div className="qr-box">
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : qrValue ? (
          <>
            <QRCode value={qrValue} size={200} className="qr-code" />
            {/* <p className="qr-code-text">{qrValue}</p> ✅ แสดงรหัสตรงกับ QR Code */}
          </>
        ) : (
          <p className="error-message">ไม่พบข้อมูลที่ใช้ได้</p>
        )}
      </div>
      <p className="qr-description">
        {type === "classroom" ? "สแกน QR Code เพื่อรับรหัสห้องเรียน" : "สแกน QR Code เพื่อรับรหัสเช็คชื่อ"}
      </p>
      <p className="qr-code-text">รหัสห้องเรียน: {subjectCode || "ไม่มีข้อมูล"}</p>
      {cno && <p className="qr-code-text">รอบเช็คชื่อ: {cno}</p>}
    </div>
  );
};

export default QRCodeGenerator;
