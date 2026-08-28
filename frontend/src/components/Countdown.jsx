import { useState, useEffect } from 'react';

export default function Countdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // กำหนดวันเกิดน้องฮง (16 ตุลาคม 2026 เวลา 00:00:00 น.)
    const targetDate = new Date('2026-10-16T00:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        // ถ้าถึงวันเกิดแล้วให้แสดงผลเป็น 0 ทั้งหมด
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex space-x-4 text-center mt-6">
      {Object.entries(timeLeft).map(([label, value]) => (
        <div key={label} className="bg-white/60 backdrop-blur-sm shadow-sm rounded-xl p-4 w-20 flex flex-col items-center">
          <span className="text-3xl font-heading font-bold text-navy">
            {value.toString().padStart(2, '0')}
          </span>
          <span className="text-xs font-body text-navy uppercase mt-1">{label}</span>
        </div>
      ))}
    </div>
  );
}