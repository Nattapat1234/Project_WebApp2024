import React from "react";
import { QRCodeCanvas } from "qrcode.react"; 

const QRCodeGenerator = ({ cid }) => {
  const qrValue = `https://yourwebsite.com/classroom/${cid}`;

  return (
    <div className="qr-container">
      <h2 className="qr-title">QR Code ห้องเรียน</h2>
      <div className="qr-box">
        <QRCodeCanvas value={qrValue} size={200} className="qr-code" />
      </div>
      <p className="qr-description">Scan เพื่อเข้าห้องเรียน</p>
    </div>
  );
};

export default QRCodeGenerator;
