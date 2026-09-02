import { Link } from 'react-router-dom'; // +++ นำเข้า Link สำหรับทำปุ่มนำทาง
import Countdown from '../components/Countdown';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  // +++ สร้างข้อมูลปุ่มนำทางลัด +++
  const quickLinks = [
    { path: '/profile', label: t.nav.profile, icon: '🕺' },
    { path: '/project', label: t.nav.project, icon: '📍' },
    { path: '/gallery', label: t.nav.gallery, icon: '📸' },
    { path: '/guestbook', label: t.nav.guestbook, icon: '💌' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 space-y-8 selection:bg-azalea selection:text-white pb-20">
      
      <header className="text-center flex flex-col items-center w-full">
        {/* ส่วนที่ 1: หัวข้อและวันที่ (ลอยขึ้นมาทันที) */}
        <ScrollReveal>
          <div className="mb-6 space-y-3">
            {/* ข้อความต้อนรับเล็กๆ ด้านบน */}
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
        
        {/* ส่วนที่ 2: นาฬิกานับถอยหลัง (ลอยตามมาทีหลัง หน่วงเวลา 200ms) */}
        <ScrollReveal delay={200}>
          <Countdown />
        </ScrollReveal>
      </header>

      <main className="w-full max-w-4xl flex flex-col gap-10">
        
        {/* ส่วนที่ 3: วิดีโอแบนเนอร์ (ลอยขึ้นมา หน่วงเวลา 400ms) */}
        <ScrollReveal delay={400}>
          <div 
            className="relative rounded-3xl overflow-hidden shadow-lg border-4 border-white transition-transform hover:scale-[1.02] duration-500 bg-beige"
            onContextMenu={(e) => e.preventDefault()} // 🔒 ป้องกันคลิกขวา
            onDragStart={(e) => e.preventDefault()} // 🔒 ป้องกันการคลิกลาก
          >
            
            {/* 🔒 แผ่นใสบังวิดีโอ (Overlay) ป้องกันคนกดโดนวิดีโอโดยตรง */}
            <div className="absolute inset-0 z-10 w-full h-full bg-transparent"></div>

            {/* แท็ก Video พร้อม Attributes ป้องกันการดาวน์โหลด */}
            <video 
              className="w-full h-auto object-cover pointer-events-none select-none" 
              autoPlay 
              loop 
              muted 
              playsInline
              disablePictureInPicture // 🔒 ป้องกันโหมดจอเล็กซ้อนจอ
              controlsList="nodownload nofullscreen noremoteplayback" // 🔒 ซ่อนปุ่มดาวน์โหลดเสริมของเบราว์เซอร์
            >
              {/* อ้างอิงโฟลเดอร์ public/assets/banner.mp4 */}
              <source src="/assets/banner.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

          </div>
        </ScrollReveal>

        {/* +++ ส่วนที่ 4: ปุ่มเมนูลัด Quick Links (ลอยขึ้นมาอันสุดท้าย หน่วงเวลา 600ms) +++ */}
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
      
    </div>
  );
}