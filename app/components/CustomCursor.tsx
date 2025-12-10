"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState<'default' | 'link' | 'click'>('default');
  const [isTouchPointer, setIsTouchPointer] = useState(false);
  const [isPointerActive, setIsPointerActive] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch / coarse pointer devices (mobile/tablet).
    if (typeof window !== "undefined") {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      setIsTouchPointer(coarse);
    }
  }, []);

  useEffect(() => {
    if (isTouchPointer) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      setIsPointerActive(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handlePointerLeave = () => setIsPointerActive(false);
    const handlePointerDown = () => setCursorVariant('click');
    const handlePointerUp = () => setCursorVariant('default');

    const isInteractive = (target: EventTarget | null) => {
      if (!(target instanceof Element)) return false;
      return target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer');
    };

    const handlePointerOver = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (isInteractive(e.target)) setCursorVariant('link');
    };

    const handlePointerOut = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      if (isInteractive(e.target)) setCursorVariant('default');
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointerover', handlePointerOver, true);
    window.addEventListener('pointerout', handlePointerOut, true);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointerover', handlePointerOver, true);
      window.removeEventListener('pointerout', handlePointerOut, true);
    };
  }, [isTouchPointer]);

  if (isTouchPointer) return null;

  const variants = {
    default: {
      x: mousePosition.x,
      y: mousePosition.y,
      height: 16,
      width: 16,
      backgroundColor: 'var(--foreground)',
      mixBlendMode: 'difference' as const,
    },
    link: {
      x: mousePosition.x,
      y: mousePosition.y,
      height: 32,
      width: 32,
      backgroundColor: 'transparent',
      borderColor: 'var(--foreground)',
      borderWidth: '1px',
      mixBlendMode: 'normal' as const,
    },
    click: {
      x: mousePosition.x,
      y: mousePosition.y,
      height: 24,
      width: 24,
      backgroundColor: 'var(--foreground)',
      mixBlendMode: 'difference' as const,
    }
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full z-[9999] pointer-events-none"
      variants={variants}
      animate={cursorVariant}
      style={{ translateX: "-50%", translateY: "-50%", opacity: isPointerActive ? 1 : 0 }}
      transition={{ type: 'tween', duration: 0.12, ease: "easeOut" }}
    />
  );
};

export default CustomCursor;
