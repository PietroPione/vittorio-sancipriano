"use client";
import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface SubItem {
  immagine_o_testo?: "img" | "txt" | "";
  immagine?: {
    url?: string;
    alt?: string;
    width?: number;
    height?: number;
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

  const renderSubItem = (sub: SubItem, idx: number) => {
    const leftImg = sub.left ? parseFloat(sub.left) : 0;
    const topImg = sub.top ? parseFloat(sub.top) : 50;
    const largImg = sub.larghezza ? parseFloat(sub.larghezza) : 30;

    const leftTxt = sub.left ? parseFloat(sub.left) : 0;
    const topTxt = sub.top ? parseFloat(sub.top) : 12.5;
    const largTxt = sub.larghezza ? parseFloat(sub.larghezza) : 100;

    if (sub.immagine_o_testo === "img" && sub.immagine && sub.immagine.url) {
      const { url, alt, width, height } = sub.immagine;

      if (!url || !width || !height) return null;

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
            className="relative"
            onClick={() => onImageClick(url)}
          >
            <Image
              src={url}
              alt={alt || "Project image"}
              width={width}
              height={height}
              sizes={`${largImg}vw`}
              style={{ width: '100%', height: 'auto' }}
              className="select-none"
              priority
            />
          </div>
        );
      } else {
        return (
          <div
            key={`img-${idx}`}
            style={containerStyle}
            className="absolute"
            onClick={() => onImageClick(url)}
          >
            <Image
              src={url}
              alt={alt || "Project image"}
              width={width}
              height={height}
              sizes={`${largImg}vw`}
              className="object-contain"
              style={{ width: '100%', height: 'auto' }}
              priority={idx < 2}
              onLoad={() => {
                if (containerRef.current) {
                  const rect = (containerRef.current as HTMLElement).getBoundingClientRect();
                  setHeight(Math.max(height, rect.height));
                }
              }}
            />
          </div>
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
          <div
            key={`txt-${idx}`}
            style={style}
            className="absolute"
            dangerouslySetInnerHTML={{ __html: sub.testo || "" }}
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