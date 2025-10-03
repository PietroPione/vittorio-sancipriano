"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface FullScreenSliderProps {
  images: { src: string; alt: string }[];
  initialIndex?: number;
  onClose: () => void;
}

const FullScreenSlider: React.FC<FullScreenSliderProps> = ({ images, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [theme, setTheme] = useState<'primary' | 'secondary'>('primary');

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const toggleTheme = () => {
    setTheme(theme === 'primary' ? 'secondary' : 'primary');
  };

  const currentImage = images[currentIndex];
  const bgColor = theme === 'primary' ? 'bg-primary' : 'bg-secondary';
  const textColor = theme === 'primary' ? 'text-secondary' : 'text-primary';

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-colors duration-300 ${bgColor} ${textColor}`}
    >
      {/* Top bar with close button */}
      <div className="absolute top-0 right-0 p-4 md:p-6 z-10">
        <button
          onClick={onClose}
          className="p-2 transition-transform duration-200 hover:scale-110"
          aria-label="Close slider"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Main content: Image and navigation */}
      <div className="relative w-full h-full flex items-center justify-between px-4 md:px-8">
        {/* Previous Button */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-lg tracking-widest uppercase p-2 transition-transform duration-200 hover:-translate-x-1"
          aria-label="Previous image"
        >
          Previous
        </button>

        {/* Image Display */}
        <div className="relative w-full h-[80vh] max-w-screen-lg mx-auto">
          {currentImage && (
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              style={{ objectFit: 'contain' }}
              className="select-none"
              priority
            />
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-lg tracking-widest uppercase p-2 transition-transform duration-200 hover:translate-x-1"
          aria-label="Next image"
        >
          Next
        </button>
      </div>

      {/* Bottom bar with counter and theme toggle */}
      <div className="absolute bottom-0 left-0 right-0 w-full p-4 md:p-6 flex justify-between items-center z-10">
        <div className="text-lg font-mono">
          {currentIndex + 1} / {images.length}
        </div>
        <button
          onClick={toggleTheme}
          className="p-2 transition-transform duration-200 hover:scale-110"
          aria-label="Toggle theme"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default FullScreenSlider;