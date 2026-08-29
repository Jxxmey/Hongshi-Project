import { useEffect } from 'react'; // นำเข้า useEffect
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function App() {
  // +++ เพิ่มฟังก์ชันนี้เพื่อนับยอดวิว +++
  useEffect(() => {
    // เช็คว่าเคยนับไปแล้วหรือยังใน session นี้ จะได้ไม่นับซ้ำถ้ารีเฟรชรัวๆ
    const hasVisited = sessionStorage.getItem('hasVisited');
    
    if (!hasVisited) {
      fetch(`${API_URL}/visit`, { method: 'POST' })
        .then(() => {
          sessionStorage.setItem('hasVisited', 'true');
        })
        .catch(err => console.error("Failed to record visit:", err));
    }
  }, []);

  return (
    <LanguageProvider>
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
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