import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  // === 🚀 ระบบ Easter Egg (สุ่มรูปและข้อความ) ===
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [randomImage, setRandomImage] = useState('');
  const [randomMessage, setRandomMessage] = useState('');

  const surpriseMessages = {
    th: [
      "แอบมากดอะไรตรงนี้เนี่ย! ความลับแตกหมดแล้ววว 🤫",
      "ขอบคุณที่แวะมานะ! รับหัวใจไปเลยดวงโตๆ 🩵",
      "เก่งมาก! คุณคือสุดยอดนักสืบประจำด้อมเรา 🕵️‍♀️",
      "เจอความลับแล้ว ห้ามเอาไปบอกใครนะ! จุ๊ๆ 🤐",
      "อุตส่าห์ซ่อนไว้ตั้งลึก ยังหาเจออีก เก่งจัง! ✨",
      "คุณได้รับสิทธิ์ในการโดนตกอีก 100 ครั้ง! 💘"
    ],
    en: [
      "What are you clicking? The secret is out! 🤫",
      "Thanks for dropping by! Have a big heart 🩵",
      "Great job! You're the best detective in the fandom 🕵️‍♀️",
      "You found the secret! Don't tell anyone! 🤐",
      "Hidden so deep, but you still found it. Amazing! ✨",
      "You have received the right to fall in love 100 more times! 💘"
    ]
  };

  const handleLogoClick = (e) => {
    setClickCount((prev) => prev + 1);
    
    if (clickCount + 1 === 3) {
      e.preventDefault(); 
      
      const randomNum = Math.floor(Math.random() * 10) + 1;
      const formattedNum = randomNum.toString().padStart(2, '0');
      setRandomImage(`/assets/secret/${formattedNum}.png`);

      const messages = surpriseMessages[language] || surpriseMessages.th;
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setRandomMessage(randomMsg);

      setShowEasterEgg(true);
      setClickCount(0); 
    }
  };

  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);
  // ===================================

  // 1. เพิ่ม Icon (SVG) ให้กับแต่ละเมนูเพื่อใช้สำหรับ Bottom Navigation
  const navLinks = [
    { 
      name: t.nav.home, 
      path: '/',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
    },
    { 
      name: t.nav.profile, 
      path: '/profile',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
    },
    { 
      name: t.nav.project, 
      path: '/project',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
    },
    { 
      name: t.nav.gallery, 
      path: '/gallery',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
    },
    { 
      name: t.nav.guestbook, 
      path: '/guestbook',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
    },
    { 
      name: t.nav.faq, 
      path: '/faq',
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    },
  ];

  return (
    <>
      {/* 2. Top Navbar (แสดงผลบนทุกหน้าจอ แต่บนมือถือจะเหลือแค่ Logo กับ สลับภาษา) */}
      <nav className="bg-palepink text-navy sticky top-0 z-50 shadow-sm font-heading">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16">
            
            <Link 
              to="/" 
              onClick={handleLogoClick}
              className="flex items-center gap-3 text-xl md:text-2xl font-bold tracking-wider hover:text-azalea transition z-50 select-none cursor-pointer group"
            >
              <img 
                src="/assets/logo.png" 
                alt="Hongshi Logo" 
                className="h-9 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-sm"
              />
              <span className="sm:block">Hongshi Day</span>
            </Link>

            {/* เมนูสำหรับ Desktop */}
            <div className="hidden md:flex space-x-6 items-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className={`font-bold hover:text-azalea transition-colors ${location.pathname === link.path ? 'text-azalea' : ''}`}
                >
                  {link.name}
                </Link>
              ))}

              <button 
                onClick={toggleLanguage}
                className="ml-4 px-3 py-1 bg-white/60 border-2 border-white rounded-full text-sm font-bold text-navy hover:bg-azalea hover:text-white hover:border-azalea transition-all duration-300 shadow-sm flex items-center gap-1 uppercase tracking-wider"
              >
                🌐 {language}
              </button>
            </div>

            {/* ปุ่มสลับภาษาบนมือถือ (ย้ายมาไว้ขวาสุดแทน Hamburger) */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={toggleLanguage}
                className="px-3 py-1 bg-white/80 border-2 border-white rounded-full text-xs font-bold text-navy hover:bg-azalea hover:text-white transition-all shadow-sm uppercase flex items-center gap-1"
              >
                🌐 {language}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 3. Bottom Navigation Bar (แสดงผลเฉพาะบนมือถือ) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-200 z-[90] pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        <div className="flex justify-around items-center h-16 px-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path} 
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-200 ${
                  isActive ? 'text-azalea' : 'text-navy/50 hover:text-navy/80'
                }`}
              >
                <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  {link.icon}
                </div>
                <span className={`text-[10px] font-bold font-body leading-none ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                  {link.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* === โมดอล Easter Egg (สุ่มภาพและข้อความ) === */}
      {showEasterEgg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md transition-opacity pb-20 md:pb-4">
          <div className="bg-white p-8 md:p-10 rounded-[35px] w-[95%] md:w-full max-w-sm shadow-2xl relative border-4 border-skyblue text-center animate-bounce-short">
            
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl">
              🎁
            </div>

            <div 
              className="relative w-full aspect-square bg-beige rounded-2xl overflow-hidden mb-6 mt-4 shadow-inner border-2 border-palepink select-none"
              onContextMenu={(e) => e.preventDefault()} 
              onDragStart={(e) => e.preventDefault()} 
            >
              <div className="absolute inset-0 z-10 w-full h-full bg-transparent"></div>
              
              <img 
                src={randomImage} 
                alt="Secret Surprise" 
                className="w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/400x400/FFE4E1/2D3748?text=Secret+Photo";
                }}
              />
            </div>

            <h3 className="text-xl md:text-2xl font-heading font-bold text-navy mb-2">
              {language === 'th' ? '🎉 เซอร์ไพรส์!' : '🎉 Surprise!'}
            </h3>
            
            <p className="font-body text-navy/80 text-sm md:text-base leading-relaxed mb-6 font-medium">
              {randomMessage}
            </p>

            <button 
              onClick={() => setShowEasterEgg(false)}
              className="w-full bg-skyblue text-navy font-bold py-3 rounded-2xl hover:bg-azalea hover:text-white transition-colors shadow-sm"
            >
              {language === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
            </button>
          </div>
        </div>
      )}

      {/* Animation และ Safe Area สำหรับ iOS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounceShort {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-short {
          animation: bounceShort 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .pb-safe {
          padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}} />
    </>
  );
}