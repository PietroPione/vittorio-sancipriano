"use client";

import React, { useLayoutEffect } from "react";
import { useTitle } from "./TitleContext";
import ProjectContent from "./ProjectContent";

interface Progetto {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    composer: {
      select_photo_qty: "1" | "2" | "3";
      [key: string]: any;
    }[];
    titolo_personalizzato?: string;
  };
}

interface ProjectPageClientProps {
  project: Progetto;
  pageTitle: string;
  slug: string;
}

const ProjectPageClient: React.FC<ProjectPageClientProps> = ({
  project,
  pageTitle,
  slug,
}) => {
  const { setPageTitle } = useTitle();

  useLayoutEffect(() => {
    setPageTitle(pageTitle);
  }, [pageTitle, setPageTitle]);

  return <ProjectContent project={project} isPreview={true} slug={slug} />;
};

export default ProjectPageClient;
