"use client";

import React from "react";

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  // Render children directly to avoid any visible page transition flicker.
  return <>{children}</>;
};

export default PageTransition;
