import { useState } from 'react'; 
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

export default function ProjectDetail() {
  const { t, language } = useLanguage();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // State สำหรับรูปที่ถูกคลิก

  // รายการเมนู
  const menus = [
    { name: 'Cake', img: 'cake.png' },
    { name: 'You Shine I Choose', img: 'you shine I choose.png' },
    { name: 'First Sight', img: 'first sight.png' },
    { name: 'Feel Like Milk', img: 'feel like milk.png' }
  ];

  // ของที่ระลึก เซ็ต 1
  const giveawayPart1 = [
    { name: 'Cup Sleeve', img: 'cup sleeve.png' },
    { name: 'Photocard', img: 'photocard.png' },
    { name: 'Bookmark', img: 'bookmark.png' }
  ];

  // ของที่ระลึก เซ็ต 2
  const giveawayPart2 = [
    { name: 'Photocard', img: 'photocard.png' },
    { name: 'Bookmark', img: 'bookmark.png' },
    { name: 'Card Holder', img: 'card holder.png' },
    { name: 'Mirror', img: 'mirror.png' },
    { name: 'Cup Sleeve', img: 'cup sleeve.png' },
    { name: 'Plastic Bag', img: 'plastic bag.png' },
    { name: 'Standee Paper', img: 'standee paper.png' }
  ];

  // ฟังก์ชันสำหรับเปิด Modal
  const openModal = (imgSrc, imgName) => {
    setSelectedImage({ src: `/assets/cafe/${imgSrc}`, name: imgName });
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="py-12 px-4 max-w-5xl mx-auto space-y-12 selection:bg-azalea selection:text-white pb-20">
      
      {/* ส่วนหัวของหน้า */}
      <ScrollReveal>
        <div className="text-center mb-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy mb-4 drop-shadow-sm">{t.project.title}</h2>
          <p className="text-lg font-body text-navy opacity-80 bg-white/60 inline-block px-6 py-2 rounded-full shadow-sm">{t.project.subtitle}</p>
        </div>
      </ScrollReveal>

      {/* บล็อกที่ 0: รายละเอียดกิจกรรม */}
      <ScrollReveal delay={200}>
        <section className="flex flex-col items-center">
          <h3 className="text-2xl font-heading font-bold text-navy border-b-4 border-skyblue pb-2 mb-6 inline-block">
            {t.project.eventTitle}
          </h3>
          <div className="w-full max-w-2xl font-body">
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-skyblue text-center md:text-left flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h4 className="text-2xl font-bold text-navy mb-2">{t.project.cafeEvent}</h4>
                <p className="text-navy/80 mb-1">{t.project.eventDate}</p>
                <p className="text-navy font-bold">{t.project.locationLabel} {t.project.cafeName}</p>
              </div>
              <div className="flex justify-center drop-shadow-sm">
                <img 
                  src="/assets/solrise.png" 
                  alt="Solrise Logo" 
                  className="w-48 h-48 md:w-56 md:h-56 object-contain hover:scale-105 transition-transform duration-300" 
                  onError={(e) => e.target.style.display = 'none'}
                />
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* บล็อกที่ 1: แผนที่คาเฟ่ (ย้ายมาไว้ก่อน Giveaway) */}
      <ScrollReveal delay={200}>
        <section className="flex flex-col items-center">
          <h3 className="text-2xl font-heading font-bold text-navy border-b-4 border-skyblue pb-2 mb-6 inline-block">
            {t.project.mapTitle}
          </h3>
          
          <div className="w-full h-64 md:h-96 bg-gray-100 rounded-2xl overflow-hidden shadow-sm relative border-4 border-white hover:border-skyblue transition-colors duration-300">
            
            {!mapLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-0">
                <span className="text-navy/50 font-bold animate-pulse">กำลังโหลดแผนที่... 📍</span>
              </div>
            )}

            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3874.9371336632967!2d100.48847857597865!3d13.782663286612443!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29b001ff7f557%3A0x79d8bb5675f6d5e9!2sSolrise%20cafe!5e0!3m2!1sth!2sth!4v1789409089486!5m2!1sth!2sth" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade" 
              title="Solrise Cafe Location"
              onLoad={() => setMapLoaded(true)}
              className={`absolute inset-0 z-10 transition-opacity duration-1000 ${
                mapLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            ></iframe>
            
          </div>
          
          <div className="mt-8 text-center w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="https://maps.app.goo.gl/vN6xmL9Qi9JJ7RqAA" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-white text-navy font-heading font-bold px-8 py-3.5 rounded-full shadow-sm border-2 border-skyblue hover:bg-azalea hover:text-white transition-all hover:-translate-y-1 duration-300 text-base md:text-lg w-full sm:w-auto">
              {t.project.mapBtn}
            </a>

            <Link to="/faq" className="inline-flex items-center justify-center gap-2 bg-white text-navy font-heading font-bold px-8 py-3.5 rounded-full shadow-sm border-2 border-skyblue hover:bg-azalea hover:text-white transition-all hover:-translate-y-1 duration-300 text-base md:text-lg w-full sm:w-auto">
              อ่านกฎและข้อควรระวัง (FAQ)
            </Link>
          </div>
        </section>
      </ScrollReveal>

      {/* บล็อกที่ 2: Menu */}
      <ScrollReveal delay={200}>
        <section className="w-full bg-white p-8 md:p-10 rounded-3xl shadow-sm border-t-8 border-palepink text-center flex flex-col items-center">
          <h3 className="text-3xl font-heading font-bold text-navy mb-2">
            🍰 Special Menu
          </h3>
          <p className="text-navy/70 font-body font-bold mb-10 bg-palepink/20 px-6 py-1.5 rounded-full inline-block border border-palepink/50">
            {language === 'th' ? 'เมนูพิเศษเฉพาะช่วงจัดกิจกรรม' : 'Special menu for the event'}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 w-full justify-items-center">
            {menus.map((item, i) => (
              <div 
                key={i} 
                className="flex flex-col items-center group cursor-pointer w-full"
                onClick={() => openModal(item.img, item.name)}
              >
                <img 
                  src={`/assets/cafe/${item.img}`} 
                  alt={item.name} 
                  className="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-xl group-hover:-translate-y-4 group-hover:scale-110 transition-all duration-500" 
                />
                <span className="mt-4 bg-gray-50 px-4 py-2 rounded-full text-navy font-bold text-sm border border-gray-100 shadow-sm text-center w-full group-hover:bg-palepink group-hover:border-palepink transition-colors">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* บล็อกที่ 3: Giveaway */}
      <ScrollReveal delay={400}>
        <section className="w-full bg-white p-8 md:p-10 rounded-3xl shadow-sm border-t-8 border-azalea text-center flex flex-col items-center">
          <h3 className="text-3xl font-heading font-bold text-navy mb-4">
            🎁 {t.project.giveawayTitle || 'Giveaway Set'}
          </h3>
          
          {/* ข้อความแจ้งเตือนขอสงวนสิทธิ์ */}
          <div className="mb-10 bg-red-50 text-red-500 px-6 py-2 rounded-full font-body font-bold text-sm md:text-base border border-red-200 inline-block shadow-sm">
            {language === 'th' ? '⚠️ ขอสงวนสิทธิ์ 1 คนต่อ 1 เซ็ตเท่านั้น' : '⚠️ Limited to 1 set per person'}
          </div>
          
          {/* ส่วนที่ 1 */}
          <div className="mb-14 bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100 w-full flex flex-col items-center relative">
            <h4 className="text-lg md:text-xl font-heading font-bold text-azalea mb-8 bg-azalea/10 px-8 py-2.5 rounded-full border-2 border-azalea inline-block">
              Set 1 Special Drink 119 บาท
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 w-full justify-items-center">
              {giveawayPart1.map((item, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center group cursor-pointer"
                  onClick={() => openModal(item.img, item.name)}
                >
                  <img 
                    src={`/assets/cafe/${item.img}`} 
                    alt={item.name} 
                    className="w-40 h-40 md:w-48 md:h-48 object-contain drop-shadow-xl group-hover:-translate-y-4 group-hover:scale-110 transition-all duration-500" 
                  />
                  <span className="mt-4 bg-white px-4 py-2 rounded-full text-navy font-bold text-sm border border-gray-100 shadow-sm text-center uppercase tracking-wide group-hover:text-azalea transition-colors">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ส่วนที่ 2 (รวม Lucky Draw ไว้ข้างใน) */}
          <div className="bg-gray-50/50 p-6 md:p-8 rounded-3xl border border-gray-100 w-full flex flex-col items-center">
            <h4 className="text-lg md:text-xl font-heading font-bold text-azalea mb-8 bg-azalea/10 px-8 py-2.5 rounded-full border-2 border-azalea inline-block">
              Set 2 Special Set 239 บาท
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 md:gap-12 w-full justify-items-center mb-10">
              {giveawayPart2.map((item, i) => (
                <div 
                  key={i} 
                  className="flex flex-col items-center group cursor-pointer w-full"
                  onClick={() => openModal(item.img, item.name)}
                >
                  <img 
                    src={`/assets/cafe/${item.img}`} 
                    alt={item.name} 
                    className="w-36 h-36 md:w-44 md:h-44 object-contain drop-shadow-xl group-hover:-translate-y-4 group-hover:scale-110 transition-all duration-500" 
                  />
                  <span className="mt-4 bg-white px-3 py-2 rounded-full text-navy font-bold text-sm border border-gray-100 shadow-sm text-center uppercase tracking-wide w-full group-hover:text-azalea transition-colors">
                    {item.name}
                  </span>
                </div>
              ))}
              
              {/* ตั๋ว Lucky Draw ที่ปรับขนาดให้เล็กลงแล้ว */}
              <div className="flex flex-col items-center group cursor-pointer w-full justify-center mt-2 md:mt-0">
                <div className="relative w-40 h-24 md:w-48 md:h-28 bg-gradient-to-br from-yellow-300 via-yellow-400 to-yellow-600 rounded-xl shadow-[0_15px_30px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center p-2 border-[2px] border-yellow-200 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 group-hover:-translate-y-2">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full shadow-inner border-[2px] border-yellow-200"></div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-gray-50 rounded-full shadow-inner border-[2px] border-yellow-200"></div>
                  <div className="absolute left-8 md:left-10 top-2 bottom-2 w-px border-l-[3px] border-dashed border-white/50"></div>
                  
                  <div className="pl-6 w-full text-center relative z-10 flex flex-col items-center">
                    <h4 className="text-sm md:text-base font-heading font-black text-navy uppercase tracking-[0.2em] drop-shadow-sm opacity-90 leading-tight">
                      Special
                    </h4>
                    <h3 className="text-xl md:text-2xl font-heading font-black text-white uppercase tracking-widest drop-shadow-lg leading-none group-hover:text-navy transition-colors duration-500">
                      TICKET
                    </h3>
                  </div>
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent pointer-events-none"></div>
                </div>
                <span className="mt-4 bg-yellow-400 px-3 py-2 rounded-full text-navy font-bold text-sm border border-yellow-500 shadow-sm text-center uppercase tracking-wide w-full group-hover:bg-yellow-500 transition-colors">
                  Lucky Draw Ticket
                </span>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ----------------- Modal สำหรับดูรูปภาพแบบ Zoom ----------------- */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/90 backdrop-blur-md animate-fade-in"
          onClick={closeModal}
        >
          <div className="relative max-w-2xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={closeModal} 
              className="absolute -top-12 right-0 text-white hover:text-azalea bg-white/20 hover:bg-white/40 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all z-20"
            >
              ✕
            </button>
            <div className="w-full flex justify-center items-center">
              <img 
                src={selectedImage.src} 
                alt={selectedImage.name} 
                className="max-h-[75vh] md:max-h-[85vh] w-auto object-contain drop-shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
              />
            </div>
            <p className="text-white mt-6 font-heading font-bold text-lg md:text-2xl tracking-wide uppercase drop-shadow-md">
              {selectedImage.name}
            </p>
          </div>
        </div>
      )}

      {/* เพิ่มแอนิเมชันสำหรับ Modal */}
      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}} />

    </div>
  );
}