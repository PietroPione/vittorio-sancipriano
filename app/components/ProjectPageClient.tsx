"use client";

import React, { useEffect } from "react";
import ProjectContent from "./ProjectContent";
import { useTitle } from "./TitleContext";
import { ProjectPreviewProvider } from "./ProjectPreviewProvider";

export default function ProjectPageClient({
  project,
  pageTitle,
  slug,
  isPreview = false,
}: {
  project: any;
  pageTitle: string;
  slug: string;
  isPreview?: boolean;   // 👈 aggiunto qui
}) {
  const { setPageTitle } = useTitle();

  useEffect(() => {
    setPageTitle(pageTitle || "");
    return () => setPageTitle("");
  }, [pageTitle, setPageTitle]);

  return (
    <ProjectPreviewProvider>
      <div className="mx-auto">
        <ProjectContent
          project={project}
          slug={slug}
          isPreview={false}

        />

      </div>
    </ProjectPreviewProvider>
  );
}
