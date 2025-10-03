"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import FullScreenSlider from "./FullScreenSlider";

interface SubItem {
  immagine_o_testo?: "img" | "txt" | "";
  immagine?: {
    url?: string;
    alt?: string;
  } | false;
  testo?: string;
  left?: string;
  top?: string;
  larghezza?: string;
}

interface ComposerItem {
  immagine_1?: SubItem;
  immagine_2?: SubItem;
  immagine_3?: SubItem;
  [key: string]: any;
}

interface ComposerCardProps {
  item: ComposerItem;
}

const ComposerCard: React.FC<ComposerCardProps> = ({ item }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(800);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!item) return null;

  const subItemsRaw = [
    item.immagine_1,
    item.immagine_2,
    item.immagine_3,
  ].filter(Boolean) as SubItem[];

  const imagesForSlider = subItemsRaw
    .filter(
      (sub) => sub.immagine_o_testo === "img" && sub.immagine && sub.immagine.url
    )
    .map((sub) => ({
      src: sub.immagine!.url!,
      alt: sub.immagine!.alt || "Project image",
    }));

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsSliderOpen(true);
  };

  const handleCloseSlider = () => {
    setIsSliderOpen(false);
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  const renderSubItem = (sub: SubItem, idx: number) => {
    // Valori per IMMAGINE
    const leftImg = sub.left ? parseFloat(sub.left) : 0;
    const topImg = sub.top ? parseFloat(sub.top) : 50;
    const largImg = sub.larghezza ? parseFloat(sub.larghezza) : 30;

    // Valori per TESTO (usiamo i nuovi predefiniti)
    const leftTxt = sub.left ? parseFloat(sub.left) : 0;         // Nuovi default: "0"
    const topTxt = sub.top ? parseFloat(sub.top) : 12.5;       // Nuovi default: "12.5"
    const largTxt = sub.larghezza ? parseFloat(sub.larghezza) : 100; // Nuovi default: "100"

    if (sub.immagine_o_testo === "img" && sub.immagine && sub.immagine.url) {
      const url = sub.immagine.url;
      const alt = sub.immagine.alt || "Project image";

      const style: React.CSSProperties = {
        position: "absolute",
        left: `${leftImg}%`,
        top: `${topImg}%`,
        width: `${largImg}%`,
        transform: `translateY(-50%)`,
        cursor: "pointer",
      };

      const imageIndex = imagesForSlider.findIndex((img) => img.src === url);

      return (
        <motion.img
          key={`img-${idx}`}
          src={url}
          alt={alt}
          style={style}
          className="absolute object-contain"
          onClick={() => handleImageClick(imageIndex)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={itemVariants}
          onLoad={() => {
            if (containerRef.current) {
              const rect = (containerRef.current as HTMLElement).getBoundingClientRect();
              setHeight(Math.max(height, rect.height));
            }
          }}
        />
      );
    }

    if (sub.immagine_o_testo === "txt" && sub.testo) {

      const style: React.CSSProperties = {
        position: "absolute",
        left: `${leftTxt}%`,
        top: `${topTxt}%`,
        width: `${largTxt}%`, // Applicato anche al testo
        transform: "translateY(-50%)",
        // Rimosso 'maxWidth: "40vw"' per rispettare larghezza: "100"
      };

      return (
        <motion.div
          key={`txt-${idx}`}
          style={style}
          className="text-secondary absolute"
          dangerouslySetInnerHTML={{ __html: sub.testo || "" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={itemVariants}
        />
      );
    }

    return null;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-visible"
      style={{ minHeight: `${height}px` }}
    >
      {subItemsRaw.map((s, i) => renderSubItem(s, i))}
      {isSliderOpen && (
        <FullScreenSlider
          images={imagesForSlider}
          initialIndex={selectedImageIndex}
          onClose={handleCloseSlider}
        />
      )}
    </div>
  );
};

export default ComposerCard;