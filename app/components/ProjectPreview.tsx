"use client";

import React, { useRef } from "react";
import { useProjectPreview } from "./ProjectPreviewProvider";
import ProjectContent from "./ProjectContent";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function ProjectPreview() {
  const {
    previewProject,
    showProject,
    hideProjectWithDelay,
    overlayPointerEventsEnabled,
    setPreviewScroll,
    endPageTransition
  } = useProjectPreview();

  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasMounted = useRef(false);
  const [visibleProjectId, setVisibleProjectId] = React.useState<number | null>(null);
  const [fadeKey, setFadeKey] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    if (pathname) {
      hideProjectWithDelay(260, true);
      const timeout = setTimeout(() => {
        endPageTransition();
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [pathname, hideProjectWithDelay, endPageTransition]);

  React.useEffect(() => {
    if (!previewProject) return;
    setVisibleProjectId(previewProject.id);
    setFadeKey(previewProject.id);
    // reset scroll when switching to a new preview
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [previewProject]);

  if (!previewProject) return null;

  return (
    <div
      ref={containerRef}
      data-testid="project-preview-container"
      className="fixed inset-0 z-40 transition-opacity duration-200 opacity-100 overflow-hidden"
      style={{
        pointerEvents: overlayPointerEventsEnabled ? "auto" : "none",
        backgroundColor: "var(--background)"
      }}
      onMouseEnter={() => showProject(previewProject)}
      onMouseLeave={() => hideProjectWithDelay()}
      onScroll={(e) => {
        const sc = (e.target as HTMLElement).scrollTop || 0;
        setPreviewScroll(sc);
      }}
    >
      <main className="mx-auto pt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={fadeKey}
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1, transition: { duration: 0.25, ease: "easeOut" } }}
            exit={{ opacity: 0, transition: { duration: 0.15, ease: "easeIn" } }}
          >
            {visibleProjectId === previewProject.id && (
              <ProjectContent
                project={previewProject}
                isPreview={true}
                slug={previewProject.slug}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
