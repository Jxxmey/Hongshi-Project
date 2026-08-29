import { useState, useEffect, useRef } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext'; // +++ ดึง Hook ของภาษามาใช้

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Guestbook() {
  const { t } = useLanguage(); // +++ เรียกใช้ตัวแปร t
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [wishes, setWishes] = useState([]);
  const [activeBubbles, setActiveBubbles] = useState([]);
  
  const wishesRef = useRef(wishes);
  const activeBubblesRef = useRef(activeBubbles); 

  useEffect(() => {
    wishesRef.current = wishes;
  }, [wishes]);

  useEffect(() => {
    activeBubblesRef.current = activeBubbles;
  }, [activeBubbles]);

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
      const currentBubbles = activeBubblesRef.current;
      
      if (allWishes.length === 0) return;
      
      const randomWish = allWishes[Math.floor(Math.random() * allWishes.length)];
      const bubbleId = Date.now() + Math.random();
      
      let top, left;
      let isOverlapping = true;
      let attempts = 0;

      while (isOverlapping && attempts < 20) {
        top = Math.floor(Math.random() * 55) + 15; 
        left = Math.floor(Math.random() * 65) + 5; 
        
        isOverlapping = currentBubbles.some(bubble => {
          const bTop = parseFloat(bubble.top);
          const bLeft = parseFloat(bubble.left);
          return Math.abs(bTop - top) < 25 && Math.abs(bLeft - left) < 30;
        });
        
        attempts++;
      }
      
      const themes = [
        "from-skyblue to-palepink", 
        "from-palepink to-azalea", 
        "from-skyblue to-beige", 
        "from-skyblue to-azalea"
      ];
      const randomTheme = themes[Math.floor(Math.random() * themes.length)];

      const newBubble = { ...randomWish, bubbleId, top: `${top}%`, left: `${left}%`, theme: randomTheme };

      setActiveBubbles(prev => {
        const next = [...prev, newBubble];
        if (next.length > 6) return next.slice(1);
        return next;
      });

      setTimeout(() => {
        setActiveBubbles(prev => prev.filter(b => b.bubbleId !== bubbleId));
      }, 9000);
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
        
        const forcedBubble = { ...responseData, bubbleId, top: '40%', left: '35%', theme: "from-skyblue to-azalea" }; 
        setActiveBubbles(prev => [...prev.slice(-3), forcedBubble]);
        
        setTimeout(() => {
          setActiveBubbles(prev => prev.filter(b => b.bubbleId !== bubbleId));
        }, 9000);

        setName('');
        setMessage('');
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          setIsModalOpen(false);
        }, 2000);
      } else {
        alert(responseData.detail || "Error sending wish.");
      }
    } catch (error) {
      alert("Cannot connect to server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReport = async (wishId, bubbleId) => {
    if(!window.confirm("คุณต้องการรายงานว่าข้อความนี้ไม่เหมาะสมใช่หรือไม่? (Do you want to report this message?)")) return;
    
    try {
      await fetch(`${API_URL}/wishes/${wishId}/report`, { method: 'POST' });
      setWishes(prev => prev.filter(w => w.id !== wishId));
      setActiveBubbles(prev => prev.filter(b => b.bubbleId !== bubbleId));
      alert("รายงานสำเร็จ แอดมินจะทำการตรวจสอบให้เร็วที่สุดครับ (Report submitted.)");
    } catch (error) {
      console.error("Report error:", error);
    }
  };

  return (
    <div className="relative min-h-[85vh] w-full overflow-hidden bg-gradient-to-b from-beige via-white to-palepink/30 selection:bg-azalea selection:text-white pb-20">
      
      <ScrollReveal>
        <div className="text-center pt-10 px-4 relative z-10 pointer-events-none">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy drop-shadow-sm">
            {t.guestbook.title}
          </h2>
          <p className="text-lg font-body text-navy/80 mt-3 bg-white/60 inline-block px-6 py-2 rounded-full shadow-sm backdrop-blur-sm">
            {t.guestbook.subtitle}
          </p>
        </div>
      </ScrollReveal>

      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {wishes.length === 0 && !isSubmitting && (
          <div className="absolute inset-0 flex items-center justify-center opacity-50">
            <p className="font-body text-navy bg-white/50 px-6 py-3 rounded-full">{t.guestbook.waiting}</p>
          </div>
        )}
        
        {activeBubbles.map((wish) => (
          <div
            key={wish.bubbleId}
            className="absolute float-in-out pointer-events-auto hover:z-50"
            style={{ top: wish.top, left: wish.left }}
          >
            <div className={`relative p-[3px] rounded-[30px] bg-gradient-to-br ${wish.theme} shadow-[0_8px_30px_rgb(0,0,0,0.08)] max-w-[280px] md:max-w-[320px] group transition-transform duration-300 hover:scale-105`}>
              
              <button 
                onClick={() => handleReport(wish.id, wish.bubbleId)}
                className="absolute -top-3 -right-3 bg-white text-gray-300 hover:text-red-500 hover:bg-red-50 w-8 h-8 rounded-full shadow-md flex items-center justify-center text-sm transition-all opacity-0 group-hover:opacity-100 border border-gray-100 z-20"
                title="Report"
              >
                🚨
              </button>
              
              <div className="bg-white/95 backdrop-blur-md px-6 py-5 rounded-[27px] flex flex-col gap-3 relative">
                <span className={`absolute top-2 left-4 text-5xl opacity-10 bg-clip-text text-transparent bg-gradient-to-br ${wish.theme} font-serif leading-none`}>
                  "
                </span>
                <p className="text-navy font-body text-sm md:text-base leading-relaxed break-words relative z-10 text-center font-medium px-2">
                  {wish.message}
                </p>
                <div className="flex justify-center items-center mt-2 border-t border-gray-100/60 pt-3">
                  <span className={`font-heading font-bold text-xs px-4 py-1.5 rounded-full bg-gradient-to-r ${wish.theme} text-white shadow-sm`}>
                    From: {wish.name}
                  </span>
                </div>
              </div>

              <div className={`absolute -bottom-[8px] left-1/2 -translate-x-1/2 w-6 h-6 bg-gradient-to-br ${wish.theme} rotate-45 rounded-sm -z-10`}></div>
              <div className="absolute -bottom-[5px] left-1/2 -translate-x-1/2 w-6 h-6 bg-white rotate-45 rounded-sm -z-10"></div>
            </div>
          </div>
        ))}
      </div>

      <ScrollReveal delay={300}>
        <button
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40 group flex items-center gap-2 md:gap-3 bg-gradient-to-r from-skyblue to-palepink text-navy px-5 py-3 md:px-7 md:py-4 rounded-full shadow-[0_10px_30px_rgba(110,199,235,0.4)] border-[3px] border-white hover:from-azalea hover:to-palepink hover:text-white hover:shadow-[0_15px_35px_rgba(255,143,171,0.5)] hover:-translate-y-1 transition-all duration-300 pointer-events-auto"
          title="Send Wish"
        >
          <span className="text-2xl md:text-3xl group-hover:animate-bounce">💌</span>
          <span className="font-heading font-bold text-sm md:text-lg tracking-wide">{t.guestbook.sendBtn}</span>
        </button>
      </ScrollReveal>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade-in pointer-events-auto">
          <div className="bg-white p-8 md:p-10 rounded-[35px] w-[95%] md:w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto border-t-8 border-skyblue">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-6 text-navy/40 hover:text-azalea bg-gray-100 hover:bg-palepink w-8 h-8 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
            >
              ✕
            </button>

            {showSuccess ? (
              <div className="text-center py-10 space-y-4">
                <span className="text-7xl block drop-shadow-md">💌</span>
                <h3 className="text-2xl font-heading font-bold text-navy">{t.guestbook.successTitle}</h3>
                <p className="font-body text-navy/70">{t.guestbook.successDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 font-body text-navy mt-2">
                <div className="text-center mb-6">
                  <span className="text-4xl block mb-2">🎈</span>
                  <h3 className="text-2xl font-heading font-bold text-navy">{t.guestbook.modalTitle}</h3>
                </div>
                
                <div className="space-y-2">
                  <label className="font-bold ml-2 text-sm text-navy/80">{t.guestbook.nameLabel}</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.guestbook.namePlaceholder} className="w-full bg-beige/20 border-2 border-skyblue/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-azalea focus:ring-4 focus:ring-azalea/10 transition-all" required />
                </div>
                
                <div className="space-y-2">
                  <label className="font-bold ml-2 text-sm text-navy/80">{t.guestbook.msgLabel}</label>
                  <textarea rows="3" value={message} onChange={(e) => setMessage(e.target.value)} placeholder={t.guestbook.msgPlaceholder} className="w-full bg-beige/20 border-2 border-skyblue/30 rounded-2xl px-5 py-3.5 focus:outline-none focus:border-azalea focus:ring-4 focus:ring-azalea/10 transition-all resize-none" required ></textarea>
                </div>
                
                <button type="submit" disabled={isSubmitting} className="w-full font-heading font-bold text-lg px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 bg-skyblue text-navy hover:bg-azalea hover:text-white hover:-translate-y-1">
                  {isSubmitting ? t.guestbook.submitting : t.guestbook.submitBtn}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInOutFloat {
          0% { opacity: 0; transform: translateY(40px) translateX(0px) scale(0.9); }
          15% { opacity: 1; transform: translateY(10px) translateX(-15px) scale(1); }
          50% { opacity: 1; transform: translateY(-20px) translateX(15px) scale(1.02); }
          85% { opacity: 1; transform: translateY(-60px) translateX(-10px) scale(1); }
          100% { opacity: 0; transform: translateY(-90px) translateX(0px) scale(0.9); }
        }
        .float-in-out {
          animation: fadeInOutFloat 9s ease-in-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />
    </div>
  );
}