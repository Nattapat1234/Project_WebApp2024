import React from "react";
import QRCode from "react-qr-code"; // ✅ ใช้ `react-qr-code`

const QRCodeGenerator = ({ cid, cno, type }) => {
  let qrValue = "";

  if (type === "classroom") {
    // ✅ QR Code สำหรับเข้าห้องเรียน
    qrValue = `myapp://classroom/join/${cid}`;
  } else if (type === "checkin") {
    // ✅ QR Code สำหรับเช็คชื่อ
    qrValue = `myapp://classroom/checkin/${cid}/${cno}`;
  }

  return (
    <div className="p-4 bg-white shadow-md rounded-lg text-center">
      <h2 className="text-lg font-bold">
        {type === "classroom" ? "QR Code สำหรับเข้าห้องเรียน" : "QR Code เช็คชื่อ"}
      </h2>
      <QRCode value={qrValue} size={200} />
      <p className="mt-2 text-sm">
        {type === "classroom" ? "สแกนเพื่อเข้าร่วมคลาสผ่านแอป" : "สแกนเพื่อเช็คชื่อผ่านแอป"}
      </p>
    </div>
  );
};

export default QRCodeGenerator;
