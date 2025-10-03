"use client";

import React from "react";
import { useProjectPreview } from "./ProjectPreviewProvider";
import ProjectContent from "./ProjectContent";
import { Progetto } from "@/types";

export default function ProjectPreview() {
  const { previewProject } = useProjectPreview();

  const isVisible = !!previewProject;

  return (
    <div
      className={`fixed left-0 right-0 bottom-0 top-0 z-10 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {previewProject && <ProjectContent project={previewProject} />}
    </div>
  );
}