import { useState, useEffect, useRef, useCallback } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import ImageSkeleton from '../components/ImageSkeleton';
import SkeletonBox from '../components/ImageSkeleton'; 
import { useLanguage } from '../contexts/LanguageContext';
import Cropper from 'react-easy-crop'; 
import ReCAPTCHA from 'react-google-recaptcha';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const ITEMS_PER_PAGE = 14; 

export default function Gallery() {
  const { t } = useLanguage();
  
  const [displayedPhotos, setDisplayedPhotos] = useState([]);
  const [skip, setSkip] = useState(0); 
  const [hasMore, setHasMore] = useState(true);

  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploaderName, setUploaderName] = useState('');
  const [isConsentGiven, setIsConsentGiven] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: '', type: '' });

  const [uploadFile, setUploadFile] = useState(null); 
  const [originalFile, setOriginalFile] = useState(null); 
  
  const [imageSrc, setImageSrc] = useState(null); 
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isCropping, setIsCropping] = useState(false); 

  const recaptchaRef = useRef();

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${API_URL}/gallery?skip=${skip}&limit=${ITEMS_PER_PAGE}`);
        if (response.ok) {
          const data = await response.json();
          
          const items = data.items || (Array.isArray(data) ? data : []);
          const totalCount = data.total !== undefined ? data.total : items.length;

          setDisplayedPhotos(prev => skip === 0 ? items : [...prev, ...items]);
          setHasMore(skip + ITEMS_PER_PAGE < totalCount);
        }
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [skip]);

  const observer = useRef();
  const lastPhotoElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setSkip(prevSkip => prevSkip + ITEMS_PER_PAGE);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setOriginalFile(file); 
      
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result);
        setIsCropping(true); 
      });
      reader.readAsDataURL(file);
    }
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const image = new Image();
      image.src = imageSrc;
      await new Promise((resolve) => (image.onload = resolve));

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      canvas.toBlob((blob) => {
        const file = new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' });
        setUploadFile(file); 
        setIsCropping(false); 
      }, 'image/jpeg', 0.9);
    } catch (e) {
      console.error("Crop error:", e);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadMessage({ text: t.gallery.uploadModal?.noFile || 'กรุณาเลือกรูปภาพ', type: 'error' });
      return;
    }

    const captchaToken = recaptchaRef.current?.getValue();
    if (!captchaToken) {
      setUploadMessage({ text: 'กรุณายืนยันว่าคุณไม่ใช่บอท', type: 'error' });
      return;
    }

    setIsUploading(true);
    setUploadMessage({ text: t.gallery.uploadModal?.uploading || 'กำลังอัปโหลด...', type: 'info' });

    const formData = new FormData();
    formData.append('image', uploadFile); 
    formData.append('originalImage', originalFile); 
    formData.append('uploaderName', uploaderName || 'Anonymous LYKYOU');
    formData.append('recaptchaToken', captchaToken); 
    formData.append('isConsentGiven', isConsentGiven);

    try {
      const response = await fetch(`${API_URL}/gallery/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('คุณอัปโหลดบ่อยเกินไป กรุณารอสักครู่');
        }
        throw new Error('Upload Failed');
      }

      setUploadMessage({ text: t.gallery.uploadModal?.success || 'อัปโหลดสำเร็จ รอแอดมินตรวจสอบครับ!', type: 'success' });
      
      setTimeout(() => {
        closeUploadModal();
      }, 3000);
    } catch (error) {
      console.error(error);
      setUploadMessage({ text: error.message || t.gallery.uploadModal?.error || 'เกิดข้อผิดพลาด', type: 'error' });
      recaptchaRef.current?.reset();
    } finally {
      setIsUploading(false);
    }
  };

  const closeUploadModal = () => {
    setIsUploadOpen(false);
    setUploadFile(null);
    setOriginalFile(null); 
    setImageSrc(null);
    setIsCropping(false);
    setUploaderName('');
    setUploadMessage({ text: '', type: '' });
    setIsConsentGiven(false);
    if (recaptchaRef.current) recaptchaRef.current.reset();
  };

  // เอา md: ออก เพื่อให้ทุกขนาดหน้าจอใช้แพทเทิร์น 14 รูปนี้เหมือนกัน
  const getGridClass = (index) => {
    const pattern = [
      'col-span-6 row-span-4', 
      'col-span-3 row-span-4', 
      'col-span-3 row-span-4', 
      'col-span-3 row-span-3', 
      'col-span-6 row-span-6', 
      'col-span-3 row-span-3', 
      'col-span-3 row-span-3', 
      'col-span-3 row-span-3', 
      'col-span-3 row-span-4', 
      'col-span-3 row-span-4', 
      'col-span-6 row-span-4', 
      'col-span-4 row-span-3', 
      'col-span-4 row-span-3', 
      'col-span-4 row-span-3', 
    ];
    return pattern[index % pattern.length];
  };

  const getFrameClass = (index) => {
    return index % 2 === 0 ? 'frame-navy' : 'frame-white';
  };

  return (
    <div className="gallery-shell py-12 px-4 max-w-[1280px] mx-auto pb-20">
      
      <ScrollReveal>
        <div className="text-center space-y-6 mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-navy drop-shadow-sm tracking-tight">
            {t.gallery.title}
          </h2>
          <p className="text-lg font-body text-navy/80 bg-white/60 inline-block px-6 py-2 rounded-full shadow-sm backdrop-blur-sm">
            {t.gallery.subtitle}
          </p>
          
          <div>
            <button 
              onClick={() => setIsUploadOpen(true)}
              className="mt-4 font-heading font-bold text-base md:text-lg px-8 py-3 rounded-full shadow-md transition-all duration-300 bg-[var(--ink)] text-[var(--paper)] hover:bg-opacity-90 hover:-translate-y-1"
            >
              + {t.gallery.uploadBtn}
            </button>
          </div>
        </div>
      </ScrollReveal>

      {/* ปรับ grid-cols-12 ให้ทำงานตั้งแต่หน้าจอมือถือ และใช้ auto-rows-[8vw] จัดความสูง */}
      {loading && displayedPhotos.length === 0 ? (
        <section className="grid grid-cols-12 auto-rows-[8vw] sm:auto-rows-[6vw] md:auto-rows-[60px] lg:auto-rows-[70px] grid-flow-dense gap-2 md:gap-4 mt-8 px-1 md:px-4" aria-label="กำลังโหลดแกลลอรี่ภาพ">
          {[...Array(14)].map((_, i) => (
            <div key={i} className={`w-full h-full ${getGridClass(i)}`}>
              <div className="art-card">
                <div className={`frame ${getFrameClass(i)}`}>
                  <SkeletonBox className="w-full h-full" />
                </div>
              </div>
            </div>
          ))}
        </section>
      ) : displayedPhotos.length === 0 ? (
        <div className="text-center font-body text-[var(--ink)]/60 bg-white p-10 rounded-3xl shadow-sm border-2 border-dashed border-[var(--ink)]/20 mt-8">
          {t.gallery.empty}
        </div>
      ) : (
        <>
          <section className="grid grid-cols-12 auto-rows-[8vw] sm:auto-rows-[6vw] md:auto-rows-[60px] xl:auto-rows-[75px] grid-flow-dense gap-2 md:gap-4 mt-8 px-1 md:px-4" aria-label="แกลลอรี่ภาพงานศิลปะ">
            {displayedPhotos.map((photo, index) => {
              const isLastPhoto = displayedPhotos.length === index + 1;

              return (
                <button 
                  key={photo._id || index}
                  type="button" 
                  ref={isLastPhoto ? lastPhotoElementRef : null}
                  className={`art-card group ${getGridClass(index)}`} 
                  onClick={() => setSelectedImage(photo)}
                  aria-label={`เลือกผลงานจาก ${photo.uploaderName}`}
                >
                  <ScrollReveal delay={(index % 14) * 30} className="w-full h-full">
                    <div className={`frame ${getFrameClass(index)}`}>
                      <div className="art-image-container relative w-full h-full overflow-hidden">
                        <ImageSkeleton
                          src={photo.imageUrl}
                          alt={`Uploaded by ${photo.uploaderName}`}
                          containerClassName="absolute inset-0 w-full h-full bg-[#f0f4f8]"
                          imageClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onContextMenu={(e) => e.preventDefault()}
                          onDragStart={(e) => e.preventDefault()}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-end p-2 md:p-4">
                          <p className="text-[var(--paper)] text-[10px] md:text-sm font-bold font-body truncate drop-shadow-md">
                            From {photo.uploaderName}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ScrollReveal>
                </button>
              );
            })}
          </section>
          
          {hasMore && (
            <div className="flex justify-center mt-16 mb-8">
              <div className="w-8 h-8 border-4 border-[var(--ink)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--ink)]/95 backdrop-blur-md animate-fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedImage(null)} className="absolute -top-12 right-0 md:-right-12 text-[var(--paper)] hover:text-white bg-white/20 hover:bg-white/40 w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all z-20">✕</button>
            <div className="w-full h-full overflow-hidden rounded-[8px] md:rounded-[12px] border-8 border-white shadow-2xl relative select-none bg-white">
              <div className="absolute inset-0 z-10 bg-transparent"></div>
              <ImageSkeleton src={selectedImage.originalImageUrl || selectedImage.imageUrl} alt="Selected" containerClassName="w-full h-full bg-gray-100" imageClassName="max-h-[85vh] w-full object-contain"/>
            </div>
            <p className="text-white mt-4 font-body font-bold px-6 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">From {selectedImage.uploaderName}</p>
          </div>
        </div>
      )}

      {isUploadOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[var(--ink)]/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-white p-6 md:p-8 rounded-[24px] w-full max-w-md shadow-2xl relative border-t-8 border-[var(--ink)] flex flex-col max-h-[90vh]">
            <button 
              onClick={closeUploadModal}
              className="absolute top-4 right-4 text-navy/50 hover:text-[var(--ink)] bg-gray-100 hover:bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20"
            >✕</button>
            
            <h3 className="text-2xl font-heading font-bold text-navy mb-2 text-center">
              {isCropping ? "จัดตำแหน่งรูปภาพ" : t.gallery.uploadModal?.title || "อัปโหลดรูปภาพ"}
            </h3>
            
            {isCropping ? (
              <div className="flex-1 flex flex-col min-h-[300px]">
                <p className="text-sm font-body text-navy/70 text-center mb-4">จัดตำแหน่งให้อยู่ตรงกลาง</p>
                <div className="relative w-full flex-1 bg-gray-900 rounded-xl overflow-hidden mb-4 min-h-[300px]">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1} 
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                  />
                </div>
                <input 
                  type="range" min={1} max={3} step={0.1} value={zoom} 
                  onChange={(e) => setZoom(e.target.value)} 
                  className="w-full mb-4 accent-[var(--ink)]" 
                />
                <button 
                  onClick={createCroppedImage} 
                  className="w-full font-heading bg-[var(--ink)] text-white font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all shadow-sm"
                >
                  ยืนยันการตัดรูป
                </button>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit} className="space-y-5 overflow-y-auto">
                <p className="text-sm font-body text-navy/70 text-center mb-4">{t.gallery.uploadModal?.desc || "ร่วมแชร์ความทรงจำดีๆ ด้วยกัน"}</p>
                
                {uploadFile ? (
                  <div className="relative w-full aspect-square rounded-xl overflow-hidden border-4 border-[var(--ink)] shadow-inner mb-4 max-w-[200px] mx-auto">
                    <img src={URL.createObjectURL(uploadFile)} alt="Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" onClick={() => {setUploadFile(null); setOriginalFile(null); setImageSrc(null);}} 
                      className="absolute top-2 right-2 bg-black/70 text-white text-xs px-3 py-1 rounded-full hover:bg-red-500"
                    >เปลี่ยนรูป</button>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-[var(--ink)]/30 text-center hover:bg-gray-100 transition">
                    <input 
                      type="file" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange}
                      className="w-full text-sm font-body file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-[var(--ink)] file:text-white hover:file:bg-opacity-90 cursor-pointer"
                    />
                  </div>
                )}

                <input 
                  type="text" placeholder={t.gallery.uploadModal?.namePlaceholder || "ชื่อของคุณ"} value={uploaderName} onChange={(e) => setUploaderName(e.target.value)}
                  className="w-full p-3 font-body rounded-xl border-2 border-gray-200 bg-white focus:border-[var(--ink)] outline-none transition-colors"
                />

                <div className="flex items-start space-x-3 my-4 p-3 bg-gray-50 rounded-xl border border-gray-200">
                  <input 
                    type="checkbox" 
                    id="consentCheck" 
                    checked={isConsentGiven}
                    onChange={(e) => setIsConsentGiven(e.target.checked)}
                    className="mt-1 w-5 h-5 text-[var(--ink)] bg-white border-gray-300 rounded focus:ring-[var(--ink)] accent-[var(--ink)] cursor-pointer"
                  />
                  <label htmlFor="consentCheck" className="text-sm font-body text-navy/80 cursor-pointer select-none">
                    {t.gallery.uploadModal?.consent || "ฉันอนุญาตให้นำรูปภาพและข้อความนี้ไปใช้ประกอบคลิปโปรเจกต์วันเกิด หรือกิจกรรมอื่นๆ ที่เกี่ยวข้องกับโปรเจกต์ได้"}
                  </label>
                </div>

                <div className="flex justify-center my-2">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                  />
                </div>

                <button 
                  type="submit" disabled={isUploading || !uploadFile}
                  className="w-full font-heading bg-[var(--ink)] text-white font-bold py-3.5 rounded-xl transition-all duration-300 disabled:opacity-50 hover:-translate-y-1 shadow-sm"
                >
                  {isUploading ? (t.gallery.uploadModal?.uploading || "กำลังอัปโหลด...") : (t.gallery.uploadModal?.submitBtn || "ส่งรูปภาพ")}
                </button>
              </form>
            )}
            
            {uploadMessage.text && (
              <div className={`mt-5 p-3 rounded-xl text-center font-bold font-body text-sm ${uploadMessage.type === 'success' ? 'bg-green-100 text-green-700' : uploadMessage.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                {uploadMessage.text}
              </div>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        :root {
          --ink: #17324d;
          --paper: #fffaf5;
          --line: #c9dceb;
        }

        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .art-card {
          appearance: none;
          width: 100%;
          height: 100%;
          display: block;
          position: relative;
          text-align: left;
          border: 0;
          padding: 0;
          cursor: pointer;
          background: transparent;
          transition: transform .28s ease;
        }

        .art-card:hover { transform: translateY(-4px); }

        .frame {
          width: 100%;
          height: 100%;
          transition: box-shadow .28s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .frame-navy {
          background: var(--ink);
          padding: clamp(6px, 1.2vw, 12px); 
          box-shadow: 0 6px 16px rgba(23, 50, 77, .15);
        }

        .frame-white {
          background: #ffffff;
          padding: clamp(6px, 1.2vw, 12px);
          border: 1px solid var(--line);
          box-shadow: 0 6px 16px rgba(0, 0, 0, .05);
        }

        .art-card:hover .frame {
          box-shadow: 0 16px 28px rgba(23, 50, 77, .25);
        }
      `}} />
    </div>
  );
}