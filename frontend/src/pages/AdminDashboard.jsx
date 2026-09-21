import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    visits: 0, 
    totalWishes: 0,
    pendingReports: 0,
    pendingPhotos: 0 
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [wishesRes, reportsRes, statsRes, photosRes] = await Promise.all([
          // +++ เปลี่ยนเป็น limit=1 พอ เพราะเราจะดึงแค่ตัวเลข total ไม่ได้เอารายละเอียดข้อความ +++
          fetch(`${API_URL}/wishes?limit=1`),
          fetch(`${API_URL}/admin/reports`),
          fetch(`${API_URL}/admin/stats`),
          fetch(`${API_URL}/admin/gallery/pending`) 
        ]);

        const wishesData = wishesRes.ok ? await wishesRes.json() : {};
        const reportsData = reportsRes.ok ? await reportsRes.json() : [];
        const statsData = statsRes.ok ? await statsRes.json() : { views: 0 };
        const photosData = photosRes.ok ? await photosRes.json() : [];

        // +++ ดึงยอดรวมจากคีย์ total โดยตรงเลย (Backend คุณทำสรุปมาให้แล้ว) +++
        const wishesCount = wishesData.total || (Array.isArray(wishesData.items) ? wishesData.items.length : 0);
        const reportsCount = Array.isArray(reportsData) ? reportsData.length : (reportsData?.items?.length || 0);
        const photosCount = Array.isArray(photosData) ? photosData.length : (photosData?.items?.length || 0);

        setStats({
          visits: statsData?.views || 0, 
          totalWishes: wishesCount,
          pendingReports: reportsCount,
          pendingPhotos: photosCount 
        });
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-10 min-h-[80vh] font-body">
      
      {/* Header */}
      <ScrollReveal>
        <div className="text-center">
          <h2 className="text-4xl font-heading font-bold text-navy">⚙️ Admin Dashboard</h2>
          <p className="text-lg text-navy/80 mt-2">ศูนย์ควบคุมระบบหลังบ้าน</p>
        </div>
      </ScrollReveal>

      {/* สถิติภาพรวม */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        <ScrollReveal delay={100}>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-t-8 border-skyblue text-center h-full flex flex-col justify-center hover:-translate-y-1 transition-transform duration-300">
            <p className="text-navy/70 text-xs md:text-sm font-bold mb-2">👁️ ผู้เข้าชม</p>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-navy">{(stats?.visits || 0).toLocaleString()}</h3>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={250}>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-t-8 border-palepink text-center h-full flex flex-col justify-center hover:-translate-y-1 transition-transform duration-300">
            <p className="text-navy/70 text-xs md:text-sm font-bold mb-2">💌 ข้อความทั้งหมด</p>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-navy">{(stats?.totalWishes || 0).toLocaleString()}</h3>
          </div>
        </ScrollReveal>
        
        <ScrollReveal delay={400}>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-t-8 border-azalea text-center relative h-full flex flex-col justify-center hover:-translate-y-1 transition-transform duration-300">
            <p className="text-navy/70 text-xs md:text-sm font-bold mb-2">🚨 รีพอร์ตข้อความ</p>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-red-500">{(stats?.pendingReports || 0).toLocaleString()}</h3>
            {(stats?.pendingReports > 0) && (
              <span className="absolute top-4 right-4 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={550}>
          <div className="bg-white p-6 rounded-3xl shadow-sm border-t-8 border-yellow-400 text-center relative h-full flex flex-col justify-center hover:-translate-y-1 transition-transform duration-300">
            <p className="text-navy/70 text-xs md:text-sm font-bold mb-2">📸 รออนุมัติรูป</p>
            <h3 className="text-3xl md:text-4xl font-heading font-bold text-yellow-500">{(stats?.pendingPhotos || 0).toLocaleString()}</h3>
            {(stats?.pendingPhotos > 0) && (
              <span className="absolute top-4 right-4 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
              </span>
            )}
          </div>
        </ScrollReveal>
      </div>

      {/* เมนูจัดการ */}
      <div className="space-y-4 pt-4">
        <ScrollReveal delay={500}>
          <h3 className="text-2xl font-heading font-bold text-navy border-b-4 border-skyblue pb-2 inline-block">
            เมนูจัดการ
          </h3>
        </ScrollReveal>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          
          <ScrollReveal delay={600}>
            <Link to="/admin/reports" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border-2 border-transparent hover:border-azalea group flex flex-col items-center gap-3 text-center h-full">
              <span className="text-4xl group-hover:scale-110 transition-transform">🚨</span>
              <div>
                <h4 className="font-heading font-bold text-navy text-lg">จัดการข้อความ</h4>
                <p className="text-sm text-navy/70">ตรวจสอบและลบข้อความที่ไม่เหมาะสม</p>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={700}>
            <Link to="/admin/imagerequest" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border-2 border-transparent hover:border-yellow-400 group flex flex-col items-center gap-3 text-center h-full">
              <span className="text-4xl group-hover:scale-110 transition-transform">📸</span>
              <div>
                <h4 className="font-heading font-bold text-navy text-lg">ตรวจสอบรูปภาพ</h4>
                <p className="text-sm text-navy/70">อนุมัติหรือปฏิเสธรูปภาพจากแฟนคลับ</p>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={800}>
            <Link to="/admin/stats" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border-2 border-transparent hover:border-skyblue group flex flex-col items-center gap-3 text-center h-full">
              <span className="text-4xl group-hover:scale-110 transition-transform">📊</span>
              <div>
                <h4 className="font-heading font-bold text-navy text-lg">สถิติเชิงลึก</h4>
                <p className="text-sm text-navy/70">ดูข้อมูลการเข้าชมและภาพรวมเว็บไซต์</p>
              </div>
            </Link>
          </ScrollReveal>

          <ScrollReveal delay={900}>
            <Link to="/admin/export" className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition border-2 border-transparent hover:border-green-400 group flex flex-col items-center gap-3 text-center h-full">
              <span className="text-4xl group-hover:scale-110 transition-transform">📥</span>
              <div>
                <h4 className="font-heading font-bold text-navy text-lg">Export ข้อมูล</h4>
                <p className="text-sm text-navy/70">ดาวน์โหลดรูปและข้อความไปใช้ในคาเฟ่</p>
              </div>
            </Link>
          </ScrollReveal>

        </div>
      </div>

    </div>
  );
}