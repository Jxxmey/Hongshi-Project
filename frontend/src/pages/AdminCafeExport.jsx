import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function AdminCafeExport() {
  const [wishes, setWishes] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('wishes');

  useEffect(() => {
    fetchCafeData();
  }, []);

  const fetchCafeData = async () => {
    setLoading(true);
    try {
      // เรียก API ไปที่ Backend 
      const [wishesRes, photosRes] = await Promise.all([
        fetch(`${API_URL}/admin/cafe-wishes`),
        fetch(`${API_URL}/admin/cafe-photos`)
      ]);

      if (wishesRes.ok && photosRes.ok) {
        setWishes(await wishesRes.json());
        setPhotos(await photosRes.json());
      } else {
         console.error("API error:", wishesRes.status, photosRes.status);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
      alert("ไม่สามารถดึงข้อมูลได้ กรุณาตรวจสอบว่า Backend ทำงานอยู่หรือไม่");
    } finally {
      setLoading(false);
    }
  };

  const exportWishesToExcel = () => {
    if (wishes.length === 0) return alert("ไม่มีข้อมูลสำหรับ Export");
    
    const dataToExport = wishes.map((item, index) => ({
      "ลำดับ": index + 1,
      "ชื่อ (Name)": item.name,
      "ข้อความ (Message)": item.message,
      "อนุญาตให้ใช้": (item.isConsentGiven === true || item.isConsentGiven === "true") ? "อนุญาตแล้ว" : "ไม่ได้ระบุ"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Wishes");
    
    XLSX.writeFile(workbook, "Hongshi_Cafe_Wishes.xlsx");
  };

  const exportPhotosToExcel = () => {
    if (photos.length === 0) return alert("ไม่มีข้อมูลสำหรับ Export");

    const dataToExport = photos.map((item, index) => ({
      "ลำดับ": index + 1,
      "ชื่อผู้ส่ง": item.uploaderName,
      // +++ เปลี่ยนไปใช้ originalImageUrl ถ้ามี +++
      "ลิงก์รูปภาพ (HD)": item.originalImageUrl || item.imageUrl, 
      "ลิงก์รูปหน้าเว็บ (Crop)": item.imageUrl,
      "สถานะ": item.status,
      "อนุญาตให้ใช้": (item.isConsentGiven === true || item.isConsentGiven === "true") ? "อนุญาตแล้ว" : "ไม่ได้ระบุ"
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Photos");
    
    XLSX.writeFile(workbook, "Hongshi_Cafe_Photos.xlsx");
  };

  if (loading) {
    return <div className="p-10 text-center text-navy font-bold">กำลังโหลดข้อมูล...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 font-body">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <h1 className="text-3xl font-heading font-bold text-navy">🛠️ ระบบจัดการข้อมูลคาเฟ่ (Admin)</h1>
      </div>

      <div className="flex space-x-4 mb-6 border-b-2 border-gray-100 pb-2">
        <button 
          onClick={() => setActiveTab('wishes')}
          className={`px-6 py-2 rounded-t-xl font-bold transition-colors ${activeTab === 'wishes' ? 'bg-skyblue text-navy' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          📝 ข้อความอวยพร ({wishes.length})
        </button>
        <button 
          onClick={() => setActiveTab('gallery')}
          className={`px-6 py-2 rounded-t-xl font-bold transition-colors ${activeTab === 'gallery' ? 'bg-skyblue text-navy' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
        >
          📸 รูปภาพแกลเลอรี ({photos.length})
        </button>
      </div>

      {activeTab === 'wishes' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-navy">รายการข้อความที่อนุญาตให้นำไปใช้</h2>
            <button onClick={exportWishesToExcel} className="bg-green-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-green-600 transition shadow-sm flex items-center gap-2">
              📥 Export Excel
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-beige text-navy border-b-2 border-palepink">
                  <th className="p-3">ลำดับ</th>
                  <th className="p-3">ชื่อ</th>
                  <th className="p-3">ข้อความ</th>
                  <th className="p-3">การอนุญาต</th>
                </tr>
              </thead>
              <tbody>
                {wishes.map((w, idx) => (
                  <tr key={w.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">{idx + 1}</td>
                    <td className="p-3 font-bold">{w.name}</td>
                    <td className="p-3 max-w-md truncate">{w.message}</td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">อนุญาตแล้ว</span>
                    </td>
                  </tr>
                ))}
                {wishes.length === 0 && (
                  <tr><td colSpan="4" className="p-5 text-center text-gray-500">ไม่มีข้อมูล หรือ ไม่มีข้อความที่กดยินยอมให้ใช้</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-navy">รายการรูปภาพที่อนุญาตให้นำไปใช้</h2>
            <button onClick={exportPhotosToExcel} className="bg-green-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-green-600 transition shadow-sm flex items-center gap-2">
              📥 Export Excel
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-beige text-navy border-b-2 border-palepink">
                  <th className="p-3">รูปภาพ</th>
                  <th className="p-3">ชื่อผู้ส่ง</th>
                  <th className="p-3">ลิงก์ภาพ (HD)</th>
                  <th className="p-3">การอนุญาต</th>
                </tr>
              </thead>
              <tbody>
                {photos.map((p, idx) => (
                  <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <img src={p.imageUrl} alt="preview" className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                    </td>
                    <td className="p-3 font-bold">{p.uploaderName}</td>
                    <td className="p-3">
                      <a href={p.originalImageUrl || p.imageUrl} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline text-sm truncate block max-w-xs">
                        {p.originalImageUrl || p.imageUrl}
                      </a>
                    </td>
                    <td className="p-3">
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">อนุญาตแล้ว</span>
                    </td>
                  </tr>
                ))}
                {photos.length === 0 && (
                  <tr><td colSpan="4" className="p-5 text-center text-gray-500">ไม่มีข้อมูล หรือ ไม่มีรูปภาพที่กดยินยอมให้ใช้ (รออนุมัติ)</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}