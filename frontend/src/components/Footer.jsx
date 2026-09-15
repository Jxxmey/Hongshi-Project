import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    // +++ เปลี่ยน py-8 เป็น pt-8 pb-24 md:pb-8 เพื่อดันข้อความหนี Bottom Navbar บนมือถือ +++
    <footer className="bg-palepink text-navy pt-8 pb-28 md:pb-8 mt-auto text-center font-body text-sm border-t border-white/50">
      <div className="max-w-4xl mx-auto px-4 space-y-2">
        <p className="font-bold">© 2026 Happy Hongshihoshi Day. All rights reserved.</p>
        <div className="flex justify-center items-center gap-2 opacity-80 hover:opacity-100 transition-opacity duration-300 text-xs">
          <Link to="/credits" className="hover:text-azalea transition-colors underline decoration-dotted">
            ทีมผู้จัดทำ (Credits & Contact)
          </Link>
        </div>
      </div>
    </footer>
  );
}