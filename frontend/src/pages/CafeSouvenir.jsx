import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; 
import ScrollReveal from '../components/ScrollReveal';
import { toPng } from 'html-to-image'; 

// ลิสต์ข้อความสุ่มขอบคุณแฟนคลับ
const thankYouMessages = [
  "ขอบคุณที่มาร่วมก้าวเดินไปกับฮงชินะครับ 🩵",
  "ขอให้วันนี้เป็นวันที่ใจฟูเหมือนที่ฮงชิทำให้เรายิ้มได้นะ ✨",
  "ดีใจที่ได้เจอกันในโปรเจกต์นี้นะครับ แวะมาอีกบ่อยๆ นะ! 🍰",
  "One More Step with Hongshi... ก้าวไปด้วยกันเรื่อยๆ นะ 🦊",
  "ความรักของทุกคนทำให้ฮงชิเปล่งประกาย ขอบคุณที่ซัพพอร์ตนะครับ 🌟",
  "ฮงชิส่งรอยยิ้มตาหยีมาให้! ขอให้มีความสุขมากๆ ครับ 🥰"
];

// ลิสต์รูปภาพ
const hongshiImages = [
  "/assets/secret/01.png", 
  "/assets/secret/02.png",
  "/assets/secret/03.png",
  "/assets/secret/04.png",
  "/assets/secret/05.png",
  "/assets/secret/06.png",
  "/assets/secret/07.png",
  "/assets/secret/08.png",
  "/assets/secret/09.png",
  "/assets/secret/10.png",
  "/assets/secret/11.png",
  "/assets/secret/12.png",
  "/assets/secret/13.png",
  "/assets/secret/14.png",
  "/assets/secret/15.png"
];

// ฟังก์ชันแปลงข้อความ (ID) ให้เป็นตัวเลข
const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export default function CafeSouvenir() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef(null); 
  
  const [cardData, setCardData] = useState({
    id: '',
    message: '',
    image: ''
  });

  useEffect(() => {
    const urlId = searchParams.get('id');
    const finalId = urlId || `HONG-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 9999)}`;
    
    const hashNum = hashCode(finalId);
    
    const lockedMsg = thankYouMessages[hashNum % thankYouMessages.length];
    const lockedImage = hongshiImages[hashNum % hongshiImages.length];

    setCardData({
      id: finalId,
      message: lockedMsg,
      image: lockedImage
    });

    const imgObj = new Image();
    imgObj.src = lockedImage;
    
    imgObj.onload = () => {
      setTimeout(() => setIsLoading(false), 1200); 
    };
    
    imgObj.onerror = () => {
      setCardData(prev => ({
        ...prev, 
        image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
      }));
      setTimeout(() => setIsLoading(false), 1200); 
    };

  }, [searchParams]);

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

  const handleDownloadImage = async () => {
    if (!cardRef.current || isDownloading) return;
    setIsDownloading(true);

    try {
      // +++ เปลี่ยนให้แคปรูปโดยบังคับพื้นหลังใส เพื่อโชว์ภาพ Bg ที่เราซ่อนไว้ +++
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3, 
        cacheBust: true,
        backgroundColor: 'transparent', 
        fontEmbedCSS: localFontsCSS 
      });

      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `Hongshi_Souvenir_${cardData.id}.png`; 
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error("Download error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกภาพ กรุณาลองแคปหน้าจอแทนนะครับ 🙏");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 selection:bg-azalea selection:text-white pb-20 overflow-hidden"
      style={{ backgroundImage: "url('/assets/bg-pattern.jpg')" }} 
    >
      
      {isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-6 animate-pulse z-10 relative">
          <div className="w-20 h-20 border-4 border-palepink border-t-azalea rounded-full animate-spin"></div>
          <p className="text-navy font-heading font-bold text-xl tracking-wider">กำลังเตรียมของที่ระลึก...</p>
          <p className="text-navy/60 text-sm">รอสักครู่นะครับ 🦊</p>
        </div>
      ) : (
        <ScrollReveal>
          <div className="flex flex-col items-center justify-center animate-fade-in-up w-full max-w-sm z-10 relative">
            
            <Link to="/" className="text-navy/60 hover:text-azalea font-bold mb-6 flex items-center gap-2 transition-colors">
              <span>←</span> กลับหน้าหลัก
            </Link>

            {/* =========================================================
                ตัวการ์ดหลัก
            ========================================================= */}
            <div 
              ref={cardRef} 
              // +++ เอาคลาสสีพื้นหลังออก เพื่อให้ตอนแคปติดรูป bg.png แทน +++
              className="p-6 rounded-[35px] shadow-lg border-4 border-white w-full relative flex flex-col items-center group overflow-hidden"
              style={{ fontFamily: "'IBM Plex Sans Thai', sans-serif" }} 
            >
              {/* +++ รูปภาพพื้นหลังที่ใช้เฉพาะตอนแคปเซฟรูป (ปกติตาคนมองมันจะซ้อนกันเนียนๆ) +++ */}
              <div 
                className="absolute inset-0 z-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/bg.png')" }} 
              />
              {/* Overlay บางๆ ทำให้ตัวอักษรอ่านง่ายขึ้น (เสมือนการทำ backdrop-blur แบบไม่แคร์การเรนเดอร์) */}
              <div className="absolute inset-0 z-0 bg-white/70" />

              {/* รูปภาพฮงชิ */}
              <div className="w-full aspect-[4/5] bg-gray-100 rounded-[25px] overflow-hidden relative shadow-sm mb-6 border-2 border-white z-10">
                <img 
                  src={cardData.image} 
                  alt="Hongshi Souvenir" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                  crossOrigin="anonymous" 
                />
              </div>

              {/* ข้อความขอบคุณ */}
              <div className="text-center w-full flex-grow flex flex-col justify-between z-10">
                <div>
                  <span 
                    className="font-bold text-sm text-navy/60 uppercase tracking-widest block mb-2"
                    style={{ fontFamily: "'K2D', sans-serif" }}
                  >
                    Thank You !
                  </span>
                  
                  <p className="text-navy font-bold text-lg leading-relaxed mb-6 min-h-[60px] flex items-center justify-center px-2">
                    "{cardData.message}"
                  </p>
                </div>
                
                {/* ส่วนด้านล่าง: ID และ QR */}
                <div className="flex items-center justify-between w-full bg-white/60 border-2 border-white p-3 rounded-[20px] shadow-sm mt-auto">
                  <div className="text-left pl-2">
                    <p className="text-navy/50 text-[10px] uppercase font-bold tracking-wider mb-1">
                      Ticket
                    </p>
                    <p className="text-navy text-xs font-mono tracking-widest font-bold">
                      ID: {cardData.id}
                    </p>
                  </div>

                  <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 transition-transform duration-300 hover:scale-105">
                    <QRCodeSVG 
                      value={`https://hongshi-project.onrender.com/souvenir?id=${cardData.id}`} 
                      size={40} 
                      bgColor={"#ffffff"}
                      fgColor={"#2F4156"} 
                      level={"L"}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* =========================================================
                ปุ่มดาวน์โหลด
            ========================================================= */}
            <button 
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="mt-8 bg-palepink text-navy font-bold text-base py-3.5 px-8 rounded-full shadow-sm border-2 border-white hover:bg-azalea hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>⏳ กำลังบันทึกภาพ...</>
              ) : (
                <>📥 บันทึกรูปภาพเก็บไว้</>
              )}
            </button>

          </div>
        </ScrollReveal>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}} />
    </div>
  );
}