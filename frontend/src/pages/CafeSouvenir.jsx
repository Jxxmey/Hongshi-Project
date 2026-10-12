import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// +++ 1. เปลี่ยนจาก QRCodeSVG เป็น QRCodeCanvas เพื่อแก้บั๊กแคปจอค้างใน iOS +++
import { QRCodeCanvas } from 'qrcode.react'; 
import ScrollReveal from '../components/ScrollReveal';
import { toPng } from 'html-to-image'; 

const thankYouMessages = [
  "ขอบคุณที่มาร่วมก้าวเดินไปกับฮงชินะครับ 🩵",
  "ขอให้วันนี้เป็นวันที่ใจฟูเหมือนที่ฮงชิทำให้เรายิ้มได้นะ ✨",
  "ดีใจที่ได้เจอกันในโปรเจกต์นี้นะครับ แวะมาอีกบ่อยๆ นะ! 🍰",
  "One More Step with Hongshi... ก้าวไปด้วยกันเรื่อยๆ นะ 🦊",
  "ความรักของทุกคนทำให้ฮงชิเปล่งประกาย ขอบคุณที่ซัพพอร์ตนะครับ 🌟",
  "ฮงชิส่งรอยยิ้มตาหยีมาให้! ขอให้มีความสุขมากๆ ครับ 🥰",
  "ความน่ารักของทุกคนคือของขวัญที่ดีที่สุดของฮงชิเลยครับ 🎁✨",
  "ขอบคุณที่คอยซัพพอร์ตและโอบกอดฮงชิเสมอนะครับ จะตั้งใจเติบโตให้ดีเลย 🦊🌱",
  "ขอให้ทุกวันของทุกคนมีแต่รอยยิ้มและเรื่องใจฟูเหมือนกันนะ! 🪄🩵",
  "กี่ก้าวก็ไม่เหนื่อยเลย เพราะมีทุกคนคอยเดินไปพร้อมๆ กันแบบนี้ 👟💖",
  "ทุกๆ เสียงเชียร์และกำลังใจจากทุกคนมีค่ากับฮงชิมากๆ เลยครับ 🫶🌟",
  "ฮงชิจะคอยเป็นพลังบวกและรอยยิ้มให้ทุกคนอยู่เสมอนะครับ 🔋✨",
  "ดีใจที่สุดที่มีทุกคนในชีวิต ขอบคุณที่มาเป็นความสุขของกันและกันนะ 🦊💞",
  "One Step at a time... ค่อยๆ ก้าวไปด้วยกันแบบนี้ยาวๆ เลยนะครับ 🐾",
  "ขอบคุณที่ทำให้โปรเจกต์นี้อบอุ่นและพิเศษมากๆ รักทุกคนนะครับ 🍰💌",
  "เพราะมีทุกคน ฮงชิถึงมีแรงใจดื้อ เอ้ย! แรงใจทำงานในทุกวันเลยครับ 💪🧁",
  "ดีใจที่ได้เจอกันนะครับ หวังว่าของที่ระลึกชิ้นนี้จะทำให้ใจฟูนะ 📸💕",
  "ขอบคุณที่แวะมาหาฮงชินะครับ เดินทางปลอดภัยและมีวันที่ดีนะ 🩵🦊"
];

const hongshiImages = [
  "/assets/secret/01.png", "/assets/secret/02.png", "/assets/secret/03.png",
  "/assets/secret/04.png", "/assets/secret/05.png", "/assets/secret/06.png",
  "/assets/secret/07.png", "/assets/secret/08.png", "/assets/secret/09.png",
  "/assets/secret/10.png", "/assets/secret/11.png", "/assets/secret/12.png",
  "/assets/secret/13.png", "/assets/secret/14.png", "/assets/secret/15.png",
  "/assets/secret/16.png", "/assets/secret/17.png", "/assets/secret/18.png",
  "/assets/secret/19.png", "/assets/secret/20.png", "/assets/secret/21.png",
  "/assets/secret/22.png", "/assets/secret/23.png", "/assets/secret/24.png",
  "/assets/secret/25.png", "/assets/secret/26.png"
];

const hashCode = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// ฟังก์ชันดึงรูปภาพมาเป็น Base64
const getBase64Image = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Image not found");
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting image:", error);
    return url; 
  }
};

export default function CafeSouvenir() {
  const [searchParams] = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false); // สถานะตอนกดปุ่มเซฟ
  const [previewImage, setPreviewImage] = useState(null); // รูปภาพที่แคปเสร็จแล้ว
  
  const cardRef = useRef(null); 
  
  const [cardData, setCardData] = useState({
    id: '',
    message: '',
    image: '',
    bgImage: '' 
  });

  useEffect(() => {
    const loadData = async () => {
      const urlId = searchParams.get('id');
      const finalId = urlId || `HONG-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 9999)}`;
      const hashNum = hashCode(finalId);
      
      const lockedMsg = thankYouMessages[hashNum % thankYouMessages.length];
      const lockedImage = hongshiImages[hashNum % hongshiImages.length];

      try {
        const base64MainImage = await getBase64Image(lockedImage);
        const base64BgImage = await getBase64Image('/assets/bg.png'); 

        setCardData({
          id: finalId,
          message: lockedMsg,
          image: base64MainImage,
          bgImage: base64BgImage
        });
      } catch (error) {
        const fallbackBase64 = await getBase64Image('/assets/secret/01.png'); 
        setCardData(prev => ({
          ...prev, 
          id: finalId,
          message: lockedMsg,
          image: fallbackBase64
        }));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [searchParams]);

  // ฟอนต์จำลองเพื่อไม่ให้ตัวหนังสือเพี้ยนเวลาแปลงเป็นรูป
  const baseUrl = window.location.origin;
  const localFontsCSS = `
    @font-face {
      font-family: 'K2D';
      font-style: normal;
      font-weight: 700;
      src: url('${baseUrl}/assets/fonts/K2D/K2D-Bold.ttf') format('truetype');
    }
    @font-face {
      font-family: 'IBM Plex Sans Thai';
      font-style: normal;
      font-weight: 400;
      src: url('${baseUrl}/assets/fonts/IBM_Plex_Sans_Thai/IBMPlexSansThai-Regular.ttf') format('truetype');
    }
    @font-face {
      font-family: 'IBM Plex Sans Thai';
      font-style: normal;
      font-weight: 700;
      src: url('${baseUrl}/assets/fonts/IBM_Plex_Sans_Thai/IBMPlexSansThai-Bold.ttf') format('truetype');
    }
  `;

  // +++ 2. ฟังก์ชันจัดการแคปรูปเมื่อผู้ใช้ "กดปุ่ม" +++
  const handleGenerateImage = async () => {
    if (!cardRef.current || isGenerating) return;
    setIsGenerating(true);

    try {
      // หน่วงเวลาให้ UI เปลี่ยนปุ่มเป็น "กำลังเตรียม..." ก่อนทำงานหนัก
      await new Promise(resolve => setTimeout(resolve, 300));

      const options = {
        pixelRatio: 3, 
        backgroundColor: 'transparent', 
        fontEmbedCSS: localFontsCSS,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left'
        }
      };

      const dataUrl = await toPng(cardRef.current, options);
      
      // เอา URL ภาพที่ได้ ไปใส่ใน State เพื่อโชว์ Popup
      setPreviewImage(dataUrl);

    } catch (error) {
      console.error("Generate Image error:", error);
      alert("ไม่สามารถสร้างรูปภาพได้ กรุณาแคปหน้าจอแทนนะครับ 🙏");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full flex flex-col items-center justify-center py-12 px-4 selection:bg-azalea selection:text-white pb-20 overflow-hidden"
      style={{ backgroundImage: "url('/assets/bg-pattern.jpg')", backgroundSize: 'cover' }} 
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
            
            {/* =========================================================
                ตัวการ์ด (HTML จริง ๆ ที่เรนเดอร์ให้ผู้ใช้เห็นก่อนแคป)
            ========================================================= */}
            <div 
              ref={cardRef} 
              className="p-6 rounded-[35px] shadow-lg border-4 border-white w-full relative flex flex-col items-center group overflow-hidden bg-beige"
              style={{ fontFamily: "'IBM Plex Sans Thai', sans-serif" }} 
            >
              
              {/* แบคกราวน์แบบ Base64 */}
              {cardData.bgImage && (
                <img 
                  src={cardData.bgImage}
                  alt="Card Background"
                  className="absolute inset-0 w-full h-full object-cover z-0 opacity-90 mix-blend-multiply"
                />
              )}
              
              <div className="absolute inset-0 z-0 bg-white/60 backdrop-blur-[2px]" />

              <div className="w-full aspect-[4/5] bg-gray-100 rounded-[25px] overflow-hidden relative mb-6 border-2 border-white z-10 shadow-sm">
                <img 
                  src={cardData.image} 
                  alt="Hongshi Souvenir" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
              </div>

              <div className="text-center w-full flex-grow flex flex-col justify-between z-10">
                <div>
                  <span 
                    className="font-bold text-sm text-navy/60 uppercase tracking-widest block mb-2"
                    style={{ fontFamily: "'K2D', sans-serif" }}
                  >
                    Thank You 🎉
                  </span>
                  
                  <p className="text-navy font-bold text-lg leading-relaxed mb-6 min-h-[60px] flex items-center justify-center px-2">
                    "{cardData.message}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between w-full bg-white/80 border-2 border-white p-3 rounded-[20px] mt-auto shadow-sm">
                  <div className="text-left pl-2">
                    <p className="text-navy/50 text-[10px] uppercase font-bold tracking-wider mb-1">
                      Ticket
                    </p>
                    <p className="text-navy text-xs font-mono tracking-widest font-bold">
                      ID: {cardData.id}
                    </p>
                  </div>

                  <div className="bg-white p-1.5 rounded-xl border border-gray-100 shadow-sm">
                    {/* +++ เปลี่ยนจาก QRCodeSVG เป็น QRCodeCanvas เพื่อแก้บั๊กค้าง +++ */}
                    <QRCodeCanvas 
                      value={`${window.location.origin}/souvenir?id=${cardData.id}`} 
                      size={40} 
                      bgColor={"#ffffff"}
                      fgColor={"#000000"} 
                      level={"L"}
                    />
                  </div>
                </div>

              </div>
            </div>

            {/* ปุ่มกดแคปภาพ */}
            <button 
              onClick={handleGenerateImage}
              disabled={isGenerating}
              className="mt-8 bg-skyblue text-navy font-bold text-base py-3.5 px-8 rounded-full shadow-md border-2 border-white hover:bg-azalea hover:text-white transition-all duration-300 hover:-translate-y-1 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>⏳ กำลังเตรียมรูปภาพ...</>
              ) : (
                <>📥 บันทึกรูปภาพเก็บไว้</>
              )}
            </button>

          </div>
        </ScrollReveal>
      )}

      {/* =========================================================
          Popup โชว์รูปภาพสำเร็จรูป (กดค้างไว้เพื่อ Save ได้เลย)
      ========================================================= */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/90 p-6 backdrop-blur-sm animate-fade-in">
          <div className="bg-white/10 p-4 rounded-[30px] w-full max-w-sm flex flex-col items-center relative">
            
            {/* ปุ่มปิด */}
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white text-navy rounded-full shadow-lg font-bold text-xl flex items-center justify-center hover:bg-palepink transition-colors z-50"
            >
              ✕
            </button>

            <div className="bg-white/90 backdrop-blur-md px-6 py-2.5 rounded-full shadow-lg border-2 border-white mb-6 animate-bounce">
              <p className="text-navy font-bold text-[13px]">
                👇 แตะที่รูปภาพ <b>ค้างไว้</b> เพื่อบันทึกรูป 👇
              </p>
            </div>

            {/* รูปภาพ PNG ที่แคปมาเสร็จแล้ว (ของแท้) */}
            <img 
              src={previewImage} 
              alt="Your Souvenir" 
              className="w-full h-auto rounded-[35px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-white pointer-events-auto"
              style={{ WebkitTouchCallout: 'default' }} // สำคัญมาก: ทำให้ iPhone กดค้างเซฟรูปได้
            />
            
            {/* ปุ่มโหลดสำหรับคอมพิวเตอร์ (PC/Mac) เผื่อไว้กดคลิกโหลดตรงๆ */}
            <button 
              onClick={() => {
                const link = document.createElement("a");
                link.href = previewImage;
                link.download = `Hongshi_Souvenir_${cardData.id}.png`;
                link.click();
              }}
              className="mt-8 bg-skyblue text-navy font-bold py-3.5 px-8 rounded-full w-full shadow-lg hover:bg-azalea transition-colors"
            >
              คลิกเพื่อดาวน์โหลด (สำหรับ PC)
            </button>

          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in-up {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}} />
    </div>
  );
}