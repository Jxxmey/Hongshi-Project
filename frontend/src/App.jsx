import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Guestbook from './pages/Guestbook';
import ArtistProfile from './pages/ArtistProfile';
import Credits from './pages/Credits';
import AdminReports from './pages/AdminReports';
import AdminDashboard from './pages/AdminDashboard';
import SpotifyPlayer from './components/SpotifyPlayer';
import TermsModal from './components/TermsModal';
import AdminStats from './pages/AdminStats';
import FAQ from './pages/FAQ';
import { LanguageProvider } from './contexts/LanguageContext';
import LoadingScreen from './components/LoadingScreen';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  // +++ 1. ตั้งค่าสถานะ Loading โดยเช็คจาก sessionStorage ทันทีตั้งแต่เริ่ม +++
  const [isLoading, setIsLoading] = useState(() => {
    // ถ้าเคยโหลดหน้า Loading ผ่านไปแล้วในแท็บนี้ ให้เริ่มแบบไม่ต้องโหลด (false)
    const hasLoaded = sessionStorage.getItem('hasSeenLoading');
    return !hasLoaded; 
  });

  useEffect(() => {
    // เช็คว่าเคยนับยอดวิวไปแล้วหรือยังใน session นี้
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      fetch(`${API_URL}/visit`, { method: 'POST' })
        .then(() => {
          sessionStorage.setItem('hasVisited', 'true');
        })
        .catch(err => console.error("Failed to record visit:", err));
    }
  }, []);

  // +++ 2. ฟังก์ชันเมื่อหน้า Loading โหลดเสร็จ +++
  const handleLoadingComplete = () => {
    sessionStorage.setItem('hasSeenLoading', 'true'); // บันทึกไว้ว่าดูหน้าโหลดไปแล้ว
    setIsLoading(false);
  };

  // +++ 3. ถ้ายังโหลดอยู่ ให้แสดงแค่หน้า LoadingScreen +++
  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // +++ โหลดเสร็จแล้ว ค่อยแสดงหน้าเว็บหลัก +++
  return (
    <LanguageProvider>
      <BrowserRouter>
        
        {/* 🎨 พื้นหลังหลัก (Global Background) + ลูกโป่งลอย */}
        <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden bg-gradient-to-b from-[#fffafa] to-[#fdf2f6]">
          {/* 1. วงกลมเบลอ */}
          <div className="absolute w-[60vw] h-[60vw] max-w-[640px] max-h-[640px] bg-[rgba(255,172,203,0.25)] rounded-full blur-[80px] md:blur-[120px] -top-[10%] -left-[10%]"></div>
          <div className="absolute w-[50vw] h-[50vw] max-w-[540px] max-h-[540px] bg-[rgba(143,207,244,0.25)] rounded-full blur-[80px] md:blur-[120px] -bottom-[10%] -right-[5%]"></div>

          {/* 2. สไตล์สำหรับลูกโป่งและกระดาษสี */}
          <style>{`
            .bg-balloon {
              position: absolute;
              width: 72px;
              height: 88px;
              border-radius: 50% 50% 48% 48%;
              opacity: 0.55; 
              animation: driftFloat 5s ease-in-out infinite;
            }
            .bg-balloon::before {
              content: "";
              position: absolute;
              bottom: -7px;
              left: 29px;
              border-left: 7px solid transparent;
              border-right: 7px solid transparent;
              border-top: 10px solid currentColor;
            }
            .bg-balloon::after {
              content: "";
              position: absolute;
              width: 1px;
              height: 88px;
              background: currentColor;
              opacity: 0.5;
              left: 36px;
              top: 90px;
              transform: rotate(8deg);
              transform-origin: top;
            }
            
            .bg-balloon-pink { top: 12%; left: 8%; background: #ff9abd; color: #e47a9e; }
            .bg-balloon-blue { right: 8%; top: 22%; background: #a5d9f6; color: #75b7dd; animation-delay: -2s; }
            .bg-balloon-small { left: 15%; bottom: 15%; background: #b7ddf5; color: #80b9dc; animation-delay: -1s; scale: 0.63; }
            
            .bg-confetti {
              position: absolute;
              width: 9px;
              height: 18px;
              border-radius: 99px;
              background: #ff8eb5;
              opacity: 0.5;
              animation: confetti-dance 3.5s ease-in-out infinite;
            }
            .c1 { left: 15%; top: 20%; rotate: 28deg; }
            .c2 { right: 15%; bottom: 25%; background: #8bc9ed; rotate: -32deg; animation-delay: -.8s; }
            .c3 { right: 12%; top: 40%; background: #ffcb71; rotate: 44deg; animation-delay: -1.7s; }
            .c4 { left: 10%; bottom: 35%; background: #a9d7f2; rotate: -35deg; animation-delay: -2.4s; }
            .c5 { left: 25%; top: 15%; background: #ffca76; rotate: 55deg; animation-delay: -1.2s; }

            @keyframes driftFloat { 
              0%, 100% { translate: 0px 0px; rotate: 0deg; }
              50% { translate: 0px -17px; rotate: 3deg; } 
            }
            @keyframes confetti-dance { 
              0%, 100% { translate: 0px 0px; }
              50% { translate: 4px -11px; rotate: 18deg; } 
            }
            
            @media (max-width: 600px) {
              .bg-balloon-pink { scale: 0.65; left: 2%; top: 8%; }
              .bg-balloon-blue { scale: 0.65; right: 2%; top: 15%; }
              .bg-balloon-small { display: none; }
            }
          `}</style>

          {/* 3. เรียกใช้งานลูกโป่งและกระดาษสี */}
          <div className="bg-balloon bg-balloon-pink"></div>
          <div className="bg-balloon bg-balloon-blue"></div>
          <div className="bg-balloon bg-balloon-small"></div>
          
          <span className="bg-confetti c1"></span>
          <span className="bg-confetti c2"></span>
          <span className="bg-confetti c3"></span>
          <span className="bg-confetti c4"></span>
          <span className="bg-confetti c5"></span>

        </div>

        <div className="flex flex-col min-h-screen relative text-navy font-body">
          <Navbar />  
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/project" element={<ProjectDetail />} />
              <Route path="/guestbook" element={<Guestbook />} />
              <Route path="/profile" element={<ArtistProfile />} />
              <Route path="/credits" element={<Credits />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/stats" element={<AdminStats />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </main>

          <Footer />
          <SpotifyPlayer />
          <TermsModal />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;