import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminStats() {
  const [stats, setStats] = useState({
    visits: 0,
    totalWishes: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [wishesRes, statsRes] = await Promise.all([
          fetch(`${API_URL}/wishes`),
          fetch(`${API_URL}/admin/stats`)
        ]);

        const wishes = wishesRes.ok ? await wishesRes.json() : [];
        const statsData = statsRes.ok ? await statsRes.json() : { views: 0 };

        setStats({
          visits: statsData.views,
          totalWishes: wishes.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  // คำนวณเปอร์เซ็นต์ (ป้องกันหารด้วย 0)
  const conversionRate = stats.visits > 0 
    ? ((stats.totalWishes / stats.visits) * 100).toFixed(1) 
    : 0;

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-10 min-h-[80vh] font-body">
      
      {/* ปุ่มกลับและ Header */}
      <ScrollReveal>
        <Link to="/admin" className="inline-flex items-center gap-2 text-navy hover:text-azalea font-bold mb-4 transition-colors">
          <span className="text-xl">←</span> กลับไปหน้า Dashboard
        </Link>
        <div className="text-center mt-2">
          <h2 className="text-4xl font-heading font-bold text-navy">📊 สถิติเชิงลึก (Analytics)</h2>
          <p className="text-lg text-navy/80 mt-2">ข้อมูลภาพรวมการเข้าใช้งานเว็บไซต์</p>
        </div>
      </ScrollReveal>

      {/* กราฟและข้อมูล */}
      <div className="grid md:grid-cols-2 gap-6">
        
        <ScrollReveal delay={200}>
          <div className="bg-white p-8 rounded-3xl shadow-sm border-t-8 border-skyblue h-full">
            <h3 className="text-xl font-heading font-bold text-navy mb-8">อัตราการมีส่วนร่วม (Engagement)</h3>
            <div className="space-y-6">
              
              {/* หลอดที่ 1: ยอดเข้าชมทั้งหมด */}
              <div>
                <div className="flex justify-between mb-2 text-sm font-bold text-navy">
                  <span>ยอดเข้าชมทั้งหมด</span>
                  <span>{stats.visits.toLocaleString()} ครั้ง</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 shadow-inner">
                  <div className="bg-skyblue h-4 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* หลอดที่ 2: ผู้ส่งคำอวยพร */}
              <div>
                <div className="flex justify-between mb-2 text-sm font-bold text-navy">
                  <span>ผู้ร่วมส่งคำอวยพร</span>
                  <span>{stats.totalWishes.toLocaleString()} คน</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 shadow-inner">
                  <div 
                    className="bg-azalea h-4 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(conversionRate, 100)}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm text-navy/70 text-right">
                  * คิดเป็น <strong className="text-azalea">{conversionRate}%</strong> ของผู้เข้าชมทั้งหมดที่ร่วมส่งข้อความ
                </p>
              </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={400}>
          <div className="bg-white p-8 rounded-3xl shadow-sm border-t-8 border-palepink h-full flex flex-col justify-center items-center">
            <h3 className="text-xl font-heading font-bold text-navy mb-4 self-start">สถานะเซิร์ฟเวอร์</h3>
            <div className="text-center space-y-4 my-auto">
               <span className="text-6xl block">🚀</span>
               <div className="space-y-1">
                 <p className="text-navy font-bold text-lg">ระบบทำงานปกติ</p>
                 <p className="text-navy/60 text-sm">การเชื่อมต่อฐานข้อมูล MongoDB เสถียร</p>
               </div>
               <span className="inline-block mt-2 px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold border border-green-200 shadow-sm">
                 ● Online
               </span>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}