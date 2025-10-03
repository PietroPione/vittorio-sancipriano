"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

interface ProjectPreviewContextType {
  previewSlug: string | null;
  setPreviewSlug: (slug: string | null) => void;
}

const ProjectPreviewContext = createContext<ProjectPreviewContextType | undefined>(undefined);

export const ProjectPreviewProvider = ({ children }: { children: ReactNode }) => {
  const [previewSlug, setPreviewSlug] = useState<string | null>(null);

  return (
    <ProjectPreviewContext.Provider value={{ previewSlug, setPreviewSlug }}>
      {children}
    </ProjectPreviewContext.Provider>
  );
};

export const useProjectPreview = () => {
  const context = useContext(ProjectPreviewContext);
  if (context === undefined) {
    throw new Error("useProjectPreview must be used within a ProjectPreviewProvider");
  }
  return context;
};