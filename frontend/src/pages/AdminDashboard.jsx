import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    visits: 1254, // (Mock ข้อมูลจำลองไปก่อน เดี๋ยวเราค่อยทำ API นับยอดวิวทีหลังครับ)
    totalWishes: 0,
    pendingReports: 0
  });

  // ดึงข้อมูลจำนวนข้อความและจำนวนรีพอร์ตแบบ Real-time
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [wishesRes, reportsRes] = await Promise.all([
          fetch(`${API_URL}/wishes`),
          fetch(`${API_URL}/admin/reports`)
        ]);

        const wishes = wishesRes.ok ? await wishesRes.json() : [];
        const reports = reportsRes.ok ? await reportsRes.json() : [];

        setStats(prev => ({
          ...prev,
          totalWishes: wishes.length,
          pendingReports: reports.length
        }));
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-10 min-h-[80vh] font-body">
      
      {/* Header */}
      <div className="text-center">
        <h2 className="text-4xl font-heading font-bold text-navy">⚙️ Admin Dashboard</h2>
        <p className="text-lg text-navy/80 mt-2">ศูนย์ควบคุมระบบหลังบ้าน</p>
      </div>

      {/* สถิติภาพรวม (Stats Overview) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border-t-8 border-skyblue text-center">
          <p className="text-navy/70 font-bold mb-2">👁️ ยอดเข้าชมเว็บไซต์ (ครั้ง)</p>
          <h3 className="text-4xl font-heading font-bold text-navy">{stats.visits.toLocaleString()}</h3>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border-t-8 border-palepink text-center">
          <p className="text-navy/70 font-bold mb-2">💌 จำนวนคำอวยพร (ข้อความ)</p>
          <h3 className="text-4xl font-heading font-bold text-navy">{stats.totalWishes.toLocaleString()}</h3>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border-t-8 border-azalea text-center relative">
          <p className="text-navy/70 font-bold mb-2">🚨 รอตรวจสอบ (รีพอร์ต)</p>
          <h3 className="text-4xl font-heading font-bold text-red-500">{stats.pendingReports.toLocaleString()}</h3>
          {stats.pendingReports > 0 && (
            <span className="absolute top-4 right-4 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
        </div>
      </div>

      {/* เมนูจัดการ (Admin Menus) */}
      <div className="space-y-4">
        <h3 className="text-2xl font-heading font-bold text-navy border-b-4 border-skyblue pb-2 inline-block">
          เมนูจัดการ
        </h3>
        
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          
          <Link to="/admin/reports" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border-2 border-transparent hover:border-azalea group flex flex-col items-center gap-3 text-center">
            <span className="text-4xl group-hover:scale-110 transition-transform">🚨</span>
            <div>
              <h4 className="font-heading font-bold text-navy text-lg">จัดการรีพอร์ต</h4>
              <p className="text-sm text-navy/70">ตรวจสอบและลบข้อความที่ไม่เหมาะสม</p>
            </div>
          </Link>

          {/* เมนูจำลอง (เผื่อทำในอนาคต) */}
          <div className="bg-white/50 opacity-60 p-6 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center gap-3 text-center cursor-not-allowed">
            <span className="text-4xl grayscale">📊</span>
            <div>
              <h4 className="font-heading font-bold text-navy text-lg">สถิติเชิงลึก</h4>
              <p className="text-sm text-navy/70">(กำลังพัฒนา)</p>
            </div>
          </div>

          <div className="bg-white/50 opacity-60 p-6 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center gap-3 text-center cursor-not-allowed">
            <span className="text-4xl grayscale">🎁</span>
            <div>
              <h4 className="font-heading font-bold text-navy text-lg">จัดการของแจก</h4>
              <p className="text-sm text-navy/70">(กำลังพัฒนา)</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}