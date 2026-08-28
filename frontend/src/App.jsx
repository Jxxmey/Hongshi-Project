import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectDetail from './pages/ProjectDetail';
import Guestbook from './pages/Guestbook';
import ArtistProfile from './pages/ArtistProfile';
import Credits from './pages/Credits';
import AdminReports from './pages/AdminReports';
import AdminDashboard from './pages/AdminDashboard'; // 1. นำเข้าหน้า Dashboard
import SpotifyPlayer from './components/SpotifyPlayer';

function App() {
  return (
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
            
            {/* โซน Admin */}
            <Route path="/admin" element={<AdminDashboard />} /> {/* 2. เพิ่ม Route หน้าหลัก Admin */}
            <Route path="/admin/reports" element={<AdminReports />} />
          </Routes>
        </main>

        <Footer />
        <SpotifyPlayer />
      </div>
    </BrowserRouter>
  );
}

export default App;