"use client";

import React, { useEffect } from "react";
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
}

const ProjectPageClient: React.FC<ProjectPageClientProps> = ({
  project,
  pageTitle,
}) => {
  const { setPageTitle } = useTitle();

  useEffect(() => {
    setPageTitle(pageTitle);
  }, [pageTitle, setPageTitle]);

  // 🔹 Passa isPreview={false} per la versione “pagina completa”
  return <ProjectContent project={project} isPreview={false} />;
};

export default ProjectPageClient;
