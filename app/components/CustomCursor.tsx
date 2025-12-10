"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isTouchPointer, setIsTouchPointer] = useState(false);

  useEffect(() => {
    // Disable custom cursor on touch / coarse pointer devices (mobile/tablet).
    if (typeof window !== "undefined") {
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      setIsTouchPointer(coarse);
    }
  }, []);

  useEffect(() => {
    if (isTouchPointer) return;

    const mouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setCursorVariant('click');
    const handleMouseUp = () => setCursorVariant('default');

    window.addEventListener('mousemove', mouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, .cursor-pointer');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => setCursorVariant('link'));
      el.addEventListener('mouseleave', () => setCursorVariant('default'));
    });

    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', () => setCursorVariant('link'));
        el.removeEventListener('mouseleave', () => setCursorVariant('default'));
      });
    };
  }, [isTouchPointer]);

  if (isTouchPointer) return null;

  const variants = {
    default: {
      x: mousePosition.x - 8,
      y: mousePosition.y - 8,
      height: 16,
      width: 16,
      backgroundColor: 'var(--foreground)',
      mixBlendMode: 'difference' as const,
    },
    link: {
      x: mousePosition.x - 16,
      y: mousePosition.y - 16,
      height: 32,
      width: 32,
      backgroundColor: 'transparent',
      borderColor: 'var(--foreground)',
      borderWidth: '1px',
      mixBlendMode: 'normal' as const,
    },
    click: {
      x: mousePosition.x - 12,
      y: mousePosition.y - 12,
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
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
    />
  );
};

export default CustomCursor;
