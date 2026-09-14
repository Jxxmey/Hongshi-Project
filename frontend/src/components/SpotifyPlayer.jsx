import { useState } from 'react';

export default function SpotifyPlayer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // ย้ายไปมุมขวาล่าง (bottom-4 right-4) และใช้ items-end จัดให้อยู่ชิดขวา
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[100] flex flex-col items-end gap-3">
      
      {/* กล่องใส่เครื่องเล่น */}
      <div 
        className={`w-72 md:w-80 transition-all duration-300 ease-out origin-bottom-right ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 h-0 overflow-hidden'
        }`}
      >
        <iframe
          style={{ borderRadius: '12px', boxShadow: '0 10px 25px rgba(23, 61, 103, 0.2)' }}
          src="https://open.spotify.com/embed/track/7p5yG8VirRCXPCzCNdj38Y?utm_source=generator&si=f76d08182e46433e" 
          width="100%"
          height="80" 
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          title="Hongshihoshi Playlist"
        ></iframe>
      </div>

      {/* ปุ่มกด ซ่อน/แสดง แบบวงกลมเล็กๆ (ลอยอยู่มุมจอ) */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-xl border-2 transition-all duration-300 hover:scale-110 z-50 ${
          isOpen 
            ? 'bg-palepink text-navy border-white' 
            : 'bg-palepink text-navy border-white'
        }`}
        aria-label="Toggle Spotify Player"
      >
        {isOpen ? '✕' : '🎵'}
      </button>

    </div>
  );
}