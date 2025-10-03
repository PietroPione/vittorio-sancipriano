"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";
import { Progetto } from "@/types";

interface ProjectPreviewContextType {
  previewProject: Progetto | null;
  setPreviewProject: (project: Progetto | null) => void;
}

const ProjectPreviewContext = createContext<ProjectPreviewContextType | undefined>(undefined);

export const ProjectPreviewProvider = ({ children }: { children: ReactNode }) => {
  const [previewProject, setPreviewProject] = useState<Progetto | null>(null);

  return (
    <ProjectPreviewContext.Provider value={{ previewProject, setPreviewProject }}>
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