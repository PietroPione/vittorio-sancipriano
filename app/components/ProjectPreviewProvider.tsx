"use client";

import React, { createContext, useState, useContext, ReactNode, useRef } from "react";

// Definizione dell'interfaccia Progetto per coerenza
interface Progetto {
  id: number;
  slug: string;
  title: { rendered: string };
  link: string;
  acf: {
    composer: any[];
    titolo_personalizzato?: string;
    data?: string;
  };
}

interface ProjectPreviewContextType {
  previewProject: Progetto | null;
  showProject: (project: Progetto | null) => void;
  hideProjectWithDelay: () => void;
}

const ProjectPreviewContext = createContext<ProjectPreviewContextType | undefined>(undefined);

export const ProjectPreviewProvider = ({ children }: { children: ReactNode }) => {
  const [previewProject, setPreviewProject] = useState<Progetto | null>(null);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const hideProjectWithDelay = () => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      setPreviewProject(null);
    }, 200); // Small delay to allow moving mouse to preview
  };

  const showProject = (project: Progetto | null) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setPreviewProject(project);
  };

  return (
    <ProjectPreviewContext.Provider value={{ previewProject, showProject, hideProjectWithDelay }}>
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