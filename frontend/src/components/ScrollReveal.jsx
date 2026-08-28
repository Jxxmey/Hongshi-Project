import { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({ children, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    // ตั้งค่าตัวจับการมองเห็นบนหน้าจอ
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // ถ้าเลื่อนมาเห็นชิ้นส่วนนี้แล้ว (เห็นอย่างน้อย 10%)
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target); // ให้แสดงครั้งเดียวแล้วจำไว้เลย ไม่ต้องเฟดใหม่เวลาเลื่อนกลับ
          }
        });
      },
      { threshold: 0.1 } // 0.1 หมายถึงโผล่มาแค่ 10% ก็ให้เริ่มแอนิเมชันเลย
    );

    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 blur-none' // สถานะตอนโชว์ (ชัดเจน ไม่เบลอ)
          : 'opacity-0 translate-y-12 blur-sm' // สถานะก่อนโชว์ (ล่องหน เลื่อนลงไปข้างล่างนิดนึง และเบลอๆ แบบเว็บ Apple)
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}