import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // 1. ดึงภาษาปัจจุบัน, ฟังก์ชันสลับภาษา, และคำแปล (t) มาใช้งาน
  const { language, toggleLanguage, t } = useLanguage();

  // === 🚀 ระบบ Easter Egg (สุ่มรูปและข้อความ) ===
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [randomImage, setRandomImage] = useState('');
  const [randomMessage, setRandomMessage] = useState('');

  // คลังข้อความสุ่ม (แยก 2 ภาษา)
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

  // ฟังก์ชันนับการกดโลโก้
  const handleLogoClick = (e) => {
    setClickCount((prev) => prev + 1);
    
    // ถ้ากดรัวๆ ครบ 3 ครั้ง
    if (clickCount + 1 === 3) {
      e.preventDefault(); // ป้องกันไม่ให้โหลดหน้าใหม่
      
      // 1. สุ่มตัวเลข 1 ถึง 10 แล้วทำให้เป็น format "01", "02", ..., "10"
      const randomNum = Math.floor(Math.random() * 10) + 1;
      const formattedNum = randomNum.toString().padStart(2, '0');
      setRandomImage(`/assets/secret/${formattedNum}.png`);

      // 2. สุ่มข้อความตามภาษาปัจจุบัน
      const messages = surpriseMessages[language] || surpriseMessages.th;
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      setRandomMessage(randomMsg);

      setShowEasterEgg(true);
      setClickCount(0); // รีเซ็ตการนับ
    }
  };

  // รีเซ็ตการนับใหม่ ถ้าหยุดกดเกิน 2 วินาที
  useEffect(() => {
    if (clickCount > 0) {
      const timer = setTimeout(() => setClickCount(0), 2000);
      return () => clearTimeout(timer);
    }
  }, [clickCount]);
  // ===================================

  // 2. เปลี่ยนข้อความให้ดึงจากไฟล์แปลภาษาแทนการพิมพ์ตรงๆ
  const navLinks = [
    { name: t.nav.home, path: '/' },
    { name: t.nav.profile, path: '/profile' },
    { name: t.nav.project, path: '/project' },
    { name: t.nav.guestbook, path: '/guestbook' },
    { name: t.nav.faq, path: '/faq' },
  ];

  return (
    <>
      <nav className="bg-palepink text-navy sticky top-0 z-50 shadow-sm font-heading">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* โลโก้ (ซ้าย) - ผูกฟังก์ชันนับคลิกตรงนี้ */}
            <Link 
              to="/" 
              onClick={handleLogoClick}
              className="text-2xl font-bold tracking-wider hover:text-azalea transition z-50 select-none cursor-pointer"
            >
              Hongshi Day
            </Link>

            {/* เมนูสำหรับ Desktop (ซ่อนบนมือถือ) */}
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

              {/* 3. ปุ่มสลับภาษา TH/EN สำหรับ Desktop */}
              <button 
                onClick={toggleLanguage}
                className="ml-4 px-3 py-1 bg-white/60 border-2 border-white rounded-full text-sm font-bold text-navy hover:bg-azalea hover:text-white hover:border-azalea transition-all duration-300 shadow-sm flex items-center gap-1 uppercase tracking-wider"
              >
                🌐 {language}
              </button>
            </div>

            {/* ปุ่ม Hamburger Menu สำหรับมือถือ (แสดงเฉพาะหน้าจอเล็ก) */}
            <div className="md:hidden flex items-center z-50 gap-4">
              
              {/* 4. ปุ่มสลับภาษา TH/EN สำหรับ Mobile (อยู่ข้างปุ่ม 3 ขีด) */}
              <button 
                onClick={toggleLanguage}
                className="px-3 py-1 bg-white/60 border-2 border-white rounded-full text-xs font-bold text-navy hover:bg-azalea hover:text-white transition-all shadow-sm uppercase"
              >
                {language}
              </button>

              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="text-navy hover:text-azalea focus:outline-none transition-colors p-2"
                aria-label="Toggle Menu"
              >
                {/* ใช้ SVG ไอคอนเพื่อให้ดูคมชัดและสวยงามบนมือถือ */}
                {isOpen ? (
                  // ไอคอน กากบาท (✕) ตอนเปิดเมนู
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // ไอคอน 3 ขีด (Hamburger) ตอนปิดเมนู
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* แถบเมนู Dropdown ที่สไลด์ลงมาบนมือถือ */}
        <div 
          className={`md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100 transition-all duration-300 ease-in-out origin-top ${
            isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
          }`}
        >
          <div className="flex flex-col px-4 pt-4 pb-6 space-y-2 shadow-inner">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path} 
                onClick={() => setIsOpen(false)} // กดเลือกเมนูแล้วให้ปิด Dropdown อัตโนมัติ
                className={`block px-4 py-3 rounded-xl font-bold text-center transition-colors ${
                  location.pathname === link.path 
                    ? 'bg-palepink text-azalea' 
                    : 'text-navy hover:bg-beige'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* === โมดอล Easter Egg (สุ่มภาพและข้อความ) === */}
      {showEasterEgg && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md transition-opacity">
          <div className="bg-white p-8 md:p-10 rounded-[35px] w-[95%] md:w-full max-w-sm shadow-2xl relative border-4 border-skyblue text-center animate-bounce-short">
            
            {/* กราฟิกตกแต่ง */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-6xl">
              🎁
            </div>

            {/* ส่วนรูปภาพลับที่ถูกสุ่มมา พร้อมระบบป้องกันการเซฟ */}
            <div 
              className="relative w-full aspect-square bg-beige rounded-2xl overflow-hidden mb-6 mt-4 shadow-inner border-2 border-palepink select-none"
              onContextMenu={(e) => e.preventDefault()} // 🔒 ป้องกันคลิกขวา
              onDragStart={(e) => e.preventDefault()} // 🔒 ป้องกันการลากรูป
            >
              {/* แผ่นใสบังทับอีกชั้น */}
              <div className="absolute inset-0 z-10 w-full h-full bg-transparent"></div>
              
              <img 
                src={randomImage} 
                alt="Secret Surprise" 
                className="w-full h-full object-cover pointer-events-none"
                onError={(e) => {
                  // Fallback กรณีที่หาภาพไม่เจอ
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/400x400/FFE4E1/2D3748?text=Secret+Photo";
                }}
              />
            </div>

            <h3 className="text-xl md:text-2xl font-heading font-bold text-navy mb-2">
              {language === 'th' ? '🎉 เซอร์ไพรส์!' : '🎉 Surprise!'}
            </h3>
            
            {/* ข้อความสุ่ม */}
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

      {/* Animation พิเศษสำหรับเด้งป๊อปอัป */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bounceShort {
          0% { transform: scale(0.8); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-short {
          animation: bounceShort 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}} />
    </>
  );
}