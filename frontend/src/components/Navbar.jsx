import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-palepink/90 backdrop-blur-md py-4 px-6 shadow-sm sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <Link to="/" className="font-heading font-bold text-xl text-navy hover:text-azalea transition-colors">
          Hongshi Day
        </Link>
        <div className="space-x-4 md:space-x-6 font-body font-medium text-navy text-sm md:text-base">
          <Link to="/" className="hover:text-azalea transition-colors">หน้าแรก</Link>
          <Link to="/profile" className="hover:text-azalea transition-colors">รู้จักฮงชิ</Link>
          <Link to="/project" className="hover:text-azalea transition-colors">รายละเอียด</Link>
          <Link to="/guestbook" className="hover:text-azalea transition-colors">อวยพรวันเกิด</Link>
        </div>
      </div>
    </nav>
  );
}