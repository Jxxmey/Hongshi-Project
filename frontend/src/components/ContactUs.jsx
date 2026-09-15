import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function ContactUs() {
  const { language } = useLanguage();

  const content = {
    th: {
      title: "ติดต่อสอบถาม (Contact Us)",
      desc: "หากมีข้อสงสัยหรือต้องการสอบถามข้อมูลเพิ่มเติมเกี่ยวกับโปรเจกต์ สามารถติดต่อพวกเราได้ตามช่องทางด้านล่างนี้เลยครับ 🩵",
      twitter: "Twitter / X",
      email: "อีเมลติดต่อ"
    },
    en: {
      title: "Contact Us",
      desc: "If you have any questions or need more information about the project, feel free to contact us through the channels below! 🩵",
      twitter: "Twitter / X",
      email: "Email Us"
    }
  };

  const text = content[language] || content.th;

  return (
    <div className="bg-white p-8 md:p-10 rounded-[35px] shadow-sm border-2 border-skyblue/30 max-w-3xl mx-auto text-center font-body relative overflow-hidden">
      
      {/* กราฟิกตกแต่ง */}
      <div className="absolute -top-6 -left-6 text-6xl opacity-20 rotate-[-15deg] pointer-events-none">✉️</div>
      <div className="absolute -bottom-6 -right-6 text-6xl opacity-20 rotate-[15deg] pointer-events-none">💬</div>

      <h2 className="text-3xl font-heading font-bold text-navy mb-4 relative z-10">
        {text.title}
      </h2>
      <p className="text-navy/80 mb-8 max-w-lg mx-auto relative z-10">
        {text.desc}
      </p>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 relative z-10">

        {/* ปุ่ม Email */}
        <a 
          href="mailto:ONEMORESTEP.Hongshi@icloud.com" // 🔴 เปลี่ยนเป็นอีเมลของคุณ
          className="flex items-center justify-center gap-3 px-6 py-4 bg-palepink/30 border border-palepink text-azalea rounded-2xl hover:bg-azalea hover:text-white hover:border-azalea transition-all duration-300 font-bold w-full sm:w-auto shadow-sm hover:-translate-y-1"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {text.email}
        </a>

      </div>
    </div>
  );
}   