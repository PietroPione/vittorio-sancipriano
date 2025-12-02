"use client";

import React, { createContext, useContext, useRef, useState, ReactNode, useEffect } from "react";
import ProjectContent from "./ProjectContent";
import { useTitle } from "./TitleContext";
import { ProjectPreviewProvider } from "./ProjectPreviewProvider";

interface Progetto {
  id: number;
  slug: string;
  title: { rendered: string };
  link?: string;
  acf?: any;
}

type ProjectPreviewContextType = {
  previewProject: Progetto | null;
  showProject: (project: Progetto | null) => void;
  hideProjectWithDelay: (delay?: number, makeUnderlyingInteractive?: boolean) => void;
  hideProject: () => void;
  overlayPointerEventsEnabled: boolean;
};

const ProjectPreviewContext = createContext<ProjectPreviewContextType | undefined>(undefined);

export const ProjectPreviewProvider = ({ children }: { children: ReactNode }) => {
  const [previewProject, setPreviewProject] = useState<Progetto | null>(null);
  const [overlayPointerEventsEnabled, setOverlayPointerEventsEnabled] = useState<boolean>(true);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  const hideProject = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setPreviewProject(null);
    setOverlayPointerEventsEnabled(true);
  };

  // delay = ms to keep preview visible,
  // makeUnderlyingInteractive = if true, immediately disable overlay pointer-events so page under overlay is interactive
  const hideProjectWithDelay = (delay = 300, makeUnderlyingInteractive = false) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);

    if (makeUnderlyingInteractive) {
      // allow underlying page to receive pointer events immediately
      setOverlayPointerEventsEnabled(false);
    } else {
      setOverlayPointerEventsEnabled(true);
    }

    hideTimer.current = setTimeout(() => {
      setPreviewProject(null);
      setOverlayPointerEventsEnabled(true);
      hideTimer.current = null;
    }, delay);
  };

  const showProject = (project: Progetto | null) => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setOverlayPointerEventsEnabled(true);
    setPreviewProject(project);
  };

  return (
    <ProjectPreviewContext.Provider
      value={{ previewProject, showProject, hideProjectWithDelay, hideProject, overlayPointerEventsEnabled }}
    >
      {children}
    </ProjectPreviewContext.Provider>
  );
};

export const useProjectPreview = () => {
  const ctx = useContext(ProjectPreviewContext);
  if (!ctx) throw new Error("useProjectPreview must be used within ProjectPreviewProvider");
  return ctx;
};

export default function ProjectPageClient({
  project,
  pageTitle,
  slug,
}: {
  project: any;
  pageTitle: string;
  slug: string;
}) {
  const { setPageTitle } = useTitle();

  useEffect(() => {
    setPageTitle(pageTitle || "");
    return () => setPageTitle("");
  }, [pageTitle, setPageTitle]);

  return (
    <ProjectPreviewProvider>
      <div className="mx-auto ">
        <ProjectContent project={project} isPreview={false} slug={slug} />
      </div>
    </ProjectPreviewProvider>
  );
}
