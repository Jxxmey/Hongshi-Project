import { useState, useEffect } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { useLanguage } from '../contexts/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default function Gallery() {
  const { t } = useLanguage();
  
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploaderName, setUploaderName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${API_URL}/gallery`);
        if (response.ok) {
          const data = await response.json();
          setPhotos(data); 
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadMessage({ text: t.gallery.uploadModal.noFile, type: 'error' });
      return;
    }

    setIsUploading(true);
    setUploadMessage({ text: t.gallery.uploadModal.uploading, type: 'info' });

    const formData = new FormData();
    formData.append('image', uploadFile);
    formData.append('uploaderName', uploaderName || 'Anonymous LYKYOU');

    try {
      const response = await fetch(`${API_URL}/gallery/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload Failed');

      setUploadMessage({ text: t.gallery.uploadModal.success, type: 'success' });
      
      setTimeout(() => {
        setIsUploadOpen(false);
        setUploadFile(null);
        setUploaderName('');
        setUploadMessage({ text: '', type: '' });
      }, 3000);

    } catch (error) {
      console.error(error);
      setUploadMessage({ text: t.gallery.uploadModal.error, type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  // ฟังก์ชันสุ่ม/กำหนดขนาดกล่องให้ดูสะเปะสะปะแบบ Bento Grid (ไม่มีทางซ้อนกัน)
  const getGridClass = (index) => {
    const patterns = [
      'col-span-2 row-span-2 md:col-span-2 md:row-span-2', // ภาพใหญ่เด่น (Large square)
      'col-span-1 row-span-1 md:col-span-1 md:row-span-1', // เล็ก (Small square)
      'col-span-1 row-span-1 md:col-span-1 md:row-span-2', // ยาวแนวตั้ง (Tall rectangle)
      'col-span-2 row-span-1 md:col-span-1 md:row-span-1', // กว้างแนวนอนในมือถือ, เล็กในคอม
      'col-span-1 row-span-2 md:col-span-2 md:row-span-1', // ยาวแนวตั้งในมือถือ, กว้างแนวนอนในคอม
      'col-span-1 row-span-1 md:col-span-1 md:row-span-1', // เล็ก (Small square)
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto space-y-12 pb-20">
      
      {/* Header */}
      <ScrollReveal>
        <div className="text-center space-y-6">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy drop-shadow-sm">
            {t.gallery.title}
          </h2>
          <p className="text-lg font-body text-navy/80 bg-white/60 inline-block px-6 py-2 rounded-full shadow-sm backdrop-blur-sm">
            {t.gallery.subtitle}
          </p>
          
          <div>
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="mt-4 font-heading font-bold text-base md:text-lg px-8 py-3 rounded-full shadow-md transition-all duration-300 bg-skyblue text-navy hover:bg-azalea hover:text-white hover:-translate-y-1"
            >
              + {t.gallery.uploadBtn}
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* Grid แบบสะเปะสะปะ (Bento Grid) - ใช้ grid-flow-row-dense หยอดกล่องลงที่ว่างอัตโนมัติ */}
      {loading ? (
        <div className="text-center font-heading font-bold text-navy/60 animate-pulse py-20">
          กำลังโหลดรูปภาพ... ⏳
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center font-body text-navy/60 bg-white p-10 rounded-3xl shadow-sm border-2 border-dashed border-palepink">
          {t.gallery.empty}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 auto-rows-[150px] md:auto-rows-[200px] lg:auto-rows-[250px] grid-flow-row-dense">
          {photos.map((photo, index) => (
            // [>div]:h-full บังคับให้ ScrollReveal ขยายเต็มช่อง Grid เสมอ
            <div key={photo._id || index} className={`relative w-full h-full ${getGridClass(index)} [&>*]:h-full [&>*]:w-full`}>
              <ScrollReveal delay={(index % 10) * 50}>
                <div 
                  className="w-full h-full relative group overflow-hidden rounded-2xl md:rounded-[30px] shadow-sm cursor-pointer border-4 border-white hover:border-skyblue hover:shadow-xl transition-all duration-300 bg-beige select-none"
                  onClick={() => setSelectedImage(photo)}
                  onContextMenu={(e) => e.preventDefault()} 
                  onDragStart={(e) => e.preventDefault()}
                >
                  <div className="absolute inset-0 z-10 bg-transparent"></div>
                  
                  {/* เปลี่ยนจาก h-auto เป็น h-full และใช้ object-cover เพื่อให้รูปเติมเต็มกรอบพอดี ไม่ซ้อน ไม่ทะลุ */}
                  <img 
                    src={photo.imageUrl} 
                    alt={`Uploaded by ${photo.uploaderName}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                    loading="lazy"
                    draggable="false"
                  />
                  
                  <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-navy/90 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                    <p className="text-white text-xs md:text-sm font-bold font-body truncate">
                      Cr. {photo.uploaderName}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox Modal (ยังเหมือนเดิม) */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/90 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 md:-right-12 text-white hover:text-azalea bg-white/20 hover:bg-white/40 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all z-20"
            >
              ✕
            </button>
            <div 
              className="w-full h-full overflow-hidden rounded-2xl md:rounded-[30px] border-4 border-white shadow-2xl relative select-none"
              style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <div className="absolute inset-0 z-10 bg-transparent"></div>
              <img 
                src={selectedImage.imageUrl} 
                className="w-full h-full max-h-[85vh] object-contain bg-black/50 pointer-events-none"
                alt="Selected"
                draggable="false"
              />
            </div>
            <p className="text-white mt-4 font-body font-bold bg-navy/50 px-5 py-2 rounded-full border border-white/20">
              Cr. {selectedImage.uploaderName}
            </p>
          </div>
        </div>
      )}

      {/* Upload Modal (ยังเหมือนเดิม) */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-[30px] w-full max-w-md shadow-2xl relative border-t-8 border-skyblue">
            
            <button 
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 text-navy/50 hover:text-azalea bg-gray-100 hover:bg-palepink w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >
              ✕
            </button>

            <h3 className="text-2xl font-heading font-bold text-navy mb-2 text-center">
              {t.gallery.uploadModal.title}
            </h3>
            <p className="text-sm font-body text-navy/70 text-center mb-6">
              {t.gallery.uploadModal.desc}
            </p>
            
            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div className="bg-beige/40 p-4 rounded-2xl border-2 border-dashed border-skyblue/50 text-center">
                <input 
                  type="file" 
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={handleFileChange}
                  className="w-full text-sm font-body file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-palepink file:text-navy hover:file:bg-azalea hover:file:text-white cursor-pointer"
                />
              </div>

              <input 
                type="text" 
                placeholder={t.gallery.uploadModal.namePlaceholder}
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                className="w-full p-3 font-body rounded-xl border-2 border-gray-100 bg-beige/30 focus:border-skyblue outline-none transition-colors"
              />
              
              <button 
                type="submit" 
                disabled={isUploading}
                className="w-full font-heading bg-skyblue text-navy font-bold py-3.5 rounded-xl hover:bg-azalea hover:text-white transition-all duration-300 disabled:opacity-50 hover:-translate-y-1 shadow-sm"
              >
                {isUploading ? t.gallery.uploadModal.uploading : t.gallery.uploadModal.submitBtn}
              </button>
            </form>

            {uploadMessage.text && (
              <div className={`mt-5 p-3 rounded-xl text-center font-bold font-body text-sm ${
                uploadMessage.type === 'success' ? 'bg-green-100 text-green-700' : 
                uploadMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {uploadMessage.text}
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}} />
    </div>
  );
}