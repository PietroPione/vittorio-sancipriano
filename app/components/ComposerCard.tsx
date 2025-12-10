"use client";

import React from "react";
import { motion, easeOut } from "framer-motion";
import Image from "next/image";
import useMediaQuery from "@/hooks/useMediaQuery";




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
  slug: string;
}

const ComposerCard: React.FC<ComposerCardProps> = ({
  item,
  onImageClick,
  isPreview = false,
  slug,
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

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
    // true solo se NON sei in preview E se l’elemento NON è img assoluta
    const shouldAnimate =
      !isPreview && sub.immagine_o_testo === "txt";

    const MotionWrapper = shouldAnimate ? motion.div : "div";

    const motionProps = shouldAnimate
      ? {
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.2 },
        variants: itemVariants,
      }
      : {};

    if (sub.immagine_o_testo === "img" && sub.immagine && typeof sub.immagine === "object") {
      const fixedUrl = sub.immagine.url?.replace(/^https:\/\//, "http://") ?? "";
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
        width: "100%",
        padding: "0 1rem",
        marginBottom: "2rem",
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
            src={fixedUrl}
            alt={alt || "Project image"}
            width={imgWidth}
            height={imgHeight}
            sizes={isMobileLayout ? "100vw" : `${sub.larghezza || 30}vw`}
            className="w-full h-auto select-none"
            priority={idx < 2}
          />
        </MotionWrapper>
      );
    }

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
        textAlign: "start",
        margin: "2rem auto",
        color: "var(--foreground)",
      };

      const outerStyle = isMobileLayout ? mobileStyle : desktopStyle;

      return (
        <div
          key={`txt-${idx}`}
          style={outerStyle}
        >
          <MotionWrapper
            dangerouslySetInnerHTML={{ __html: sub.testo }}
            {...motionProps}
          />
        </div>
      );
    }

    return null;
  };

  const isBioOrContact = slug === "bio" || slug === "contact";

  if (!isMobile) {
    if (isBioOrContact) {
      return (
        <div
          className="flex flex-col justify-center items-center w-full py-8"
          style={{ minHeight: "100vh" }}
        >
          <div className="w-full max-w-4xl px-4">
            {subItems.map((sub, i) => renderSubItem(sub, i, true))}
          </div>
        </div>
      );
    }

    return (
      <div
        className="relative w-full"
        style={{ minHeight: "100vh" }}
      >
        {subItems.map((sub, i) => renderSubItem(sub, i, false))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full py-8">
      {subItems.map((sub, i) => renderSubItem(sub, i, true))}
    </div>
  );
};

export default ComposerCard;
