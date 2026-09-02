import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminImageRequest() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // เก็บ ID ของรูปที่กำลังกดทำรายการอยู่

  // ดึงข้อมูลรูปรออนุมัติ
  const fetchPendingPhotos = async () => {
    try {
      const response = await fetch(`${API_URL}/admin/gallery/pending`);
      if (response.ok) {
        const data = await response.json();
        setPhotos(data);
      }
    } catch (error) {
      console.error("Error fetching pending photos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPhotos();
  }, []);

  // ฟังก์ชันอนุมัติรูป (Approve)
  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const response = await fetch(`${API_URL}/admin/gallery/${id}/approve`, {
        method: 'POST'
      });
      if (response.ok) {
        // ลบรูปที่อนุมัติแล้วออกจาก List หน้าจอ
        setPhotos(photos.filter(p => p._id !== id));
      } else {
        alert('เกิดข้อผิดพลาดในการอนุมัติรูป');
      }
    } catch (error) {
      console.error("Approve error:", error);
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    } finally {
      setActionLoading(null);
    }
  };

  // ฟังก์ชันปฏิเสธ/ลบรูปทิ้ง (Reject)
  const handleReject = async (id) => {
    if (!window.confirm("แน่ใจหรือไม่ว่าต้องการลบรูปนี้ทิ้ง? (รูปจะถูกลบออกจาก Cloudinary ด้วย)")) return;
    
    setActionLoading(id);
    try {
      const response = await fetch(`${API_URL}/admin/gallery/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        // ลบรูปที่ปฏิเสธออกจาก List หน้าจอ
        setPhotos(photos.filter(p => p._id !== id));
      } else {
        alert('เกิดข้อผิดพลาดในการลบรูป');
      }
    } catch (error) {
      console.error("Reject error:", error);
      alert('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto space-y-8 min-h-[80vh] font-body">
      
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b-2 border-palepink pb-6">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-navy flex items-center gap-3">
              📸 ตรวจสอบรูปภาพ
              <span className="bg-yellow-400 text-white text-base md:text-lg px-4 py-1 rounded-full shadow-sm">
                {photos.length}
              </span>
            </h2>
            <p className="text-navy/70 mt-2">รูปภาพที่รออนุมัติเพื่อแสดงในแกลเลอรี</p>
          </div>
          
          <Link 
            to="/admin" 
            className="font-bold text-navy bg-white border-2 border-skyblue px-6 py-2 rounded-full hover:bg-skyblue transition-colors shadow-sm"
          >
            ← กลับหน้า Admin
          </Link>
        </div>
      </ScrollReveal>

      {/* List ของรูปภาพ */}
      {loading ? (
        <div className="text-center py-20 animate-pulse text-navy/60 font-bold">
          กำลังโหลดข้อมูล... ⏳
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-[30px] shadow-sm border-2 border-dashed border-palepink">
          <span className="text-5xl block mb-4">✨</span>
          <p className="text-navy/60 font-bold text-lg">ยังไม่มีรูปภาพใหม่ที่รอตรวจสอบครับ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <ScrollReveal key={photo._id} delay={(index % 6) * 100}>
              <div className="bg-white p-4 rounded-3xl shadow-sm border-2 border-palepink flex flex-col h-full hover:shadow-md transition-shadow">
                
                {/* รูปภาพ */}
                <div className="w-full aspect-[3/4] bg-beige rounded-2xl overflow-hidden relative mb-4">
                  <img 
                    src={photo.imageUrl} 
                    alt="Pending upload" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {actionLoading === photo._id && (
                    <div className="absolute inset-0 bg-navy/50 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-bold animate-pulse">กำลังประมวลผล...</span>
                    </div>
                  )}
                </div>

                {/* รายละเอียด */}
                <div className="mb-4 text-center">
                  <p className="text-sm text-navy/60">ผู้อัปโหลด:</p>
                  <p className="font-bold text-navy truncate">{photo.uploaderName}</p>
                  <p className="text-xs text-navy/50 mt-1">
                    {new Date(photo.createdAt).toLocaleString('th-TH')}
                  </p>
                </div>

                {/* ปุ่มจัดการ */}
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => handleReject(photo._id)}
                    disabled={actionLoading === photo._id}
                    className="bg-red-50 text-red-600 font-bold py-2.5 rounded-xl border-2 border-red-100 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors disabled:opacity-50"
                  >
                    🗑️ ลบทิ้ง
                  </button>
                  <button 
                    onClick={() => handleApprove(photo._id)}
                    disabled={actionLoading === photo._id}
                    className="bg-green-50 text-green-600 font-bold py-2.5 rounded-xl border-2 border-green-100 hover:bg-green-500 hover:text-white hover:border-green-500 transition-colors disabled:opacity-50"
                  >
                    ✅ อนุมัติ
                  </button>
                </div>

              </div>
            </ScrollReveal>
          ))}
        </div>
      )}

    </div>
  );
}