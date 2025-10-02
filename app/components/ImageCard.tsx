import React from 'react';

interface ImageCardProps {
  src?: string;
  alt?: string;
}

const ImageCard: React.FC<ImageCardProps> = ({ src, alt }) => {
  if (!src) {
    return null;
  }

  return (
    <div className="image-card">
      <img src={src} alt={alt || 'Image'} className="w-full h-auto rounded" />
    </div>
  );
};

export default ImageCard;