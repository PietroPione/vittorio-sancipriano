"use client";

import React from "react";
import { useProjectPreview } from "./ProjectPreviewProvider";
import ProjectContent from "./ProjectContent";
import { usePathname } from "next/navigation";

export default function ProjectPreview() {
  const { previewProject, showProject, hideProjectWithDelay } = useProjectPreview();
  const pathname = usePathname();

  React.useEffect(() => {
    hideProjectWithDelay();
  }, [pathname]);

  const isVisible = !!previewProject;

  return (
    <div
      data-testid="project-preview-container"
      className={`fixed inset-0 z-40 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
      style={{
        pointerEvents: isVisible ? "auto" : "none",
        backgroundColor: "var(--background)",
      }}
      onMouseEnter={() => showProject(previewProject)}
      onMouseLeave={hideProjectWithDelay}
    >
      {previewProject && (
        <main className="mx-auto pt-24">
          <ProjectContent project={previewProject} isPreview={true} />
        </main>
      )}
    </div>
  );
}