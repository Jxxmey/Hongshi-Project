import ProtectedImage from '../components/ProtectedImage';
import Countdown from '../components/Countdown'; // นำเข้า Countdown Component

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center py-10 px-4 space-y-8">
      <header className="text-center flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-heading font-bold mb-2">
          Happy Hongshihoshi Day
        </h1>
        <p className="text-lg bg-palepink inline-block px-6 py-2 rounded-full shadow-sm">
          16 October 2026
        </p>
        
        {/* เรียกใช้งานนาฬิกานับถอยหลัง */}
        <Countdown />
      </header>

      <main className="w-full max-w-4xl">
        <ProtectedImage 
          apiEndpoint="/assets/banner.jpg" 
          altText="Hongshi Hero Banner" 
        />
      </main>
    </div>
  );
}