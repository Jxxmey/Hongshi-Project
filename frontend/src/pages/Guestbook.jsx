import { useState, useEffect, useRef } from 'react';
import ScrollReveal from '../components/ScrollReveal'; // นำเข้า ScrollReveal

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Guestbook() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [wishes, setWishes] = useState([]);
  const [activeBubbles, setActiveBubbles] = useState([]);
  const wishesRef = useRef(wishes);

  useEffect(() => {
    wishesRef.current = wishes;
  }, [wishes]);

  const fetchWishes = async () => {
    try {
      const response = await fetch(`${API_URL}/wishes`);
      if (response.ok) {
        const data = await response.json();
        setWishes(data);
      }
    } catch (error) {
      console.error("Error fetching wishes:", error);
    }
  };

  useEffect(() => {
    fetchWishes();
  }, []);

  useEffect(() => {
    const spawnBubble = () => {
      const allWishes = wishesRef.current;
      if (allWishes.length === 0) return;
      
      const randomWish = allWishes[Math.floor(Math.random() * allWishes.length)];
      
      const bubbleId = Date.now() + Math.random();
      const top = Math.floor(Math.random() * 60) + 10;
      const left = Math.floor(Math.random() * 60) + 10;
      
      const themes = ["from-skyblue to-palepink", "from-palepink to-azalea", "from-skyblue to-beige", "from-skyblue to-azalea"];
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];

      const newBubble = { ...randomWish, bubbleId, top: `${top}%`, left: `${left}%`, theme: randomTheme };

      setActiveBubbles(prev => {
        const next = [...prev, newBubble];
        if (next.length > 8) return next.slice(1);
        return next;
      });

      setTimeout(() => {
        setActiveBubbles(prev => prev.filter(b => b.bubbleId !== bubbleId));
      }, 8000);
    };

    const interval = setInterval(spawnBubble, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newWishData = {
      name: name.trim() || "Anonymous LYY",
      message: message.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWishData),
      });

      const responseData = await response.json();

      if (response.ok) {
        setWishes(prev => [responseData, ...prev]);
        const bubbleId = Date.now() + Math.random();
        const forcedBubble = { ...responseData, bubbleId, top: '40%', left: '30%', theme: "from-skyblue to-azalea" }; 
        setActiveBubbles(prev => [...prev.slice(-3), forcedBubble]);
        
        setTimeout(() => {
          setActiveBubbles(prev => prev.filter(b => b.bubbleId !== bubbleId));
        }, 8000);

        setName('');
        setMessage('');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsModalOpen(false);
        }, 2000);
      } else {
        alert(responseData.detail || "เกิดข้อผิดพลาดในการส่งข้อความ");
      }
    } catch (error) {
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async (wishId, bubbleId) => {
    if(!window.confirm("คุณต้องการรายงานว่าข้อความนี้ไม่เหมาะสมใช่หรือไม่?")) return;
    
    try {
      await fetch(`${API_URL}/wishes/${wishId}/report`, { method: 'POST' });
      setWishes(prev => prev.filter(w => w.id !== wishId));
      setActiveBubbles(prev => prev.filter(b => b.bubbleId !== bubbleId));
      alert("รายงานสำเร็จ แอดมินจะทำการตรวจสอบให้เร็วที่สุดครับ");
    } catch (error) {
      console.error("Report error:", error);
    }
  };

  return (
    <div className="relative min-h-[85vh] w-full overflow-hidden bg-beige selection:bg-azalea selection:text-white pb-20">
      
      {/* 1. ใส่เอฟเฟกต์ให้ Header ค่อยๆ ลอยขึ้นมา */}
      <ScrollReveal>
        <div className="text-center pt-10 px-4 relative z-10 pointer-events-none">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy">
            Birthday Wishes Board
          </h2>
          <p className="text-lg font-body text-navy/80 mt-2">
            คำอวยพรจาก LYKYOU จะลอยมาส่งถึงฮงชิเรื่อยๆ 💌
          </p>
        </div>
      </ScrollReveal>

      {/* บับเบิ้ลข้อความที่ลอยไปมา ไม่ต้องใส่ ScrollReveal เพราะมี Animation CSS ในตัวอยู่แล้ว */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {wishes.length === 0 && !isSubmitting && (
          <div className="absolute inset-0 flex items-center justify-center opacity-50">
            <p className="font-body text-navy">กำลังรอข้อความอวยพรแรก...</p>
          </div>
        )}
        
        {activeBubbles.map((wish) => (
          <div
            key={wish.bubbleId}
            className="absolute float-in-out pointer-events-auto"
            style={{ top: wish.top, left: wish.left }}
          >
            <div className={`p-[2px] rounded-2xl bg-gradient-to-br ${wish.theme} shadow-lg max-w-[280px] md:max-w-[350px] relative group`}>
              <button 
                onClick={() => handleReport(wish.id, wish.bubbleId)}
                className="absolute -top-3 -right-3 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-full shadow-md flex items-center justify-center text-sm transition-all opacity-0 group-hover:opacity-100 border border-gray-200 z-10"
                title="รายงานความไม่เหมาะสม"
              >
                🚨
              </button>
              <div className="bg-white/90 backdrop-blur-md px-5 py-4 rounded-[14px] flex flex-col gap-2">
                <p className="text-navy font-body text-sm md:text-base leading-relaxed break-words">
                  "{wish.message}"
                </p>
                <div className="flex justify-end items-center mt-1">
                  <span className="font-heading font-bold text-navy/80 text-xs bg-beige/50 px-3 py-1 rounded-full">
                    จาก: {wish.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. ใส่เอฟเฟกต์หน่วงเวลาให้ปุ่มส่งข้อความ ค่อยๆ โผล่ตามมา */}
      <ScrollReveal delay={300}>
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 bg-skyblue text-navy w-16 h-16 rounded-full shadow-2xl flex items-center justify-center text-3xl hover:bg-azalea hover:scale-110 hover:rotate-12 transition-all duration-300 border-2 border-white pointer-events-auto"
          title="ส่งคำอวยพร"
        >
          💌
        </button>
      </ScrollReveal>

      {/* โมดอลส่งข้อความ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="bg-white p-6 md:p-10 rounded-[30px] w-[95%] md:w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-6 text-navy/50 hover:text-azalea text-2xl font-bold transition"
            >
              ✕
            </button>

            {showSuccess ? (
              <div className="text-center py-10 space-y-4">
                <span className="text-6xl block">💌</span>
                <h3 className="text-2xl font-heading font-bold text-navy">ส่งคำอวยพรสำเร็จ!</h3>
                <p className="font-body text-navy/70">ข้อความของคุณลอยไปหาฮงชิแล้วครับ</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-body text-navy mt-2">
                <h3 className="text-2xl font-heading font-bold text-navy">ส่งคำอวยพร 💌</h3>
                <div className="space-y-2">
                  <label className="font-bold ml-2">ชื่อ / แอคเคานต์</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น @hongshihoshi_fan" className="w-full bg-beige/30 border-2 border-skyblue/50 rounded-xl px-4 py-3 focus:outline-none focus:border-azalea focus:ring-2 focus:ring-azalea/30 transition" required />
                </div>
                <div className="space-y-2">
                  <label className="font-bold ml-2">คำอวยพรถึงฮงชิ</label>
                  <textarea rows="3" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="พิมพ์ข้อความอวยพรของคุณที่นี่..." className="w-full bg-beige/30 border-2 border-skyblue/50 rounded-xl px-4 py-3 focus:outline-none focus:border-azalea focus:ring-2 focus:ring-azalea/30 transition resize-none" required ></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className="w-full font-heading font-bold text-lg px-8 py-4 rounded-xl shadow-md transition-colors duration-300 bg-skyblue text-navy hover:bg-azalea">
                  {isSubmitting ? 'กำลังส่งความรัก...' : '🚀 ส่งข้อความ'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInOutFloat {
          0% { opacity: 0; transform: translateY(30px) scale(0.9); }
          10% { opacity: 1; transform: translateY(0px) scale(1); }
          80% { opacity: 1; transform: translateY(-20px) scale(1); }
          100% { opacity: 0; transform: translateY(-40px) scale(0.9); }
        }
        .float-in-out {
          animation: fadeInOutFloat 8s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}} />
    </div>
  );
}