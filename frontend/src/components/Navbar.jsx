import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'รู้จักฮงชิ', path: '/profile' },
    { name: 'รายละเอียด', path: '/project' },
    { name: 'อวยพรวันเกิด', path: '/guestbook' },
  ];

  return (
    <nav className="bg-palepink text-navy sticky top-0 z-50 shadow-sm font-heading">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* โลโก้ (ซ้าย) */}
          <Link to="/" className="text-2xl font-bold tracking-wider hover:text-azalea transition z-50">
            Hongshi Day
          </Link>

          {/* เมนูสำหรับ Desktop (ซ่อนบนมือถือ) */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`font-bold hover:text-azalea transition-colors ${location.pathname === link.path ? 'text-azalea' : ''}`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* ปุ่ม Hamburger Menu สำหรับมือถือ (แสดงเฉพาะหน้าจอเล็ก) */}
          <div className="md:hidden flex items-center z-50">
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="text-navy hover:text-azalea focus:outline-none transition-colors p-2"
              aria-label="Toggle Menu"
            >
              {/* ใช้ SVG ไอคอนเพื่อให้ดูคมชัดและสวยงามบนมือถือ */}
              {isOpen ? (
                // ไอคอน กากบาท (✕) ตอนเปิดเมนู
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // ไอคอน 3 ขีด (Hamburger) ตอนปิดเมนู
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* แถบเมนู Dropdown ที่สไลด์ลงมาบนมือถือ */}
      <div 
        className={`md:hidden absolute top-16 left-0 w-full bg-white/95 backdrop-blur-md shadow-xl border-t border-gray-100 transition-all duration-300 ease-in-out origin-top ${
          isOpen ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col px-4 pt-4 pb-6 space-y-2 shadow-inner">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsOpen(false)} // กดเลือกเมนูแล้วให้ปิด Dropdown อัตโนมัติ
              className={`block px-4 py-3 rounded-xl font-bold text-center transition-colors ${
                location.pathname === link.path 
                  ? 'bg-palepink text-azalea' 
                  : 'text-navy hover:bg-beige'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}