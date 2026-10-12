import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import ScrollReveal from '../components/ScrollReveal';
import { toPng } from 'html-to-image';

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

export default function AdminGenerateQR() {
  const [qrAmount, setQrAmount] = useState(50); 
  const [generatedCards, setGeneratedCards] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // อ้างอิงโซนที่จะแคปภาพเซฟ
  const printAreaRef = useRef(null);

  // ฟังก์ชันช่วยแปลงข้อความ (ID) ให้เป็นตัวเลข (Hash)
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
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
        const uniqueId = `HONG-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 9999)}`;
        const hashNum = hashCode(uniqueId);
        
        const lockedMsg = thankYouMessages[hashNum % thankYouMessages.length];
        const lockedImage = `/assets/flower-bouquet.png`; 

        const qrUrl = `https://hongshi-project.lykn.online/souvenir?id=${uniqueId}`;

        newCards.push({
          id: uniqueId,
          message: lockedMsg,
          centerImage: lockedImage, 
          qrUrl: qrUrl
        });
      }
      
      setGeneratedCards(newCards);
      setIsGenerating(false);
    }, 100);
  };

  // สั่งปริ้นท์ผ่านเบราว์เซอร์
  const handlePrint = () => {
    window.print();
  };

  // CSS จำลองสำหรับแก้ปัญหาฟอนต์เพี้ยนตอนเซฟรูป
  const localFontsCSS = `
    @font-face {
      font-family: 'K2D';
      font-style: normal;
      font-weight: 700;
      src: url('/assets/fonts/K2D/K2D-Bold.ttf') format('truetype');
    }
    @font-face {
      font-family: 'IBM Plex Sans Thai';
      font-style: normal;
      font-weight: 400;
      src: url('/assets/fonts/IBM_Plex_Sans_Thai/IBMPlexSansThai-Regular.ttf') format('truetype');
    }
    @font-face {
      font-family: 'IBM Plex Sans Thai';
      font-style: normal;
      font-weight: 700;
      src: url('/assets/fonts/IBM_Plex_Sans_Thai/IBMPlexSansThai-Bold.ttf') format('truetype');
    }
  `;

  // ฟังก์ชันดาวน์โหลดภาพการ์ด
  const handleDownloadAllPages = async () => {
    if (!printAreaRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      const pagesToDownload = printAreaRef.current.querySelectorAll('.print-page');

      for (let i = 0; i < pagesToDownload.length; i++) {
        const dataUrl = await toPng(pagesToDownload[i], {
          pixelRatio: 3, 
          cacheBust: true,
          backgroundColor: '#ffffff', 
          fontEmbedCSS: localFontsCSS 
        });

        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `Hongshi_QR_Cards_Page_${i + 1}.png`; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("Download error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกภาพ");
    } finally {
      setIsDownloading(false);
    }
  };

  const pages = [];
  for (let i = 0; i < generatedCards.length; i += 50) {
    pages.push(generatedCards.slice(i, i + 50));
  }

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto min-h-[80vh] font-body selection:text-white">
      
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
            <p className="text-lg text-navy/80 mt-2">ดีไซน์ช่อดอกไม้ + Liquid Glass วางทับด้านบนพื้นหลังพาสเทล</p>
          </div>
          
          <div className="bg-white/70 backdrop-blur-md p-8 rounded-[35px] shadow-sm border-4 border-white max-w-md mx-auto mb-10 text-center">
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
                  className="w-32 bg-white border-2 border-white rounded-xl px-4 py-3 text-xl font-bold text-center text-navy focus:border-azalea outline-none transition-colors shadow-sm"
                  required
                />
                <span className="flex items-center font-bold text-navy/50">ใบ</span>
              </div>
              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full bg-palepink text-navy px-6 py-3.5 rounded-full font-heading font-bold text-lg hover:bg-azalea hover:text-white transition-all shadow-sm border-2 border-white disabled:opacity-50"
              >
                {isGenerating ? "⏳ กำลังเนรมิตการ์ด..." : "✨ สร้างการ์ด (Generate)"}
              </button>
            </form>
          </div>

          {generatedCards.length > 0 && (
            <div className="text-center bg-white/70 backdrop-blur-md p-8 rounded-[35px] border-4 border-white shadow-sm max-w-2xl mx-auto">
              <span className="text-5xl block mb-4 animate-bounce">💌</span>
              <h3 className="text-2xl font-bold text-navy mb-2">สร้างการ์ดเสร็จแล้วจำนวน {generatedCards.length} ใบ!</h3>
              <p className="text-navy/70 mb-6">ระบบล็อกภาพและข้อความให้แต่ละ ID แล้ว กดปุ่มด้านล่างเพื่อสั่งพิมพ์หรือบันทึกได้เลยครับ</p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                  onClick={handlePrint}
                  className="bg-navy text-white px-8 py-4 rounded-full font-heading font-bold text-lg hover:bg-azalea hover:-translate-y-1 transition-all shadow-sm flex items-center justify-center gap-3 w-full sm:w-auto"
                >
                  <span className="text-2xl">🖨️</span> 
                  สั่งพิมพ์ (Print A4)
                </button>
                
                <button 
                  onClick={handleDownloadAllPages}
                  disabled={isDownloading}
                  className="bg-white text-navy border-2 border-white px-8 py-4 rounded-full font-heading font-bold text-lg hover:bg-palepink transition-all shadow-sm flex items-center justify-center gap-3 w-full sm:w-auto disabled:opacity-50"
                >
                  <span className="text-2xl">📥</span> 
                  {isDownloading ? "กำลังเซฟรูป..." : "บันทึกเป็นรูปภาพ (PNG)"}
                </button>
              </div>
            </div>
          )}

        </ScrollReveal>
      </div>

      {/* ==============================================================
          ส่วนของ โซนปริ้นท์ / โซนแคปภาพ
      ============================================================== */}
      <div 
        id="print-area" 
        ref={printAreaRef}
        className="hidden font-body text-navy"
      >
        {pages.map((pageCards, pageIndex) => (
          
          <div 
            key={`page-${pageIndex}`} 
            className="print-page bg-white relative mx-auto box-border"
            style={{ width: '210mm', height: '297mm', overflow: 'hidden' }}
          >
            
            {/* Grid การ์ด (5 คอลัมน์ x 10 แถว = 50 ใบต่อหน้า) */}
            <div className="flex flex-wrap content-start relative z-10" style={{ width: '210mm', height: '297mm' }}>
              
              {pageCards.map((card, idx) => (
                <div 
                  key={`card-${idx}`} 
                  className="relative box-border border-r-[0.5px] border-b-[0.5px] border-gray-200/50 p-[1.5mm]" 
                  style={{ width: '42mm', height: '29.7mm' }} 
                >
                  
                  {/* +++ พื้นหลัง (Background) สีชมพูพาสเทลด้านล่าง +++ */}
                  <div className="absolute inset-[1.5mm] bg-palepink rounded-[3px] overflow-hidden">
                    <div className="absolute -top-1 -left-1 w-6 h-6 bg-white/70 rounded-full blur-[3px]"></div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-azalea/60 rounded-full blur-[4px]"></div>
                  </div>

                  {/* +++ เลเยอร์ Liquid Glass วางทับอยู่ด้านบน Background อีกชั้น +++ */}
                  <div 
                    className="absolute inset-[1.5mm] bg-white/35 backdrop-blur-[2px] border-[0.5px] border-white/90 rounded-[3px] shadow-[inset_0_1px_4px_rgba(255,255,255,0.9),0_2px_4px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col items-center justify-between"
                  >
                    
                    {/* แสงสะท้อนกระจกแนวทแยง */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-70 pointer-events-none z-0"></div>

                    {/* เนื้อหาการ์ด (Content) */}
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-between py-[1.5px] px-[1px]">
                      
                      {/* ส่วนที่ 1: รูปช่อดอกไม้ */}
                      <div className="w-full h-[11mm] flex items-center justify-center mt-[1px]">
                        <img 
                          src={card.centerImage} 
                          onError={(e) => { e.target.onerror = null; e.target.src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/bouquet.png" }}
                          className="h-full object-contain mix-blend-multiply opacity-85" 
                          alt="Bouquet" 
                          crossOrigin="anonymous" 
                        />
                      </div>

                      {/* ส่วนที่ 2: ข้อความ Thank You และคำอวยพร (แก้ Line-height ป้องกันตัวหนังสือซ้อนกัน) */}
                      <div className="text-center w-full px-[1px] flex flex-col items-center">
                        <span className="font-heading font-bold text-[5px] text-[#556B5A] uppercase tracking-wider mb-[0.2px] drop-shadow-sm leading-none">
                          Thank You
                        </span>
                        {/* เพิ่ม leading-[1.3] และลดขนาดฟอนต์เล็กน้อย เพื่อให้บรรทัดไม่ซ้อนทับกัน */}
                        <p className="font-body text-[3.2px] leading-[1.3] text-navy/80 line-clamp-2 w-[94%]">
                          {card.message}
                        </p>
                        <p className="font-body text-[2.8px] text-navy/50 mt-[0.5px] tracking-tight font-medium leading-none">
                          #OnemorestepWithHongshi
                        </p>
                      </div>

                      {/* ส่วนที่ 3: QR Code และ ID ด้านล่างสุด */}
                      <div className="w-full flex items-end justify-center mb-[1px]">
                        <div className="flex flex-col items-center">
                          <div className="bg-white/90 p-[0.5px] rounded-[1px] shadow-sm border border-white/60">
                            <QRCodeSVG 
                              value={card.qrUrl} 
                              size={15} 
                              bgColor={"transparent"}
                              fgColor={"#2F4156"} 
                              level={"L"} 
                            />
                          </div>
                          <p className="text-[2.3px] text-navy/60 font-mono mt-[0.5px] font-bold leading-none">
                            ID: {card.id.split('-')[1]}
                          </p>
                        </div>
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
          #print-area { 
            position: absolute; 
            left: -9999px; 
            top: -9999px; 
            display: block !important; 
          }
        }
      `}} />
    </div>
  );
}