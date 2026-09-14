import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Countdown from '../components/Countdown';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // State สำหรับตรวจสอบว่าถึงวันเกิดหรือยัง
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    // กำหนดวันเกิดฮงชิเป็น 14 กันยายน 2026 (เปลี่ยนเวลาทดสอบได้ที่นี่)
    const targetDate = new Date('2026-10-16T00:00:00+07:00').getTime();

    const checkBirthday = () => {
      const now = new Date().getTime();
      if (now >= targetDate) {
        setIsBirthday(true);
      }
    };

    checkBirthday(); // เช็คครั้งแรกเมื่อโหลดหน้า
    const timer = setInterval(checkBirthday, 1000); // เช็คซ้ำทุก 1 วินาที

    return () => clearInterval(timer);
  }, []);

  const quickLinks = [
    { path: '/profile', label: t.nav.profile, icon: '🕺' },
    { path: '/project', label: t.nav.project, icon: '📍' },
    { path: '/gallery', label: t.nav.gallery, icon: '📸' },
    { path: '/guestbook', label: t.nav.guestbook, icon: '💌' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 space-y-8 selection:bg-azalea selection:text-white pb-20 relative overflow-hidden">
      
      {/* เอฟเฟกต์พลุเฉลิมฉลอง (จะแสดงก็ต่อเมื่อถึงวันเกิดแล้ว) */}
      {isBirthday && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="firework"></div>
          <div className="firework"></div>
          <div className="firework"></div>
        </div>
      )}

      <header className="text-center flex flex-col items-center w-full relative z-10">
        <ScrollReveal>
          <div className="mb-6 space-y-3">
            <span className="text-sm md:text-base font-bold text-navy/60 uppercase tracking-widest block">
              {t.home.welcome}
            </span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 text-navy drop-shadow-sm">
              {t.home.title}
            </h1>
            <p className="text-sm md:text-base font-body text-navy/80 max-w-2xl mx-auto px-4 pb-2">
              {t.home.subtitle}
            </p>
            <p className="text-lg font-bold text-navy bg-palepink inline-block px-8 py-2 rounded-full shadow-sm border-2 border-white">
              {t.home.date}
            </p>
          </div>
        </ScrollReveal>
        
        {/* แสดง Countdown เฉพาะตอนที่ยัง "ไม่ถึง" วันเกิด */}
        {!isBirthday && (
          <ScrollReveal delay={200}>
            <Countdown />
          </ScrollReveal>
        )}
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-10 relative z-10">
        <ScrollReveal delay={400}>
          <div 
            className="relative w-full rounded-3xl overflow-hidden shadow-lg border-4 border-white transition-transform hover:scale-[1.02] duration-500 bg-gray-100 aspect-video md:aspect-[21/9]"
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
          >
            {!videoLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse z-0 flex items-center justify-center">
                 <span className="text-navy/40 font-bold animate-pulse">Loading Video...</span>
              </div>
            )}

            <div className="absolute inset-0 z-10 w-full h-full bg-transparent"></div>

            <video 
              className={`w-full h-full object-cover pointer-events-none select-none transition-opacity duration-1000 relative z-0 ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              autoPlay 
              loop 
              muted 
              playsInline
              disablePictureInPicture
              controlsList="nodownload nofullscreen noremoteplayback"
              onCanPlay={() => setVideoLoaded(true)} 
            >
              <source src="/assets/banner.mp4" type="video/mp4" />
            </video>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={600}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-2">
            {quickLinks.map((link, index) => (
              <Link 
                key={index} 
                to={link.path}
                className="flex flex-col items-center justify-center p-6 bg-white/70 hover:bg-white border-2 border-white rounded-[30px] shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-2 group backdrop-blur-sm"
              >
                <span className="text-3xl md:text-4xl mb-3 group-hover:scale-125 transition-transform duration-300 drop-shadow-sm">
                  {link.icon}
                </span>
                <span className="font-heading font-bold text-navy text-sm md:text-base group-hover:text-azalea transition-colors text-center">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>
        </ScrollReveal>
      </main>

      {/* CSS สำหรับเอฟเฟกต์พลุ (จะถูกใส่เข้ามาเมื่อถึงวันเกิดเท่านั้น) */}
      {isBirthday && (
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes firework {
            0% { transform: translate(var(--x), var(--initialY)); width: var(--initialSize); opacity: 1; }
            50% { width: 0.5vmin; opacity: 1; }
            100% { width: var(--finalSize); opacity: 0; }
          }

          .firework,
          .firework::before,
          .firework::after {
            --initialSize: 0.5vmin;
            --finalSize: 60vmin;
            --particleSize: 0.6vmin;
            /* สีพลุคอนทราสต์กับพื้นสีพาสเทล */
            --color1: #ffb703; /* สีเหลืองทอง */
            --color2: #173d67; /* สีกรมท่า (Navy) */
            --color3: #fb8500; /* สีส้มเข้ม */
            --color4: #8338ec; /* สีม่วงสว่าง */
            --color5: #ffffff; /* สีขาว */
            --color6: #ff006e; /* สีชมพูอมแดงสด */
            --y: -30vmin;
            --x: -50%;
            --initialY: 60vmin;
            content: "";
            animation: firework 2.5s infinite cubic-bezier(0.25, 1, 0.5, 1);
            position: absolute;
            top: 40%;
            left: 50%;
            transform: translate(-50%, var(--y));
            width: var(--initialSize);
            aspect-ratio: 1;
            background: 
              radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 50% 0%,
              radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 50%,
              radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 50% 100%,
              radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 0% 50%,
              radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 80% 90%,
              radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 95% 90%,
              radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 90% 70%,
              radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 60%,
              radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 20% 90%,
              radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 5% 90%,
              radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 10% 70%,
              radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 0% 60%,
              radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 20% 10%,
              radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 5% 10%,
              radial-gradient(circle, var(--color3) var(--particleSize), #0000 0) 10% 30%,
              radial-gradient(circle, var(--color4) var(--particleSize), #0000 0) 0% 40%,
              radial-gradient(circle, var(--color5) var(--particleSize), #0000 0) 80% 10%,
              radial-gradient(circle, var(--color6) var(--particleSize), #0000 0) 95% 10%,
              radial-gradient(circle, var(--color1) var(--particleSize), #0000 0) 90% 30%,
              radial-gradient(circle, var(--color2) var(--particleSize), #0000 0) 100% 40%;
            background-size: var(--initialSize) var(--initialSize);
            background-repeat: no-repeat;
          }

          .firework::before {
            --x: -120%;
            --y: -10%;
            --initialY: -50%;
            transform: translate(-50%, -50%) rotate(40deg) scale(1.3) rotateY(40deg);
            animation-delay: 0.2s;
          }

          .firework::after {
            --x: -50%;
            --y: -50%;
            --initialY: -50%;
            transform: translate(-50%, -50%) rotate(170deg) scale(1.15) rotateY(-30deg);
            animation-delay: 0.4s;
          }

          .firework:nth-child(2) {
            --x: 30vmin;
            --y: -40vmin;
            animation-delay: 0.5s;
          }
          .firework:nth-child(3) {
            --x: -30vmin;
            --y: -50vmin;
            animation-delay: 1.2s;
          }
        `}} />
      )}
    </div>
  );
}