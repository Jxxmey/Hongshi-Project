import { useState } from 'react';

export default function Credits() {
  const [copied, setCopied] = useState(false);
  const hashtags = "#HappyHongshihoshiDay2026 #Hongshihoshi #LYKN";

  const handleCopyHashtags = () => {
    navigator.clipboard.writeText(hashtags);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const teamMembers = [
    { handle: "@pumpkin_NT", link: "https://x.com/pumpkin_NT" },
    { handle: "@Jaiidees", link: "https://x.com/Jaiidees" },
    { handle: "@benjycoffee", link: "https://x.com/benjycoffee" },
    { handle: "@PpuangthongG", link: "https://x.com/PpuangthongG" }
  ];

  return (
    <div className="py-12 px-4 max-w-4xl mx-auto space-y-16 selection:bg-azalea selection:text-white">
      
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy">Credits & Contact</h2>
        <p className="text-lg font-body text-navy/80">ขอขอบคุณทุกการสนับสนุนที่ทำให้โปรเจกต์วันเกิดนี้เกิดขึ้น 🩵</p>
      </div>

      <section className="bg-white p-8 md:p-12 rounded-3xl shadow-sm text-center space-y-6 border-t-8 border-skyblue">
        <h3 className="text-2xl font-heading font-bold text-navy">🏷️ มาร่วมอวยพรวันเกิดฮงชิกัน!</h3>
        <p className="font-body text-navy/80">อย่าลืมติดแฮชแท็กเหล่านี้ในโพสต์ของคุณ เพื่อส่งความรักไปให้ถึงศิลปินกันนะครับ</p>
        
        <div className="bg-beige p-6 rounded-2xl border-2 border-dashed border-skyblue">
          <p className="text-xl md:text-2xl font-heading font-bold text-navy">{hashtags}</p>
        </div>

        {/* ปุ่มสี Sky Blue โฮเวอร์เป็น Azalea */}
        <button onClick={handleCopyHashtags}
          className="font-heading font-bold px-8 py-3 rounded-full shadow-sm transition-colors duration-300 bg-skyblue text-navy hover:bg-azalea">
          {copied ? '✅ คัดลอกแฮชแท็กแล้ว!' : '📋 กดคัดลอกแฮชแท็ก'}
        </button>
      </section>

      <section className="space-y-6">
        <h3 className="text-2xl font-heading font-bold text-navy text-center mb-8">✨ Team & Special Thanks</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-body">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white p-5 rounded-2xl shadow-sm text-center flex flex-col justify-center items-center gap-3 border-b-4 border-palepink hover:border-azalea transition-colors">
              <span className="text-3xl">🍦</span>
              <p className="text-sm font-bold text-navy">Team Member</p>
              {/* ปุ่มสี Sky Blue โฮเวอร์เป็น Azalea */}
              <a href={member.link} target="_blank" rel="noreferrer" 
                className="bg-skyblue text-navy font-bold px-3 py-2 rounded-full text-xs hover:bg-azalea transition-colors w-full">
                X: {member.handle}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white p-8 md:p-10 rounded-3xl shadow-sm text-center space-y-4 border-t-8 border-azalea">
          <span className="text-5xl block">💖</span>
          <h4 className="text-2xl font-heading font-bold text-navy">ขอบคุณ ไลค์ยู (LYKYOU)</h4>
          <p className="text-navy/80 font-body max-w-2xl mx-auto">
            ขอขอบคุณแฟนคลับชาวไลล์ทุกคนที่ร่วมโดเนทและสนับสนุนโปรเจกต์นี้ให้สำเร็จลุล่วงไปได้ด้วยดี 
            ความรักและพลังซัพพอร์ตของทุกคนจะส่งถึงฮงชิอย่างแน่นอนครับ!
          </p>
        </div>
      </section>

    </div>
  );
} 