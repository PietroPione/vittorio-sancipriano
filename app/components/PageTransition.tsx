"use client";

import { motion, AnimatePresence, easeOut } from "framer-motion";
import { usePathname } from "next/navigation";
import React from "react";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.5, ease: easeOut } }}
        exit={{ opacity: 0, transition: { duration: 0.3, ease: easeOut } }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;