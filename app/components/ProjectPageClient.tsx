"use client";

import React, { useEffect } from 'react';
import { useTitle } from './TitleContext';
import ProjectContent from './ProjectContent';

interface Progetto {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    composer: any[];
    titolo_personalizzato?: string;
  };
}

interface ProjectPageClientProps {
  project: Progetto;
  pageTitle: string;
}

const ProjectPageClient: React.FC<ProjectPageClientProps> = ({ project, pageTitle }) => {
  const { setPageTitle } = useTitle();

  useEffect(() => {
    setPageTitle(pageTitle);
  }, [pageTitle, setPageTitle]);

  return <ProjectContent project={project} />;
};

export default ProjectPageClient;