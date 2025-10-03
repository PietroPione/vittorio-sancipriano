"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

interface FullScreenSliderProps {
  images: { src: string; alt: string }[];
  initialIndex?: number;
  onClose: () => void;
}

const FullScreenSlider: React.FC<FullScreenSliderProps> = ({
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev, onClose]);

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">

      <div className="absolute top-0 right-0 p-4 md:p-6 z-10">
        <button
          onClick={onClose}
          className="p-2 transition-transform duration-200 hover:scale-110"
          aria-label="Close slider"
        >
          ✕
        </button>
      </div>

      <div className="relative w-full h-full flex items-center justify-between px-4 md:px-8">

        <button
          onClick={handlePrev}
          className="absolute z-10 left-4 md:left-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-lg tracking-widest uppercase p-4 min-w-[60px] text-center transition-transform duration-200 hover:-translate-x-1"
          aria-label="Previous image"
        >
          Previous
        </button>

        <div className="relative w-full h-[80vh] max-w-screen-lg mx-auto">
          {currentImage && (
            <Image
              src={currentImage.src}
              alt={currentImage.alt}
              fill
              style={{ objectFit: "contain" }}
              className="select-none"
              priority
            />
          )}
        </div>

        <button
          onClick={handleNext}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] text-lg tracking-widest uppercase p-4 min-w-[60px] text-center transition-transform duration-200 hover:translate-x-1"
          aria-label="Next image"
        >
          Next
        </button>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 md:p-6 flex justify-start items-center z-10">
        <div className="text-lg font-mono">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};

export default FullScreenSlider;