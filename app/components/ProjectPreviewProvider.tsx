"use client";

import React, { createContext, useContext, useRef, useState, ReactNode, useCallback } from "react";

import { Progetto } from "@/types/Progetto";
import { usePathname } from "next/navigation";


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
  isNavigating: boolean;
  startPageTransition: () => void;
  endPageTransition: () => void;
};

const ProjectPreviewContext = createContext<ProjectPreviewContextType | undefined>(undefined);

export const ProjectPreviewProvider = ({ children }: { children: ReactNode }) => {
  const [previewProject, setPreviewProject] = useState<Progetto | null>(null);
  const [overlayPointerEventsEnabled, setOverlayPointerEventsEnabled] = useState<boolean>(true);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const hideTimer = useRef<NodeJS.Timeout | null>(null);
  const navigationTimer = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const hasMounted = useRef(false);

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

  const startPageTransition = useCallback(() => {
    if (navigationTimer.current) {
      clearTimeout(navigationTimer.current);
    }
    setIsNavigating(true);
    // fallback in case navigation does not complete
    navigationTimer.current = setTimeout(() => setIsNavigating(false), 800);
  }, []);

  const endPageTransition = useCallback(() => {
    if (navigationTimer.current) {
      clearTimeout(navigationTimer.current);
      navigationTimer.current = null;
    }
    setIsNavigating(false);
  }, []);

  React.useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    // when the pathname changes we can safely end the navigation state
    const timeout = setTimeout(() => {
      endPageTransition();
    }, 150);
    return () => clearTimeout(timeout);
  }, [pathname, endPageTransition]);

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
        isNavigating,
        startPageTransition,
        endPageTransition,
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
