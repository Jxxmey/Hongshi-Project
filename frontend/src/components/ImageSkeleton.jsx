import { useState } from 'react';

export default function ImageSkeleton({ 
  src, 
  alt, 
  containerClassName = '', 
  imageClassName = 'object-cover', 
  children,
  onClick,
  onContextMenu,
  onDragStart,
  onError // +++ รับ props onError เพิ่ม
}) {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div 
      className={`relative overflow-hidden bg-gray-100 ${containerClassName}`}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onDragStart={onDragStart}
    >
      {!imgLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse z-0"></div>
      )}
      
      <img 
        src={src} 
        alt={alt}
        loading="lazy"
        draggable="false"
        onLoad={() => setImgLoaded(true)}
        onError={onError} // +++ ผูก event onError
        className={`w-full h-full transition-opacity duration-700 pointer-events-none ${imageClassName} ${
          imgLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {children}
    </div>
  );
}