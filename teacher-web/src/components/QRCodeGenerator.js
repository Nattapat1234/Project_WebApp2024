import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { db } from "../services/firebase";
import { doc, getDoc } from "firebase/firestore";

const QRCodeGenerator = ({ cid, cno, type }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClassroom = async () => {
      if (!cid) return;
      try {
        const docRef = doc(db, "classroom", cid);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          console.error("❌ ไม่พบข้อมูลห้องเรียน");
        }
      } catch (error) {
        console.error("⚠️ เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
      setLoading(false);
    };
    fetchClassroom();
  }, [cid]);

  // ✅ กำหนดค่า QR Code:
  // - "cid" สำหรับเข้าห้องเรียน
  // - "cid/cno" สำหรับเช็คชื่อ
  const qrValue = type === "checkin" && cno ? `${cid}/${cno}` : cid;

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
        {type === "classroom" ? "สแกน QR Code เพื่อเข้าห้องเรียน" : "สแกน QR Code เพื่อเช็คชื่อ"}
      </p>
      <p className="qr-code-text">รหัสห้องเรียน: {cid || "ไม่มีข้อมูล"}</p>
      {cno && <p className="qr-code-text">รอบเช็คชื่อ: {cno}</p>}
    </div>
  );
};

export default QRCodeGenerator;
