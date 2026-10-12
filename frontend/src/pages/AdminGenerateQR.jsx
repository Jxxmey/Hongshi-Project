import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import ScrollReveal from '../components/ScrollReveal';

// ลิสต์ข้อความขอบคุณ
const thankYouMessages = [
  "ขอบคุณที่มาร่วมก้าวเดินไปกับฮงชินะครับ 🩵",
  "ขอให้วันนี้เป็นวันที่ใจฟูเหมือนที่ฮงชิทำให้เรายิ้มได้นะ ✨",
  "ดีใจที่ได้เจอกันในโปรเจกต์นี้นะครับ 🍰",
  "One More Step with Hongshi... 🦊",
  "ขอบคุณที่ซัพพอร์ตฮงชินะครับ 🌟",
  "ฮงชิส่งรอยยิ้มมาให้! มีความสุขมากๆ ครับ 🥰",
  "ทุกรอยยิ้มของฮงชิ เกิดจากความรักของทุกคนนะ 🌷",
  "ยินดีต้อนรับสู่โลกของฮงชินะครับ! 🎨"
];

// ธีมสี (ไล่สี Gradient)
const cardThemes = [
  "from-skyblue to-palepink", 
  "from-palepink to-azalea", 
  "from-skyblue to-beige", 
  "from-skyblue to-azalea",
  "from-blue-200 to-indigo-200",
  "from-rose-100 to-teal-100"
];

export default function AdminGenerateQR() {
  const [qrAmount, setQrAmount] = useState(50); 
  const [generatedCards, setGeneratedCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // +++ ฟังก์ชันช่วยแปลงข้อความ (ID) ให้เป็นตัวเลข (Hash) +++
  // ไว้ใช้ล็อคภาพ ล็อคข้อความ ล็อคสี ให้ได้ค่าเดิมเสมอสำหรับ ID นั้นๆ
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // แปลงเป็น 32bit integer
    }
    return Math.abs(hash);
  };

  // ฟังก์ชันสร้างการ์ด
  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    setTimeout(() => {
      const newCards = [];
      const amount = parseInt(qrAmount, 10) || 0;

      for (let i = 0; i < amount; i++) {
        // สร้าง ID มั่วๆ สำหรับลิงก์ไปหน้าเว็บ (หรือถ้าคุณมี ID มาจากฐานข้อมูลก็ใช้ ID นั้นได้เลย)
        const uniqueId = `HONG-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 9999)}`;
        
        // +++ ใช้ ID ในการล็อกรูปภาพ ข้อความ และ สี (1 ID = 1 สไตล์เสมอ) +++
        const hashNum = hashCode(uniqueId);
        
        // ล็อกข้อความ
        const lockedMsg = thankYouMessages[hashNum % thankYouMessages.length];
        
        // ล็อกธีมสี
        const lockedTheme = cardThemes[hashNum % cardThemes.length];
        
        // ล็อกรูปภาพ โดยใช้ระบบ Seed ของ Picsum Photos (ส่ง seed= uniqueId เข้าไป จะได้ภาพเดิมเสมอ)
        const lockedBgImage = `https://picsum.photos/seed/${uniqueId}/400/400?blur=2`; // ใส่ blur นิดๆ ให้เป็นแบคกราวน์ละมุนๆ

        const qrUrl = `https://hongshi-project.onrender.com/souvenir?id=${uniqueId}`;

        newCards.push({
          id: uniqueId,
          message: lockedMsg,
          bgImage: lockedBgImage,
          qrUrl: qrUrl,
          theme: lockedTheme
        });
      }
      
      setGeneratedCards(newCards);
      setIsGenerating(false);
    }, 100);
  };

  const handlePrint = () => {
    window.print();
  };

  const pages = [];
  for (let i = 0; i < generatedCards.length; i += 50) {
    pages.push(generatedCards.slice(i, i + 50));
  }

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto min-h-[80vh] font-body bg-[#fafafa]">
      
      {/* ==============================================================
          ส่วนของ หน้าต่างตั้งค่า (ไม่แสดงตอนปริ้นท์)
      ============================================================== */}
      <div id="normal-ui">
        <ScrollReveal>
          <Link to="/admin" className="inline-flex items-center gap-2 text-navy hover:text-azalea font-bold mb-4 transition-colors">
            <span className="text-xl">←</span> กลับไปหน้า Dashboard
          </Link>
          
          <div className="text-center mb-10">
            <h2 className="text-4xl font-heading font-bold text-navy">🖨️ สร้างการ์ด QR ของที่ระลึก</h2>
            <p className="text-lg text-navy/80 mt-2">การ์ดสแกนรับของที่ระลึกดิจิทัล (ล็อกรูปภาพและข้อความให้ผูกติดกับ ID เสมอ)</p>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 max-w-md mx-auto mb-10 text-center">
            <form onSubmit={handleGenerate}>
              <label className="block text-navy font-bold mb-3 text-lg">
                จำนวนการ์ดที่ต้องการสร้าง:
              </label>
              <div className="flex gap-3 justify-center mb-6">
                <input 
                  type="number" 
                  min="1" 
                  max="1000"
                  value={qrAmount}
                  onChange={(e) => setQrAmount(e.target.value)}
                  className="w-32 bg-gray-50 border-2 border-skyblue/30 rounded-xl px-4 py-3 text-xl font-bold text-center text-navy focus:border-azalea outline-none transition-colors"
                  required
                />
                <span className="flex items-center font-bold text-navy/50">ใบ</span>
              </div>
              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-skyblue to-palepink text-navy px-6 py-3.5 rounded-xl font-heading font-bold text-lg hover:from-azalea hover:to-palepink hover:text-white transition-all shadow-md disabled:opacity-50"
              >
                {isGenerating ? "⏳ กำลังเนรมิตการ์ด..." : "✨ สร้างการ์ด (Generate)"}
              </button>
              <p className="text-xs text-navy/50 mt-4">
                *ระบบจะโหลดภาพจากออนไลน์ (ใช้เวลาสักครู่ตอนพิมพ์)
              </p>
            </form>
          </div>

          {generatedCards.length > 0 && (
            <div className="text-center bg-white p-8 rounded-3xl border border-gray-100 shadow-[0_15px_40px_rgba(0,0,0,0.06)] max-w-2xl mx-auto">
              <span className="text-5xl block mb-4 animate-bounce">💌</span>
              <h3 className="text-2xl font-bold text-navy mb-2">สร้างการ์ดเสร็จแล้วจำนวน {generatedCards.length} ใบ!</h3>
              <p className="text-navy/70 mb-6">ระบบล็อกภาพและข้อความให้แต่ละ ID แล้ว กดปุ่มด้านล่างเพื่อสั่งพิมพ์ได้เลยครับ</p>
              
              <button 
                onClick={handlePrint}
                className="bg-navy text-white px-10 py-4 rounded-full font-heading font-bold text-lg hover:bg-azalea hover:-translate-y-1 transition-all shadow-xl flex items-center justify-center gap-3 mx-auto"
              >
                <span className="text-2xl">🖨️</span> 
                สั่งพิมพ์ / บันทึกเป็น PDF
              </button>
            </div>
          )}

        </ScrollReveal>
      </div>

      {/* ==============================================================
          ส่วนของ โซนปริ้นท์ (จะถูกซ่อนในโหมดปกติ และแสดงเฉพาะตอนกดพิมพ์)
      ============================================================== */}
      <div id="print-area" className="hidden font-body text-navy">
        {pages.map((pageCards, pageIndex) => (
          
          <div 
            key={`page-${pageIndex}`} 
            className="print-page bg-white relative mx-auto box-border"
            style={{ width: '210mm', height: '297mm', overflow: 'hidden' }}
          >
            
            <div className="flex flex-wrap content-start" style={{ width: '210mm', height: '297mm' }}>
              
              {pageCards.map((card, idx) => (
                <div 
                  key={`card-${idx}`} 
                  // ขอบนอกของการ์ดแต่ละใบ (เส้นตัด)
                  className="relative box-border border-r-[0.5px] border-b-[0.5px] border-gray-200/50 p-[1.5mm]" 
                  style={{ width: '42mm', height: '29.7mm' }}
                >
                  {/* กรอบการ์ดไล่สี หวานๆ */}
                  <div className={`w-full h-full rounded-[4px] bg-gradient-to-br ${card.theme} p-[1px] box-border shadow-sm`}>
                    
                    {/* พื้นหลังด้านใน (ที่รวมรูปลงไป) */}
                    <div className="bg-white/90 w-full h-full rounded-[3px] relative flex items-center justify-between p-1 overflow-hidden">
                      
                      {/* รูปภาพพื้นหลัง (ล็อคตาม ID) */}
                      <img 
                        src={card.bgImage} 
                        className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-multiply" 
                        alt="" 
                        crossOrigin="anonymous" 
                      />
                      
                      {/* ของตกแต่ง (ดาววิ้งๆ ทับบนรูป) */}
                      <span className="absolute top-1 left-1 text-[4px] text-skyblue opacity-90 z-0">✦</span>
                      <span className="absolute bottom-1 right-1 text-[4px] text-palepink opacity-90 z-0">✧</span>
                      <span className="absolute top-1 right-2 text-[5px] text-[#8b5a2b] opacity-60 z-0">★</span>
                      
                      {/* ฝั่งซ้าย: ข้อความ */}
                      <div className="w-[58%] h-full flex flex-col justify-center z-10 pr-[2px]">
                        
                        <div className="flex flex-col justify-center flex-grow bg-white/70 backdrop-blur-[2px] rounded-sm px-1 py-0.5 border-[0.5px] border-white/50 shadow-sm">
                          <span className={`font-heading font-bold text-[4.5px] bg-clip-text text-transparent bg-gradient-to-r ${card.theme} uppercase tracking-wider mb-[0.5px]`}>
                            Thank You
                          </span>
                          <p className="font-body font-bold text-[3.5px] leading-tight text-navy/90 line-clamp-3">
                            {card.message}
                          </p>
                        </div>
                      </div>

                      {/* ฝั่งขวา: QR Code */}
                      <div className="w-[42%] flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] h-full rounded-sm border border-gray-100/80 p-[1px] z-10 shadow-sm">
                        <div className="bg-white p-[1px] rounded-[1px] shadow-sm">
                          <QRCodeSVG 
                            value={card.qrUrl} 
                            size={20} 
                            bgColor={"#ffffff"}
                            fgColor={"#1e293b"} 
                            level={"L"} 
                          />
                        </div>
                        <p className="text-[2.5px] text-navy/60 font-mono mt-[1px] uppercase tracking-tighter font-bold">
                          Scan Me!
                        </p>
                        <p className="text-[2.5px] text-navy/40 font-mono leading-none">
                          {card.id.split('-')[1]}
                        </p>
                      </div>

                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #print-area, #print-area * { visibility: visible; }
          #print-area {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }
          @page {
            size: A4 portrait;
            margin: 0mm; 
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print-page {
            page-break-after: always;
            break-after: page;
          }
        }
        @media screen {
          #print-area { display: none !important; }
        }
      `}} />
    </div>
  );
}