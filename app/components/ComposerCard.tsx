"use client";

import React from "react";
import { motion, easeOut } from "framer-motion";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery"; // Importa l'hook

// Interfacce per i dati
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
  select_photo_qty: "1" | "2" | "3";
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

const ComposerCard: React.FC<ComposerCardProps> = ({
  item,
  onImageClick,
  isPreview = false,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)"); // Media query per mobile

  if (!item) return null;

  const subItems: SubItem[] = [
    item.immagine_1,
    item.immagine_2,
    item.immagine_3,
  ].filter(
    (sub): sub is SubItem =>
      !!sub && (sub.immagine_o_testo === "img" || sub.immagine_o_testo === "txt")
  );

  if (subItems.length === 0) {
    return null;
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: easeOut },
    },
  };

  const renderSubItem = (sub: SubItem, idx: number, isMobileLayout: boolean) => {
    const MotionWrapper = isPreview ? "div" : motion.div;
    const motionProps = isPreview
      ? {}
      : {
          initial: "hidden",
          whileInView: "visible",
          viewport: { once: true, amount: 0.2 },
          variants: itemVariants,
        };

    // Render per le immagini
    if (sub.immagine_o_testo === "img" && sub.immagine) {
      const { url, alt, width: imgWidth, height: imgHeight } = sub.immagine;
      if (!url || !imgWidth || !imgHeight) return null;

      const desktopStyle: React.CSSProperties = {
        position: "absolute",
        left: `${sub.left || 0}%`,
        top: `${sub.top || 50}%`,
        width: `${sub.larghezza || 30}%`,
        transform: "translateY(-50%)",
      };

      const mobileStyle: React.CSSProperties = {
        width: "100%", // Le immagini occupano tutta la larghezza su mobile
        marginBottom: "1rem",
      };

      return (
        <MotionWrapper
          key={`img-${idx}`}
          style={isMobileLayout ? mobileStyle : desktopStyle}
          className="cursor-pointer"
          onClick={() => onImageClick(url)}
          {...motionProps}
        >
          <Image
            src={url}
            alt={alt || "Project image"}
            width={imgWidth}
            height={imgHeight}
            sizes={isMobileLayout ? "100vw" : `${sub.larghezza || 30}vw`}
            className="w-full h-auto object-contain select-none"
            priority={idx < 2}
          />
        </MotionWrapper>
      );
    }

    // Render per il testo
    if (sub.immagine_o_testo === "txt" && sub.testo) {
      const desktopStyle: React.CSSProperties = {
        position: "absolute",
        left: `${sub.left || 0}%`,
        top: `${sub.top || 50}%`,
        width: `${sub.larghezza || 100}%`,
        transform: "translateY(-50%)",
        color: "var(--foreground)",
      };

      const mobileStyle: React.CSSProperties = {
        width: "90%",
        textAlign: "center",
        margin: "2rem auto",
        color: "var(--foreground)",
      };

      return (
        <MotionWrapper
          key={`txt-${idx}`}
          style={isMobileLayout ? mobileStyle : desktopStyle}
          dangerouslySetInnerHTML={{ __html: sub.testo }}
          {...motionProps}
        />
      );
    }

    return null;
  };

  // Layout per Desktop (posizionamento assoluto)
  if (!isMobile) {
    return (
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "100vh", maxHeight: "1200px" }}
      >
        {subItems.map((sub, i) => renderSubItem(sub, i, false))}
      </div>
    );
  }

  // Layout per Mobile (flex column)
  return (
    <div className="flex flex-col items-center w-full py-8">
      {subItems.map((sub, i) => renderSubItem(sub, i, true))}
    </div>
  );
};

export default ComposerCard;