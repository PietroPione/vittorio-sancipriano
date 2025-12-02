"use client";

import React, { createContext, useContext, useRef, useState, ReactNode } from "react";

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
  // new APIs for scroll-sync
  setPreviewScroll: (pos: number) => void;
  savePreviewScrollForNavigation: () => void;
  consumeSavedScroll: () => number | null;
};

const ProjectPreviewContext = createContext<ProjectPreviewContextType | undefined>(undefined);

export const ProjectPreviewProvider = ({ children }: { children: ReactNode }) => {
  const [previewProject, setPreviewProject] = useState<Progetto | null>(null);
  const [overlayPointerEventsEnabled, setOverlayPointerEventsEnabled] = useState<boolean>(true);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);

  // track live preview scroll
  const previewScrollRef = useRef<number>(0);
  // saved scroll to apply after navigation
  const savedScrollRef = useRef<number | null>(null);

  const hideProject = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    setPreviewProject(null);
    setOverlayPointerEventsEnabled(true);
  };

  const hideProjectWithDelay = (delay = 300, makeUnderlyingInteractive = false) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);

    if (makeUnderlyingInteractive) {
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

  // new: set live preview scroll
  const setPreviewScroll = (pos: number) => {
    previewScrollRef.current = pos;
  };

  // new: copy live preview scroll into saved value to be used when page opens
  const savePreviewScrollForNavigation = () => {
    savedScrollRef.current = previewScrollRef.current;
  };

  // new: consume saved scroll once when page mounts and clear it
  const consumeSavedScroll = () => {
    const val = savedScrollRef.current;
    savedScrollRef.current = null;
    return val;
  };

  return (
    <ProjectPreviewContext.Provider
      value={{
        previewProject,
        showProject,
        hideProjectWithDelay,
        hideProject,
        overlayPointerEventsEnabled,
        setPreviewScroll,
        savePreviewScrollForNavigation,
        consumeSavedScroll,
      }}
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