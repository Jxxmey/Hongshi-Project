import { useState, useEffect, useRef, useCallback } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import ImageSkeleton from '../components/ImageSkeleton';
import SkeletonBox from '../components/ImageSkeleton'; 
import { useLanguage } from '../contexts/LanguageContext';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const ITEMS_PER_PAGE = 12;

export default function Gallery() {
  const { t } = useLanguage();
  
  const [allPhotos, setAllPhotos] = useState([]);
  const [displayedPhotos, setDisplayedPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

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
          setAllPhotos(data);
          setDisplayedPhotos(data.slice(0, ITEMS_PER_PAGE));
          setHasMore(data.length > ITEMS_PER_PAGE);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (page === 1) return;
    const nextPhotos = allPhotos.slice(0, page * ITEMS_PER_PAGE);
    setDisplayedPhotos(nextPhotos);
    
    if (nextPhotos.length >= allPhotos.length) {
      setHasMore(false);
    }
  }, [page, allPhotos]);

  const observer = useRef();
  const lastPhotoElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

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

  // สร้างลูกเล่นเอียงและขยับขึ้นลงแบบสุ่มให้ดูเป็นธรรมชาติ (ไม่ใช้การดึง row-span แล้ว)
  const getGridClass = (index) => {
    const rotations = ['-rotate-2', 'rotate-3', '-rotate-3', 'rotate-2', '-rotate-4', 'rotate-1'];
    // ขยับขึ้นลงนิดหน่อยเพื่อให้ดูไม่เรียงกันเป๊ะเกินไป
    const translates = ['translate-y-0', 'translate-y-4 md:translate-y-8', '-translate-y-2', 'translate-y-2 md:translate-y-6', '-translate-y-4', 'translate-y-0'];
    
    const rot = rotations[index % rotations.length];
    const trans = translates[index % translates.length];
    
    return `${rot} ${trans}`;
  };

  return (
    <div className="py-12 px-4 max-w-6xl mx-auto space-y-12 pb-20 overflow-hidden">
      
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

      {/* Grid Layout */}
      {loading ? (
        // Grid ตอนโหลด: ปรับให้เว้นระยะ x, y แยกกัน
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-10 md:gap-y-16 mt-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 sm:p-6 w-full aspect-[5/4]">
              <SkeletonBox className={`rounded-2xl w-full h-full ${getGridClass(i)}`} />
            </div>
          ))}
        </div>
      ) : allPhotos.length === 0 ? (
        <div className="text-center font-body text-navy/60 bg-white p-10 rounded-3xl shadow-sm border-2 border-dashed border-palepink mt-8">
          {t.gallery.empty}
        </div>
      ) : (
        <>
          {/* ลบ auto-rows ออก เพื่อให้ความสูงเป็นไปตามภาพ และปรับ gap-y ให้กว้างพอไม่ให้ของตกแต่งทับกัน */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 md:gap-x-12 md:gap-y-20 mt-8 px-2 md:px-4">
            {displayedPhotos.map((photo, index) => {
              const isLastPhoto = displayedPhotos.length === index + 1;
              
              return (
                <div 
                  key={photo._id || index} 
                  ref={isLastPhoto ? lastPhotoElementRef : null} 
                  // สร้างพื้นที่ Padding (p-4 md:p-8) กันชนให้ของตกแต่งอยู่ในกรอบ
                  className={`relative w-full p-4 md:p-8 transition-all duration-500 hover:rotate-0 hover:z-50 hover:scale-[1.02] ${getGridClass(index)}`}
                >
                  <ScrollReveal delay={(index % 10) * 50} className="w-full">
                    
                    <div className="frame-layout w-full group">
                      
                      {/* ของตกแต่ง ปรับขนาดในมือถือให้เล็กลงมาก (scale-[0.6]) เพื่อไม่ให้ซ้อนกัน */}
                      <span className="sparkle sparkle-one" aria-hidden="true">✦</span> 
                      <span className="sparkle sparkle-two" aria-hidden="true">✦</span>
                      <div className="dessert-sticker ice-cream ice-left scale-[0.6] sm:scale-75 md:scale-90 origin-bottom-right" aria-hidden="true">
                        <span className="cherry"></span> <span className="scoop pink"></span> <span className="cone"></span>
                      </div>
                      <div className="dessert-sticker ice-cream ice-right scale-[0.6] sm:scale-75 md:scale-90 origin-bottom-left" aria-hidden="true">
                        <span className="cherry"></span> <span className="scoop blue"></span> <span className="cone"></span>
                      </div>
                      <span className="dessert-sticker cake-slice scale-[0.65] sm:scale-75 md:scale-90 origin-bottom-left" aria-hidden="true"></span>
                      
                      {/* ตัวกรอบหลัก */}
                      <article className="cake-frame bg-paper w-full flex flex-col cursor-pointer shadow-lg" onClick={() => setSelectedImage(photo)}>
                        <div className="photo-window relative w-full">
                          
                          <ImageSkeleton
                            src={photo.imageUrl}
                            alt={`Uploaded by ${photo.uploaderName}`}
                            containerClassName="absolute inset-0 w-full h-full"
                            imageClassName="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onContextMenu={(e) => e.preventDefault()}
                            onDragStart={(e) => e.preventDefault()}
                          />

                          <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-navy/90 via-navy/50 to-transparent p-4 md:p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <p className="text-white text-sm md:text-base font-bold font-body truncate drop-shadow-md">
                              From {photo.uploaderName}
                            </p>
                          </div>

                        </div>
                      </article>

                    </div>

                  </ScrollReveal>
                </div>
              );
            })}
          </div>
          
          {hasMore && (
            <div className="flex justify-center mt-12 mb-8">
              <div className="w-8 h-8 border-4 border-skyblue border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
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
            >✕</button>
            <div 
              className="w-full h-full overflow-hidden rounded-2xl md:rounded-[30px] border-4 border-white shadow-2xl relative select-none"
              style={{ WebkitTouchCallout: 'none', userSelect: 'none' }}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            >
              <div className="absolute inset-0 z-10 bg-transparent"></div>
              <ImageSkeleton 
                src={selectedImage.imageUrl} 
                alt="Selected"
                containerClassName="w-full h-full bg-black/50"
                imageClassName="max-h-[85vh] object-contain"
              />
            </div>
            <p className="text-white mt-4 font-body font-bold bg-navy/50 px-5 py-2 rounded-full border border-white/20">
              From {selectedImage.uploaderName}
            </p>
          </div>
        </div>
      )}

      {/* Upload Modal (ย่อไว้) */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-8 rounded-[30px] w-full max-w-md shadow-2xl relative border-t-8 border-skyblue">
            <button 
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 text-navy/50 hover:text-azalea bg-gray-100 hover:bg-palepink w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            >✕</button>
            <h3 className="text-2xl font-heading font-bold text-navy mb-2 text-center">{t.gallery.uploadModal.title}</h3>
            <p className="text-sm font-body text-navy/70 text-center mb-6">{t.gallery.uploadModal.desc}</p>
            <form onSubmit={handleUploadSubmit} className="space-y-5">
              <div className="bg-beige/40 p-4 rounded-2xl border-2 border-dashed border-skyblue/50 text-center">
                <input 
                  type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange}
                  className="w-full text-sm font-body file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-palepink file:text-navy hover:file:bg-azalea hover:file:text-white cursor-pointer"
                />
              </div>
              <input 
                type="text" placeholder={t.gallery.uploadModal.namePlaceholder} value={uploaderName} onChange={(e) => setUploaderName(e.target.value)}
                className="w-full p-3 font-body rounded-xl border-2 border-gray-100 bg-beige/30 focus:border-skyblue outline-none transition-colors"
              />
              <button 
                type="submit" disabled={isUploading}
                className="w-full font-heading bg-skyblue text-navy font-bold py-3.5 rounded-xl hover:bg-azalea hover:text-white transition-all duration-300 disabled:opacity-50 hover:-translate-y-1 shadow-sm"
              >
                {isUploading ? t.gallery.uploadModal.uploading : t.gallery.uploadModal.submitBtn}
              </button>
            </form>
            {uploadMessage.text && (
              <div className={`mt-5 p-3 rounded-xl text-center font-bold font-body text-sm ${uploadMessage.type === 'success' ? 'bg-green-100 text-green-700' : uploadMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {uploadMessage.text}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CSS กรอบรูป --- */}
      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --ink: #234f82;
          --navy: #173d67;
          --cream: #fff7e9;
          --paper: #fffdf9;
          --pink: #f7adc0;
          --berry: #ed789b;
          --blue: #b9dcef;
          --mint: #c6e3cc;
          --yellow: #ffd77b;
          --choco: #a8664c;
        }

        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .frame-layout {
          position: relative;
          isolation: isolate;
        }

        .cake-frame {
          position: relative;
          padding: clamp(.5rem, 1.5vw, 1rem); 
          border: 4px solid var(--navy);
          border-radius: 1.5rem; 
          box-shadow: 6px 8px 0 var(--navy), 0 10px 20px rgba(23, 61, 103, .13);
          background-color: var(--paper);
        }

        .photo-window {
          position: relative;
          overflow: hidden;
          aspect-ratio: 5 / 4; /* ล็อคสัดส่วนให้ภาพสมดุล */
          border: 6px solid var(--yellow);
          border-radius: 1rem;
          background: #f8c4d0;
          box-shadow: inset 0 0 0 2px rgba(255,255,255,.8);
        }

        .dessert-sticker {
          position: absolute;
          z-index: 7;
          animation: floaty 3.9s ease-in-out infinite;
          pointer-events: none; 
        }

        .ice-cream {
          width: 5.5rem;
          height: 7.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          filter: drop-shadow(4px 4px 0 rgba(23,61,103,.16));
        }

        .ice-left { left: -1.5rem; top: 10%; transform: rotate(-13deg); }
        .ice-right { right: -1.5rem; bottom: 10%; transform: rotate(13deg); animation-delay: .55s; }

        .cherry {
          width: 1.15rem;
          height: 1.15rem;
          margin-bottom: -.15rem;
          border: 2px solid var(--navy);
          border-radius: 50%;
          background: var(--berry);
          position: relative;
          z-index: 3;
        }

        .cherry::before {
          content: "";
          width: 1.35rem;
          height: 1.3rem;
          position: absolute;
          left: .5rem;
          bottom: .65rem;
          border-left: 2px solid var(--navy);
          border-radius: 70%;
          transform: rotate(-34deg);
        }

        .scoop {
          width: 4.65rem;
          height: 3.8rem;
          margin-bottom: -.75rem;
          border: 2px solid var(--navy);
          border-radius: 50% 50% 42% 42%;
          z-index: 2;
        }

        .scoop.pink { background: var(--pink); }
        .scoop.blue { background: var(--blue); }

        .cone {
          width: 3.5rem;
          height: 4.1rem;
          border: 2px solid var(--navy);
          background:
            repeating-linear-gradient(45deg, transparent 0 8px, rgba(112,69,40,.26) 8px 10px),
            repeating-linear-gradient(-45deg, transparent 0 8px, rgba(112,69,40,.21) 8px 10px),
            #eab778;
          clip-path: polygon(5% 0, 95% 0, 50% 100%);
        }

        .cake-slice {
          left: -1.5rem;
          bottom: 5%;
          width: 5.25rem;
          height: 4.8rem;
          border: 2px solid var(--navy);
          border-radius: .8rem 1.25rem .8rem .8rem;
          background: linear-gradient(to bottom, #fff7e9 0 20%, #f7adc0 20% 45%, #f3c772 45% 100%);
          box-shadow: 4px 4px 0 rgba(23,61,103,.16);
          transform: rotate(-11deg);
          animation-delay: .2s;
        }

        .cake-slice::before {
          content: "";
          width: 1.25rem;
          height: 1.25rem;
          position: absolute;
          right: .55rem;
          top: -.9rem;
          border: 2px solid var(--navy);
          border-radius: 50%;
          background: var(--berry);
        }

        .cake-slice::after {
          content: "";
          width: 2.9rem;
          height: .34rem;
          position: absolute;
          left: .85rem;
          bottom: 1.3rem;
          border-radius: 999px;
          background: #fff8ed;
        }

        .sparkle {
          position: absolute;
          z-index: 5;
          width: 1.55rem;
          height: 1.55rem;
          color: var(--berry);
          animation: twinkle 2.5s ease-in-out infinite;
          pointer-events: none;
        }

        .sparkle-one { top: -.35rem; right: 1.4rem; }
        .sparkle-two { bottom: -.45rem; left: 1.2rem; color: #65a6cf; animation-delay: .65s; }

        @keyframes floaty {
          0%, 100% { margin-top: 0; }
          50% { margin-top: -8px; }
        }

        @keyframes twinkle {
          0%, 100% { opacity: .55; transform: scale(.84) rotate(0); }
          50% { opacity: 1; transform: scale(1.1) rotate(15deg); }
        }
      `}} />
    </div>
  );
}