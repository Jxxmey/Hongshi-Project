import { useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import ScrollReveal from '../components/ScrollReveal';

// ลิสต์ข้อความสุ่มขอบคุณแฟนคลับ
const thankYouMessages = [
  "ขอบคุณที่มาร่วมก้าวเดินไปกับฮงชินะครับ 🩵",
  "ขอให้วันนี้เป็นวันที่ใจฟูเหมือนที่ฮงชิทำให้เรายิ้มได้นะ ✨",
  "ดีใจที่ได้เจอกันในโปรเจกต์นี้นะครับ 🍰",
  "One More Step with Hongshi... 🦊",
  "ขอบคุณที่ซัพพอร์ตฮงชินะครับ 🌟",
  "ฮงชิส่งรอยยิ้มมาให้! มีความสุขมากๆ ครับ 🥰"
];

// รูปฮงชิสำหรับแบ็คกราวด์การ์ด (สามารถเพิ่มลิงก์รูปจริงในโฟลเดอร์ public/assets/hongshi/ ได้)
const hongshiImages = [
  "/assets/hongshi/1.jpg", 
  "/assets/hongshi/2.jpg",
  "/assets/hongshi/3.jpg"
];

export default function AdminGenerateQR() {
  const [qrAmount, setQrAmount] = useState(50); // ค่าเริ่มต้น 50 ใบ (1 แผ่น A4 พอดี)
  const [generatedCards, setGeneratedCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // ฟังก์ชันสุ่มการ์ด
  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    // หน่วงเวลานิดนึงให้ UI อัปเดตก่อนลุย Loop
    setTimeout(() => {
      const newCards = [];
      const amount = parseInt(qrAmount, 10) || 0;

      for (let i = 0; i < amount; i++) {
        const randomMsg = thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
        // ใช้รูป Fallback ถ้ารูปในโฟลเดอร์ไม่มี
        const fallbackImg = "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
        const randomImg = hongshiImages[Math.floor(Math.random() * hongshiImages.length)] || fallbackImg;
        
        // สร้างรหัส ID มั่วๆ สำหรับลิงก์ไปหน้าเว็บ
        const uniqueId = `HONG-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 9999)}`;
        const qrUrl = `https:/hongshi-project.lykn.online/ticket?id=${uniqueId}`;

        newCards.push({
          id: uniqueId,
          message: randomMsg,
          image: randomImg,
          qrUrl: qrUrl
        });
      }
      
      setGeneratedCards(newCards);
      setIsGenerating(false);
    }, 100);
  };

  // ฟังก์ชันสั่งปริ้นท์
  const handlePrint = () => {
    window.print();
  };

  // แบ่งการ์ดเป็นหน้าๆ หน้าละ 50 ใบ (5 คอลัมน์ x 10 แถว)
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
            <p className="text-lg text-navy/80 mt-2">กำหนดจำนวนการ์ดที่ต้องการ แล้วระบบจะสุ่มรูป+คำคมให้ จัดลง A4 อัตโนมัติ</p>
          </div>
          
          {/* ฟอร์มระบุจำนวน */}
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
                  className="w-32 bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-3 text-xl font-bold text-center text-navy focus:border-azalea outline-none"
                  required
                />
                <span className="flex items-center font-bold text-navy/50">ใบ</span>
              </div>
              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full bg-navy text-white px-6 py-3.5 rounded-xl font-heading font-bold text-lg hover:bg-azalea transition-colors shadow-sm disabled:opacity-50"
              >
                {isGenerating ? "⏳ กำลังสร้าง..." : "✨ สร้างการ์ด (Generate)"}
              </button>
              <p className="text-xs text-navy/50 mt-4">
                *1 แผ่น A4 จัดได้ 50 ใบ (5x10) / ขนาดการ์ด 4.2 x 2.9 cm
              </p>
            </form>
          </div>

          {/* ปุ่มสั่งปริ้นท์ (จะโชว์เมื่อสร้างการ์ดเสร็จแล้ว) */}
          {generatedCards.length > 0 && (
            <div className="text-center bg-skyblue/10 p-8 rounded-3xl border border-skyblue/30 max-w-2xl mx-auto">
              <span className="text-5xl block mb-4">✅</span>
              <h3 className="text-2xl font-bold text-navy mb-2">สร้างการ์ดเสร็จแล้วจำนวน {generatedCards.length} ใบ!</h3>
              <p className="text-navy/70 mb-6">พร้อมส่งพิมพ์แล้ว กดปุ่มด้านล่างได้เลยครับ</p>
              
              <button 
                onClick={handlePrint}
                className="bg-azalea text-white px-10 py-4 rounded-full font-heading font-bold text-lg hover:bg-[#ff7aa4] hover:-translate-y-1 transition-all shadow-md flex items-center justify-center gap-3 mx-auto"
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
          
          /* หน้า A4 1 หน้า (210mm x 297mm) */
          <div 
            key={`page-${pageIndex}`} 
            className="print-page bg-white relative mx-auto box-border"
            style={{ width: '210mm', height: '297mm', overflow: 'hidden' }}
          >
            
            {/* Grid ใส่การ์ด 50 รูปต่อหน้า (กว้าง 5 แถว x ยาว 10 แถว ชนขอบพอดี) */}
            <div className="flex flex-wrap content-start" style={{ width: '210mm', height: '297mm' }}>
              
              {pageCards.map((card, idx) => (
                /* การ์ดขนาด 42mm x 29.7mm (10 แถว = 297 พอดี) */
                <div 
                  key={`card-${idx}`} 
                  className="relative box-border border-[0.5px] border-gray-200/50" // ขอบจางๆ ไว้ให้รู้รอยตัด
                  style={{ width: '42mm', height: '29.7mm' }}
                >
                  <div className="w-full h-full relative flex items-center justify-between px-1.5 py-1 bg-white overflow-hidden">
                    
                    {/* พื้นหลังรูปลางๆ */}
                    <img 
                      src={card.image} 
                      className="absolute inset-0 w-full h-full object-cover opacity-20 filter grayscale" 
                      alt="" 
                    />
                    
                    {/* ฝั่งซ้าย: ข้อความสั้นๆ */}
                    <div className="relative z-10 w-[60%] flex flex-col justify-center h-full pr-1">
                      <span className="font-heading font-bold text-[6px] text-azalea leading-none mb-[1px] uppercase tracking-wider">
                        Thank You!
                      </span>
                      {/* บีบขนาดข้อความและซ่อนส่วนเกิน */}
                      <p className="font-body font-medium text-[5.5px] leading-[1.2] text-navy line-clamp-3">
                        {card.message}
                      </p>
                    </div>

                    {/* ฝั่งขวา: QR Code */}
                    <div className="relative z-10 w-[40%] flex flex-col items-center justify-center">
                      <div className="bg-white p-[1px] rounded-sm">
                        <QRCodeSVG 
                          value={card.qrUrl} 
                          size={24} // ขนาด QR ประมาณ 24x24 px
                          bgColor={"#ffffff"}
                          fgColor={"#2D3748"}
                          level={"L"} // ระดับ L เพื่อให้สแกนติดง่ายในขนาดเล็ก
                        />
                      </div>
                      <p className="text-[3px] text-navy/50 font-mono mt-[1px]">ID:{card.id.split('-')[1]}</p>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>
        ))}
      </div>


      {/* ==============================================================
          CSS สำหรับสั่งงานเครื่องพิมพ์
      ============================================================== */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          /* ซ่อนหน้าเว็บปกติ */
          body * {
            visibility: hidden;
          }
          
          /* โชว์เฉพาะโซนปริ้นท์ ให้ชิดขอบบนซ้ายสุด */
          #print-area, #print-area * {
            visibility: visible;
          }
          
          #print-area {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
          }

          /* บังคับเบราว์เซอร์ให้จัดหน้า A4 แนวตั้ง ขอบเป็น 0 */
          @page {
            size: A4 portrait;
            margin: 0mm; 
          }

          /* บังคับให้ปริ้นท์สีพื้นหลัง (ภาพและ Gradient) */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* แบ่งหน้ากระดาษ A4 ทุกๆ 50 รูป */
          .print-page {
            page-break-after: always;
            break-after: page;
          }
        }

        @media screen {
          #print-area {
            display: none !important;
          }
        }
      `}} />

    </div>
  );
}