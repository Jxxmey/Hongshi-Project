import { useState, useEffect } from 'react';

export default function ProtectedImage({ apiEndpoint, altText }) {
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    // ดึงรูปผ่าน Fetch API แทนการใส่ URL ตรงๆ
    fetch(apiEndpoint)
      .then((response) => response.blob())
      .then((blob) => {
        const objectUrl = URL.createObjectURL(blob);
        setImgUrl(objectUrl);
      })
      .catch((err) => console.error("Error loading image", err));

    return () => {
      if (imgUrl) URL.revokeObjectURL(imgUrl);
    };
  }, [apiEndpoint]);

  return (
    <div className="relative inline-block select-none" onContextMenu={(e) => e.preventDefault()}>
      {imgUrl ? (
        <img
          src={imgUrl}
          alt={altText}
          className="pointer-events-none w-full h-auto object-cover rounded-xl shadow-lg"
          draggable="false"
        />
      ) : (
        <div className="w-full h-64 bg-gray-200 animate-pulse rounded-xl flex items-center justify-center text-navy font-body">
          กำลังโหลดภาพหล่อๆ...
        </div>
      )}
      {/* เลเยอร์ใสทับรูป ป้องกันการกดค้างบนมือถือ */}
      <div className="absolute inset-0 z-10 bg-transparent"></div>
    </div>
  );
}