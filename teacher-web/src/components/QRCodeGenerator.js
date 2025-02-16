import React from "react";
import { QRCodeCanvas } from "qrcode.react"; 

const QRCodeGenerator = ({ cid }) => {
  const qrValue = `https://yourwebsite.com/classroom/${cid}`;

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-bold">QR Code ห้องเรียน</h2>
      <QRCodeCanvas value={qrValue} size={200} /> 
      <p className="mt-2 text-sm">Scan เพื่อเข้าห้องเรียน</p>
    </div>
  );
};

export default QRCodeGenerator;
