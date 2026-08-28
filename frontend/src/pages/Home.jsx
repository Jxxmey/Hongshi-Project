import ProtectedImage from '../components/ProtectedImage';
import Countdown from '../components/Countdown';
import ScrollReveal from '../components/ScrollReveal';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 space-y-8">
      
      <header className="text-center flex flex-col items-center w-full">
        {/* ส่วนที่ 1: หัวข้อและวันที่ (ลอยขึ้นมาทันที) */}
        <ScrollReveal>
          <div className="mb-6">
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2 text-navy">
              Happy Hongshihoshi Day
            </h1>
            <p className="text-lg font-bold text-navy bg-palepink inline-block px-6 py-2 rounded-full shadow-sm">
              16 October 2026
            </p>
          </div>
        </ScrollReveal>
        
        {/* ส่วนที่ 2: นาฬิกานับถอยหลัง (ลอยตามมาทีหลัง หน่วงเวลา 200ms) */}
        <ScrollReveal delay={200}>
          <Countdown />
        </ScrollReveal>
      </header>

      <main className="w-full max-w-4xl">
        {/* ส่วนที่ 3: แบนเนอร์ (ลอยขึ้นมาอันสุดท้าย หน่วงเวลา 400ms) */}
        <ScrollReveal delay={400}>
          <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-white transition-transform hover:scale-[1.02] duration-500">
            
            {/* รูปสำหรับมือถือ (แสดงเฉพาะหน้าจอเล็กกว่า md) */}
            <div className="block md:hidden">
              <ProtectedImage 
                apiEndpoint="/assets/banner2.jpg" 
                altText="Hongshi Hero Banner Mobile" 
              />
            </div>

            {/* รูปสำหรับคอม/แท็บเล็ต (แสดงเฉพาะหน้าจอ md ขึ้นไป) */}
            <div className="hidden md:block">
              <ProtectedImage 
                apiEndpoint="/assets/banner.jpg" 
                altText="Hongshi Hero Banner Desktop" 
              />
            </div>

          </div>
        </ScrollReveal>
      </main>
      
    </div>
  );
}