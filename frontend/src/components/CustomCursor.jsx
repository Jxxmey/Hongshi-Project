import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // เช็คว่าเป็นมือถือหรือจอสัมผัสไหม (ถ้าใช่จะไม่แสดง Custom Cursor เพื่อให้ใช้งานปกติ)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);

      // ตรวจสอบว่าตำแหน่งที่เมาส์ชี้อยู่ เป็นปุ่ม ลิงก์ หรือสิ่งที่กดได้หรือไม่
      const target = e.target;
      const isClickable = 
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('button') ||
        target.closest('a');

      setIsPointer(!!isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className="fixed pointer-events-none z-[9999] transition-transform duration-100 ease-out flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        // ถ้าเอาเมาส์ชี้ปุ่ม โลโก้จะขยายใหญ่ขึ้น 1.5 เท่า
        transform: `translate(-50%, -50%) scale(${isPointer ? 1.5 : 1})`,
      }}
    >
      <img 
        src="/assets/logo.png" 
        alt="cursor" 
        draggable="false"
        className="w-10 h-10 md:w-12 md:h-12 object-contain drop-shadow-md select-none transition-all duration-200" 
      />
    </div>
  );
}