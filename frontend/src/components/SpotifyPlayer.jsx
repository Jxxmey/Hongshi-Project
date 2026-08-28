import { useState } from 'react';

export default function SpotifyPlayer() {
  // สร้าง State สำหรับเก็บค่าว่า เปิด หรือ ซ่อน เครื่องเล่นอยู่ (ตั้งค่าเริ่มต้นเป็นเปิด)
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="fixed bottom-4 left-4 z-50 flex flex-col items-start gap-2">
      
      {/* กล่องใส่เครื่องเล่น (จะพับเก็บเมื่อ isOpen เป็น false) */}
      <div 
        className={`w-72 md:w-80 transition-all duration-500 ease-in-out origin-bottom ${
          isOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 h-0 overflow-hidden'
        }`}
      >
        <iframe
          style={{ borderRadius: '12px' }}
          src="https://open.spotify.com/embed/track/7p5yG8VirRCXPCzCNdj38Y?utm_source=generator&si=f76d08182e46433e" 
          width="100%"
          height="80" // ปรับความสูงเป็น 80px จะได้เครื่องเล่นแบบแบน (Compact)
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Hongshihoshi Playlist"
        ></iframe>
      </div>

      {/* ปุ่มกด ซ่อน / แสดง */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-navy text-beige px-4 py-2 rounded-full text-sm font-body shadow-lg hover:bg-skyblue hover:text-navy transition duration-300 flex items-center gap-2"
      >
        {isOpen ? '⬇ ซ่อนเพลย์ลิสต์' : '🎵 ฟังเพลงน้องฮง'}
      </button>

    </div>
  );
}