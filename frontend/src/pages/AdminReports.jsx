import { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminReports() {
  const [pendingWishes, setPendingWishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPendingWishes = async () => {
    try {
      // ดึงข้อมูลคำอวยพรที่ติดสถานะ pending (จากตัวกรองคำหยาบ)
      const response = await fetch(`${API_URL}/admin/wishes/pending`);
      if (response.ok) {
        const data = await response.json();
        // ป้องกันระบบพัง
        const items = data.items || (Array.isArray(data) ? data : []);
        setPendingWishes(items);
      }
    } catch (error) {
      console.error("Error fetching pending wishes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingWishes();
  }, []);

  const handleApprove = async (id) => {
    if(!window.confirm("แน่ใจหรือไม่ว่าข้อความนี้ปลอดภัยและต้องการอนุมัติให้แสดงบนหน้าเว็บ?")) return;
    try {
      await fetch(`${API_URL}/admin/wishes/${id}/approve`, { method: 'POST' });
      setPendingWishes(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      console.error("Error approving wish:", error);
    }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("คุณต้องการลบข้อความนี้ทิ้งถาวรเลยใช่ไหม?")) return;
    try {
      await fetch(`${API_URL}/admin/wishes/${id}`, { method: 'DELETE' });
      setPendingWishes(prev => prev.filter(w => w.id !== id));
    } catch (error) {
      console.error("Error deleting wish:", error);
    }
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-8 min-h-[80vh] font-body">
      
      <div className="text-center">
        <h2 className="text-4xl font-heading font-bold text-navy">🚨 ระบบจัดการคำอวยพร (Moderation)</h2>
        <p className="text-lg text-navy/80 mt-2">ตรวจสอบคำอวยพรที่ถูกบล็อกโดยระบบคัดกรองคำหยาบอัตโนมัติ</p>
      </div>

      {isLoading ? (
        <p className="text-center text-navy font-bold">กำลังโหลดข้อมูล...</p>
      ) : pendingWishes.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl shadow-sm text-center border-2 border-skyblue/30">
          <span className="text-5xl block mb-4">✨</span>
          <p className="text-xl text-navy font-bold">ไม่มีคำอวยพรที่รอการตรวจสอบ</p>
          <p className="text-navy/70">สังคมคุณภาพสุดๆ เลยครับตอนนี้!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {pendingWishes.map((wish) => (
            <div key={wish.id} className="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-azalea flex flex-col justify-between gap-4">
              <div>
                <p className="text-navy font-bold text-sm bg-beige/50 inline-block px-3 py-1 rounded-full mb-3">
                  จาก: {wish.name}
                </p>
                <p className="text-navy text-lg bg-gray-50 p-4 rounded-xl border border-gray-100">
                  "{wish.message}"
                </p>
              </div>
              
              <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleApprove(wish.id)}
                  className="bg-skyblue text-navy px-4 py-2 rounded-xl font-bold text-sm hover:bg-opacity-80 transition"
                >
                  ✅ อนุมัติ (แสดงผล)
                </button>
                <button 
                  onClick={() => handleDelete(wish.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-600 transition shadow-sm"
                >
                  🗑️ ลบทิ้งถาวร
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}