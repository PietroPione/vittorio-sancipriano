"use client";

import React, { useRef } from "react";
import { useProjectPreview } from "./ProjectPreviewProvider";
import ProjectContent from "./ProjectContent";
import { usePathname } from "next/navigation";

export default function ProjectPreview() {
  const {
    previewProject,
    showProject,
    hideProjectWithDelay,
    overlayPointerEventsEnabled,
    setPreviewScroll
  } = useProjectPreview();

  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (pathname) hideProjectWithDelay(200, true);
  }, [pathname, hideProjectWithDelay]);

  if (!previewProject) return null;

  return (
    <div
      ref={containerRef}
      data-testid="project-preview-container"
      className="fixed inset-0 z-40 transition-opacity duration-200 opacity-100 overflow-y-auto"
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
        <ProjectContent
          project={previewProject}
          isPreview={true}
          slug={previewProject.slug}
        />
      </main>
    </div>
  );
}
