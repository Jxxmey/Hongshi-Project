import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminReports() {
  const [pendingWishes, setPendingWishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // +++ ฟังก์ชันช่วยสกัด ID ที่ถูกต้องออกมา ไม่ว่าจะมาในรูปแบบไหน +++
  const extractId = (wish) => {
    if (wish.id) return wish.id;
    if (wish._id) {
       // รองรับกรณี _id มาเป็น Object {"$oid": "..."} จาก MongoDB
       return typeof wish._id === 'object' ? wish._id.$oid : wish._id;
    }
    return Math.random().toString(36).substr(2, 9); // Fallback ป้องกันแครช
  };

  const fetchPendingWishes = async () => {
    setIsLoading(true);
    try {
      // ดึงข้อมูล 2 แหล่งพร้อมกัน (ติดคำหยาบ + โดนผู้ใช้รีพอร์ต)
      const [pendingRes, reportedRes] = await Promise.all([
        fetch(`${API_URL}/admin/wishes/pending`),
        fetch(`${API_URL}/admin/reports`) 
      ]);

      let combinedWishes = [];

      // 1. จัดการข้อมูลติดคำหยาบ (Auto-filter)
      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        const items = Array.isArray(pendingData) ? pendingData : (pendingData.items || []);
        
        const mappedPending = items.map(w => ({ 
          ...w, 
          // บังคับแปลง id ให้เป็น string เพื่อใช้เป็น key
          safeId: extractId(w),
          flagType: 'auto-filter' 
        }));
        combinedWishes = [...combinedWishes, ...mappedPending];
      }

      // 2. จัดการข้อมูลที่โดนผู้ใช้รีพอร์ต (User-report)
      if (reportedRes.ok) {
        const reportedData = await reportedRes.json();
        const items = Array.isArray(reportedData) ? reportedData : (reportedData.items || []);
        
        const mappedReported = items.map(w => ({ 
          ...w, 
          safeId: extractId(w),
          flagType: 'user-report' 
        }));
        
        // กรองเอาอันซ้ำออก (กรณีข้อความติดทั้งคำหยาบ และโดนรีพอร์ตด้วย โดยเช็คผ่าน safeId)
        const uniqueReported = mappedReported.filter(rw => !combinedWishes.some(cw => cw.safeId === rw.safeId));
        combinedWishes = [...combinedWishes, ...uniqueReported];
      }

      setPendingWishes(combinedWishes);
      
    } catch (error) {
      console.error("Error fetching pending/reported wishes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingWishes();
  }, []);

  const handleApprove = async (id, flagType) => {
    if(!window.confirm("แน่ใจหรือไม่ว่าข้อความนี้ปลอดภัยและต้องการอนุมัติให้แสดงบนหน้าเว็บ?")) return;
    try {
      if (flagType === 'user-report') {
        // ถ้าเป็นข้อความที่โดนแจ้งรีพอร์ต ให้ยิงไปเคลียร์ค่า reported
        await fetch(`${API_URL}/admin/wishes/${id}/dismiss`, { method: 'POST' });
      } else {
        // ถ้าเป็นข้อความที่ติดตัวกรองคำหยาบ ให้ยิงไปปรับ status เป็น approved
        await fetch(`${API_URL}/admin/wishes/${id}/approve`, { method: 'POST' });
      }
      
      // เอาข้อความนั้นออกจากหน้าจอ
      setPendingWishes(prev => prev.filter(w => w.safeId !== id));
    } catch (error) {
      console.error("Error approving wish:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("คุณต้องการลบข้อความนี้ทิ้งถาวรเลยใช่ไหม?")) return;
    try {
      await fetch(`${API_URL}/admin/wishes/${id}`, { method: 'DELETE' });
      setPendingWishes(prev => prev.filter(w => w.safeId !== id));
    } catch (error) {
      console.error("Error deleting wish:", error);
      alert("เกิดข้อผิดพลาดในการลบ กรุณาลองใหม่อีกครั้ง");
    }
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-8 min-h-[80vh] font-body">
      
      <div className="text-center">
        <h2 className="text-4xl font-heading font-bold text-navy">🚨 ระบบจัดการข้อความถูกรายงาน</h2>
        <p className="text-lg text-navy/80 mt-2">ตรวจสอบคำอวยพรที่ถูกบล็อกโดยระบบและที่ถูกแจ้งรายงานจากผู้ใช้</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin text-4xl">⏳</div>
        </div>
      ) : pendingWishes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm text-center border-2 border-skyblue/30">
          <span className="text-5xl block mb-4">✨</span>
          <p className="text-xl text-navy font-bold">ไม่มีข้อความที่รอการตรวจสอบ</p>
          <p className="text-navy/70">สังคมคุณภาพสุดๆ เลยครับตอนนี้!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {pendingWishes.map((wish) => (
            // +++ เปลี่ยนมาใช้ safeId ทั้งหมด +++
            <div key={wish.safeId} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-azalea flex flex-col justify-between gap-4 relative">
              
              <div className="absolute -top-3 -right-2">
                {wish.flagType === 'user-report' ? (
                  <span className="bg-red-100 text-red-600 border border-red-200 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    🚩 ผู้ใช้รายงาน
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-700 border border-yellow-200 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    🤖 บล็อกโดยระบบ
                  </span>
                )}
              </div>

              <div>
                <p className="text-navy font-bold text-sm bg-beige/50 inline-block px-3 py-1 rounded-full mb-3 mt-2">
                  จาก: {wish.name}
                </p>
                <p className="text-navy text-lg bg-gray-50 p-4 rounded-xl border border-gray-100 whitespace-pre-line">
                  "{wish.message}"
                </p>
              </div>
              
              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleApprove(wish.safeId, wish.flagType)}
                  className="bg-skyblue text-navy px-4 py-2 rounded-xl font-bold text-sm hover:bg-opacity-80 transition"
                >
                  ✅ อนุมัติ (แสดงผล)
                </button>
                <button 
                  onClick={() => handleDelete(wish.safeId)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition shadow-sm"
                >
                  🗑️ ลบทิ้ง
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}