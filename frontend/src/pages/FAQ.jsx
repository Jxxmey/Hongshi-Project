import { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function FAQ() {
  const { t } = useLanguage();
  
  // State เก็บสถานะการเปิด/ปิด Accordion
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    // ถ้ากดข้อเดิมที่เปิดอยู่ให้ปิด ถ้ากดข้ออื่นให้เปิดข้อนั้น
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto space-y-16 selection:bg-azalea selection:text-white pb-20">
      
      {/* 1. Header */}
      <ScrollReveal>
        <div className="text-center space-y-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy">{t.faq.title}</h2>
          <p className="text-lg font-body text-navy/80">{t.faq.subtitle}</p>
        </div>
      </ScrollReveal>

      {/* 2. รายการคำถามแยกตามหมวดหมู่ */}
      <div className="space-y-10">
        {t.faq.categories.map((category, catIndex) => (
          <ScrollReveal key={catIndex} delay={catIndex * 150}>
            <section className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border-t-8 border-skyblue">
              
              <h3 className="text-2xl font-heading font-bold text-navy flex items-center gap-3 mb-6 pb-4 border-b-2 border-palepink/50">
                <span className="text-3xl">{category.emoji}</span> {category.title}
              </h3>

              <div className="space-y-4 font-body">
                {category.items.map((item, itemIndex) => {
                  // สร้าง ID ไม่ซ้ำสำหรับแต่ละข้อ
                  const index = `${catIndex}-${itemIndex}`;
                  const isOpen = openIndex === index;

                  return (
                    <div 
                      key={itemIndex} 
                      className={`border-2 rounded-2xl transition-all duration-300 overflow-hidden ${isOpen ? 'border-azalea shadow-md bg-palepink/10' : 'border-gray-100 hover:border-skyblue/50 bg-white'}`}
                    >
                      <button
                        onClick={() => toggleAccordion(index)}
                        className="w-full text-left px-5 py-4 flex justify-between items-center gap-4 focus:outline-none"
                      >
                        <span className={`font-bold text-lg md:text-xl transition-colors ${isOpen ? 'text-azalea' : 'text-navy'}`}>
                          Q: {item.q}
                        </span>
                        <span className={`text-2xl transition-transform duration-300 text-skyblue ${isOpen ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                      
                      <div 
                        className={`transition-all duration-300 ease-in-out px-5 text-navy/80 leading-relaxed ${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 py-0 opacity-0'}`}
                      >
                        <strong className="text-azalea">A:</strong> {item.a}
                      </div>
                    </div>
                  );
                })}
              </div>

            </section>
          </ScrollReveal>
        ))}
      </div>

    </div>
  );
}