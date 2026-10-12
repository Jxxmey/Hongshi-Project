import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // นำเข้าไลบรารี QR Code
import ScrollReveal from '../components/ScrollReveal';

// ลิสต์ข้อความสุ่มขอบคุณแฟนคลับ
const thankYouMessages = [
  "ขอบคุณที่มาร่วมก้าวเดินไปกับฮงชินะครับ 🩵",
  "ขอให้วันนี้เป็นวันที่ใจฟูเหมือนที่ฮงชิทำให้เรายิ้มได้นะ ✨",
  "ดีใจที่ได้เจอกันในโปรเจกต์นี้นะครับ แวะมาอีกบ่อยๆ นะ! 🍰",
  "One More Step with Hongshi... ก้าวไปด้วยกันเรื่อยๆ นะ 🦊",
  "ความรักของทุกคนทำให้ฮงชิเปล่งประกาย ขอบคุณที่ซัพพอร์ตนะครับ 🌟",
  "ฮงชิส่งรอยยิ้มตาหยีมาให้! ขอให้มีความสุขมากๆ ครับ 🥰"
];

// ลิสต์รูปภาพสุ่ม (สมมติว่าคุณมีรูปฮงชิในโฟลเดอร์ public/assets/hongshi/)
// คุณสามารถตั้งชื่อไฟล์เป็น 1.jpg, 2.jpg... หรือดึงจาก URL ภายนอกได้
const hongshiImages = [
  "/assets/secret/01.jpg", 
  "/assets/secret/02.jpg",
  "/assets/secret/03.jpg",
  "/assets/secret/04.jpg",
  "/assets/secret/05.jpg",
  "/assets/secret/06.jpg",
  "/assets/secret/07.jpg",
  "/assets/secret/08.jpg",
  "/assets/secret/09.jpg",
  "/assets/secret/10.jpg",
  "/assets/secret/11.jpg",
  "/assets/secret/12.jpg",
  "/assets/secret/13.jpg",
  "/assets/secret/14.jpg",
  "/assets/secret/15.jpg"
];

export default function CafeSouvenir() {
  const [isLoading, setIsLoading] = useState(true); // สถานะการโหลดรูป
  const [randomMsg, setRandomMsg] = useState('');
  const [randomImage, setRandomImage] = useState('');
  const [uniqueId, setUniqueId] = useState(''); // ID สำหรับสร้าง QR ไม่ซ้ำกัน

  useEffect(() => {
    // 1. สุ่มข้อความ รูปภาพ และสร้าง ID ไม่ซ้ำกันตอนเปิดหน้า
    const msg = thankYouMessages[Math.floor(Math.random() * thankYouMessages.length)];
    // Fallback URL ถ้ารูปในเครื่องไม่มี
    const img = hongshiImages[Math.floor(Math.random() * hongshiImages.length)]; 
    const fallbackImg = "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"; // รูปคาเฟ่ชั่วคราว
    
    // สร้าง ID ตัวเลขสุ่มแบบยาวๆ ผสมเวลา เพื่อเอาไปทำ QR (สแกนแล้วอาจจะลิงก์ไปเว็บ หรือโชว์ ID)
    const generatedId = `HONG-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 9999)}`;
    
    setRandomMsg(msg);
    setUniqueId(generatedId);

    // 2. โหลดรูปภาพแบบ Pre-load เพื่อไม่ให้ภาพแหว่ง
    const imgObj = new Image();
    imgObj.src = img; // ลองโหลดรูปฮงชิ
    
    imgObj.onload = () => {
      setRandomImage(img);
      // หน่วงเวลาหน้า Loading ให้ดูมีลูกเล่นนิดนึง (ประมาณ 1.5 วินาที)
      setTimeout(() => setIsLoading(false), 1500); 
    };
    
    imgObj.onerror = () => {
      // ถ้ารูปฮงชิพังหรือหาไฟล์ไม่เจอ ให้ใช้รูป Fallback
      setRandomImage(fallbackImg);
      setTimeout(() => setIsLoading(false), 1500); 
    };

  }, []);

  return (
    <div className="relative min-h-[85vh] w-full flex flex-col items-center justify-center font-body px-4 bg-[#fafafa] pb-20">
      
      {isLoading ? (
        // ============================================
        // หน้า LOADING (หมุนๆ รอโหลดรูป)
        // ============================================
        <div className="flex flex-col items-center justify-center space-y-6 animate-pulse">
          <div className="w-20 h-20 border-4 border-palepink border-t-azalea rounded-full animate-spin"></div>
          <p className="text-navy font-heading font-bold text-xl tracking-wider">กำลังเตรียมของที่ระลึก...</p>
          <p className="text-navy/50 text-sm">รอสักครู่นะครับ 🦊</p>
        </div>
      ) : (
        // ============================================
        // หน้า SOUVENIR (โหลดเสร็จแล้ว โชว์การ์ด)
        // ============================================
        <ScrollReveal>
          <div className="flex flex-col items-center animate-fade-in-up w-full max-w-sm">
            
            <Link to="/" className="text-navy/60 hover:text-azalea font-bold mb-6 flex items-center gap-2 transition-colors">
              <span>←</span> กลับหน้าหลัก
            </Link>

            {/* การ์ดของที่ระลึก */}
            <div className="bg-white p-4 rounded-[35px] shadow-[0_15px_40px_rgba(0,0,0,0.08)] border-2 border-palepink w-full relative overflow-hidden group">
              
              {/* รูปภาพฮงชิ */}
              <div className="w-full aspect-[4/5] bg-gray-100 rounded-[25px] overflow-hidden relative">
                <img 
                  src={randomImage} 
                  alt="Hongshi Souvenir" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Overlay ไล่สีดำๆ ด้านล่างให้อ่านตัวหนังสือชัดขึ้น */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent"></div>
                
                {/* ข้อความขอบคุณ (ทับอยู่บนรูปด้านล่าง) */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-center">
                  <p className="text-white font-medium text-sm md:text-base leading-relaxed drop-shadow-md">
                    "{randomMsg}"
                  </p>
                </div>
              </div>

              {/* ส่วน QR Code และรายละเอียดด้านล่างภาพ */}
              <div className="mt-5 mb-2 px-4 flex items-center justify-between">
                <div>
                  <h3 className="text-navy font-heading font-bold text-lg">Souvenir Ticket</h3>
                  <p className="text-navy/50 text-xs font-mono mt-1">ID: {uniqueId}</p>
                </div>

                {/* ตัว Generator QR Code (สแกนแล้วลิงก์ไปหน้าเว็บ พร้อมแนบ ID) */}
                <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-100">
                  <QRCodeSVG 
                    value={`https://hongshi-project.lykn.online/ticket?id=${uniqueId}`} // ลิงก์ที่ต้องการให้สแกน
                    size={65} 
                    bgColor={"#ffffff"}
                    fgColor={"#2D3748"} // สี navy เข้มๆ
                    level={"M"}
                  />
                </div>
              </div>

            </div>

            {/* ปุ่มกดเซฟรูปการ์ด (สามารถเพิ่ม html2canvas/html-to-image ให้คนแคปเซฟได้เหมือนหน้า admin ครับ) */}
            <button 
              onClick={() => alert("ระบบบันทึกภาพจะมาในเร็วๆ นี้! สามารถแคปหน้าจอเก็บไว้ได้เลยครับ 🩵")}
              className="mt-8 bg-skyblue/30 text-navy font-bold py-3.5 px-8 rounded-full hover:bg-azalea hover:text-white transition-colors flex items-center gap-2"
            >
              📸 บันทึกเป็นที่ระลึก
            </button>

          </div>
        </ScrollReveal>
      )}

      {/* Animation */}
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