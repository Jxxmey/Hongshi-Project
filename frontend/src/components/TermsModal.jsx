import { useState, useEffect } from 'react';

export default function TermsModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // เช็คว่าเคยพบบันทึกการยอมรับข้อตกลงใน localStorage หรือไม่
    const hasAccepted = localStorage.getItem('hasAcceptedTerms');
    
    // ถ้ายังไม่เคยยอมรับ (เพิ่งเข้าเว็บครั้งแรก) ให้เปิดป๊อปอัป
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    // บันทึกค่าลงในเบราว์เซอร์ของผู้ใช้ว่า "ยอมรับแล้ว"
    localStorage.setItem('hasAcceptedTerms', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white p-8 md:p-10 rounded-[30px] w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto border-t-8 border-skyblue">
        
        <div className="text-center space-y-3 mb-6">
          <span className="text-5xl block">👋</span>
          <h2 className="text-2xl font-heading font-bold text-navy">ยินดีต้อนรับสู่ Hongshi Day!</h2>
          <p className="font-body text-navy/80 text-sm">
            โปรเจกต์นี้สร้างขึ้นด้วยความรัก เพื่อรวบรวมคำอวยพรถึงฮงชิ
          </p>
        </div>

        <div className="bg-beige/40 p-5 rounded-2xl space-y-3 font-body text-sm text-navy/80 mb-8 border border-skyblue/30">
          <p className="font-bold text-navy">ก่อนเริ่มใช้งาน ขอความร่วมมือดังนี้ครับ:</p>
          <ul className="space-y-2">
            <li>✨ ใช้ถ้อยคำสุภาพ ให้เกียรติศิลปินและแฟนคลับท่านอื่นๆ</li>
            <li>🚫 ห้ามใช้คำหยาบ (ระบบมี AI ช่วยกรองคำอัตโนมัติ)</li>
            <li>🚨 หากพบเห็นข้อความไม่เหมาะสม สามารถกดปุ่ม Report ได้ทันที</li>
          </ul>
        </div>

        <button 
          onClick={handleAccept}
          className="w-full font-heading font-bold text-lg px-8 py-4 rounded-xl shadow-md transition-colors duration-300 bg-skyblue text-navy hover:bg-azalea hover:text-white"
        >
          ✅ รับทราบและเข้าสู่เว็บไซต์
        </button>
      </div>
    </div>
  );
}