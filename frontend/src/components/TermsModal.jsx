import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext'; // +++ ดึง Hook ภาษามาใช้

export default function TermsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, toggleLanguage, t } = useLanguage(); // เรียกใช้งาน t และฟังก์ชันสลับภาษา

  useEffect(() => {
    // เช็คว่าเคยพบบันทึกการยอมรับข้อตกลงใน localStorage หรือไม่
    const hasAccepted = localStorage.getItem('hasAcceptedTerms');
    
    // ถ้ายังไม่เคยยอมรับ ให้เปิดป๊อปอัป
    if (!hasAccepted) {
      setIsOpen(true);
      // ป้องกันการ Scroll หน้าเว็บหลักตอนที่ Modal เปิดอยู่
      document.body.style.overflow = 'hidden'; 
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('hasAcceptedTerms', 'true');
    setIsOpen(false);
    document.body.style.overflow = 'auto'; // คืนค่าการ Scroll
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white p-6 md:p-10 rounded-[35px] w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto border-t-8 border-skyblue">
        
        {/* ปุ่มสลับภาษา TH/EN แบบมินิมอล (สำหรับคนที่ต้องการอ่านภาษาอังกฤษก่อนกดยอมรับ) */}
        <button 
          onClick={toggleLanguage}
          className="absolute top-6 right-6 px-3 py-1.5 bg-beige text-navy rounded-full text-xs font-bold hover:bg-azalea hover:text-white transition-colors uppercase tracking-wider"
        >
          🌐 {language === 'th' ? 'EN' : 'TH'}
        </button>

        <div className="text-center space-y-3 mb-6 mt-4 md:mt-0">
          <span className="text-5xl md:text-6xl block drop-shadow-sm">👋</span>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-navy">{t.termsModal.title}</h2>
          <p className="font-body text-navy/80 text-sm md:text-base">
            {t.termsModal.subtitle}
          </p>
        </div>

        <div className="bg-beige/30 p-5 md:p-6 rounded-3xl space-y-4 font-body text-sm text-navy/80 mb-8 border-2 border-palepink/50 shadow-inner">
          <p className="font-bold text-navy text-center border-b border-gray-200 pb-3 mb-4">
            {t.termsModal.intro}
          </p>
          
          <div className="space-y-4">
            {t.termsModal.rules.map((rule, index) => (
              <div key={index} className="flex gap-3 items-start">
                <span className="text-xl leading-none">{rule.icon}</span>
                <div>
                  <strong className="text-navy block mb-0.5">{rule.title}</strong>
                  <span className="text-navy/70 text-xs md:text-sm leading-relaxed">{rule.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleAccept}
          className="w-full font-heading font-bold text-base md:text-lg px-8 py-4 rounded-2xl shadow-lg transition-all duration-300 bg-skyblue text-navy hover:bg-azalea hover:text-white hover:-translate-y-1"
        >
          {t.termsModal.acceptBtn}
        </button>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in {
          animation: fadeInModal 0.4s ease-out forwards;
        }
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />
    </div>
  );
}