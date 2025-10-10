"use client";

import React from "react";
import Link from "next/link";
import { useProjectPreview } from "./ProjectPreviewProvider";

interface Progetto {
  id: number;
  slug: string;
  title: { rendered: string };
  link: string;
  acf: {
    composer: any[];
    titolo_personalizzato?: string;
    data?: string;
  };
}

interface ProjectsMenuProps {
  projects: Progetto[];
}

export default function ProjectsMenu({ projects }: ProjectsMenuProps) {
  const { showProject, hideProjectWithDelay } = useProjectPreview();

  const handleMouseEnter = (proj: Progetto) => {
    if (window.innerWidth >= 768) showProject(proj); // solo da md in su
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 768) hideProjectWithDelay(); // solo da md in su
  };

  if (!projects || !Array.isArray(projects) || projects.length === 0) return null;

  return (
    <nav className="text-sm pt-20 font-normal md:font-light flex flex-col md:flex-row md:flex-wrap items-start lg:items-center justify-center gap-2 relative z-50">
      {projects.map((proj, i) => {
        const titolo = proj.acf?.titolo_personalizzato || proj.title.rendered;
        const data = proj.acf?.data || "";

        return (
          <React.Fragment key={proj.id}>
            <Link
              href={`/${proj.slug}`}
              onMouseEnter={() => handleMouseEnter(proj)}
              onMouseLeave={handleMouseLeave}
              onClick={() => showProject(null)}
              className="cursor-pointer relative z-50 flex items-start whitespace-nowrap"
            >
              <span
                className="text-2xl lg:text-5xl leading-none mr-2"
                dangerouslySetInnerHTML={{ __html: titolo }}
              />
              {data && (
                <span
                  className="text-sm lg:text-3xl leading-none align-top"
                  dangerouslySetInnerHTML={{ __html: data }}
                />
              )}
            </Link>
            {i < projects.length - 1 && (
              <span className="mx-1 hidden lg:block text-4xl font-light relative z-50">
                /
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
