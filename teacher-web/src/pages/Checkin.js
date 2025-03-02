import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { collection, doc, getDoc, onSnapshot, deleteDoc } from "firebase/firestore";
import { createCheckin, openCheckin, closeCheckin } from "../services/checkinService";
import { db } from "../services/firebase";
import QRCodeGenerator from "../components/QRCodeGenerator";
import "../styles/Checkin.css";

const Checkin = () => {
  const { cid } = useParams();
  const [classroomInfo, setClassroomInfo] = useState(null); //  ข้อมูลคลาสรูม
  const [checkinHistory, setCheckinHistory] = useState([]);
  const [selectedCno, setSelectedCno] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [loading, setLoading] = useState(false);

  //  ดึงข้อมูลคลาสรูม
  useEffect(() => {
    const fetchClassroomInfo = async () => {
      const classroomRef = doc(db, "classroom", cid);
      const docSnap = await getDoc(classroomRef);

      if (docSnap.exists()) {
        setClassroomInfo(docSnap.data().info);
      } else {
        console.error("ไม่พบข้อมูลห้องเรียน");
      }
    };

    fetchClassroomInfo();
  }, [cid]);

  // ✅ ดึงประวัติการเช็คชื่อ
  useEffect(() => {
    const checkinRef = collection(db, "classroom", cid, "checkin");
    const unsubscribe = onSnapshot(checkinRef, (snapshot) => {
      const history = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          cno: parseInt(doc.id.replace("cno", ""), 10) // ดึงเลขรอบออกมา
        }))
        .sort((a, b) => a.cno - b.cno); // เรียงตามเลขรอบ
  
      setCheckinHistory(history);
    });
  
    return () => unsubscribe();
  }, [cid]);
  

  // สร้างรอบเช็คชื่อใหม่
  const handleCreateCheckin = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const newCno = await createCheckin(cid);
      alert(`✅ สร้างรอบเช็คชื่อใหม่สำเร็จ`);
    } catch (error) {
      console.error("❌ Error creating check-in:", error);
      alert("ไม่สามารถสร้างรอบเช็คชื่อได้");
    }
    setLoading(false);
  };

  // ลบรอบเช็คชื่อ
  const deleteCheckin = async (cno) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบรอบเช็คชื่อนี้?")) {
      try {
        await deleteDoc(doc(db, "classroom", cid, "checkin", cno));
        alert("✅ ลบรอบเช็คชื่อสำเร็จ!");
      } catch (error) {
        console.error("❌ Error deleting check-in:", error);
        alert("ไม่สามารถลบรอบเช็คชื่อได้");
      }
    }
  };

  return (
    <div className="checkin-container">
      {/*  แสดงข้อมูลคลาสรูม */}
      {classroomInfo && (
        <div className="classroom-header">
          <img src={classroomInfo.photo} alt="Classroom" className="classroom-image" />
          <div className="classroom-info">
            <h2 className="classroom-code">{classroomInfo.code}</h2>
            <h3 className="classroom-name">{classroomInfo.name}</h3>
          </div>
        </div>
      )}

      <h1 className="checkin-title">หน้าการเช็คชื่อ</h1>

      <div className="menu-container">
        <button onClick={handleCreateCheckin} className="btn btn-new" disabled={loading}>
          {loading ? "กำลังสร้าง..." : "สร้างรอบเช็คชื่อใหม่"}
        </button>
      </div>

      <h2 className="checkin-history-title">ประวัติการเช็คชื่อ</h2>
      <div className="checkin-history-list">
        {checkinHistory.map((checkin, index) => (
          <div 
            key={checkin.id} 
            className={`checkin-card ${checkin.status === "open" ? "card-open" : "card-closed"}`}
          >
            <div className="checkin-header">
              <p>
                เช็คชื่อรอบที่ {index + 1} วันที่ {new Date(checkin.date).toLocaleDateString()}{" "}
                {new Date(checkin.date).toLocaleTimeString()}
              </p>
            </div>
            <div className="checkin-body">
              <div className="checkin-buttons">
                <button onClick={() => openCheckin(cid, checkin.id)} className="btn btn-open">
                  เปิด
                </button>
                <button onClick={() => closeCheckin(cid, checkin.id)} className="btn btn-close">
                  ปิด
                </button>
                <button
                  onClick={() => {
                    setSelectedCno(checkin.id);
                    setShowQR(true);
                  }}
                  className="btn btn-qrcode"
                >
                  แสดง QR CODE
                </button>
                <Link to={`/classroom/${cid}/checkin/${checkin.id}`} className="btn btn-detail">
                  ดูรายละเอียด
                </Link>
                <Link to={`/classroom/${cid}/checkin/${checkin.id}/question`} className="btn btn-question">
                  ถามคำถาม
                </Link>
                <button onClick={() => deleteCheckin(checkin.id)} className="btn btn-delete">
                  ลบ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showQR && selectedCno && (
        <div className="qr-popup">
          <div className="qr-popup-content">
            <span className="qr-close" onClick={() => setShowQR(false)}>
              &times;
            </span>
            <QRCodeGenerator cid={cid} cno={selectedCno} type="checkin" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkin;
