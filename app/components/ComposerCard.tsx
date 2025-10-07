"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

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
  onImageClick: (src: string) => void;
  isPreview?: boolean;
}

const ComposerCard: React.FC<ComposerCardProps> = ({ item, onImageClick, isPreview = false }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(800);

  if (!item) return null;

  const subItemsRaw = [
    item.immagine_1,
    item.immagine_2,
    item.immagine_3,
  ].filter(Boolean) as SubItem[];

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 1.2, ease: "easeOut" },
    },
  };

  const renderSubItem = (sub: SubItem, idx: number) => {
    const leftImg = sub.left ? parseFloat(sub.left) : 0;
    const topImg = sub.top ? parseFloat(sub.top) : 50;
    const largImg = sub.larghezza ? parseFloat(sub.larghezza) : 30;

    const leftTxt = sub.left ? parseFloat(sub.left) : 0;
    const topTxt = sub.top ? parseFloat(sub.top) : 12.5;
    const largTxt = sub.larghezza ? parseFloat(sub.larghezza) : 100;

    if (sub.immagine_o_testo === "img" && sub.immagine?.url) {
      const url = sub.immagine.url;
      const alt = sub.immagine.alt || "Project image";

      const containerStyle: React.CSSProperties = {
        position: "absolute",
        left: `${leftImg}%`,
        top: `${topImg}%`,
        width: `${largImg}%`,
        transform: `translateY(-50%)`,
        cursor: "pointer",
      };

      if (isPreview) {
        return (
          <div
            key={`img-${idx}`}
            style={containerStyle}
            className="relative aspect-auto"
          >
            <img
              src={url}
              alt={alt}
              style={{ width: '100%', height: 'auto' }}
              className="select-none"
              onClick={() => onImageClick(url)}
            />
          </div>
        );
      } else {
        return (
          <motion.img
            key={`img-${idx}`}
            src={url}
            alt={alt}
            style={containerStyle}
            className="absolute object-contain"
            onClick={() => onImageClick(url)}
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
    }

    if (sub.immagine_o_testo === "txt" && sub.testo) {
      const style: React.CSSProperties = {
        position: "absolute",
        left: `${leftTxt}%`,
        top: `${topTxt}%`,
        width: `${largTxt}%`,
        transform: "translateY(-50%)",
        color: 'var(--foreground)',
      };

      if (isPreview) {
        return (
          <div
            key={`txt-${idx}`}
            style={style}
            className="absolute"
            dangerouslySetInnerHTML={{ __html: sub.testo || "" }}
          />
        );
      } else {
        return (
          <motion.div
            key={`txt-${idx}`}
            style={style}
            className="absolute"
            dangerouslySetInnerHTML={{ __html: sub.testo || "" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={itemVariants}
          />
        );
      }
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
    </div>
  );
};

export default ComposerCard;