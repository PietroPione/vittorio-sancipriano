import React from 'react';
import Image from 'next/image';

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
      <Image
        src={src}
        alt={alt || 'Image'}
        width={800}
        height={600}
        className="w-full h-auto rounded"
        style={{ objectFit: 'contain' }}
      />
    </div>
  );
};

export default ImageCard;