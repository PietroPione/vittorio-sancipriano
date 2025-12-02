"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useProjectPreview } from "./ProjectPreviewProvider";

import { Progetto } from "@/types/Progetto";


interface ProjectsMenuProps {
  projects: Progetto[];
}

export default function ProjectsMenu({ projects }: ProjectsMenuProps) {
  const { previewProject, showProject, hideProjectWithDelay, hideProject, savePreviewScrollForNavigation } = useProjectPreview();
  const router = useRouter();

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>, proj: Progetto) => {
    e.preventDefault();

    // If the preview is already showing this project we want to preserve visual position:
    if (previewProject && previewProject.id === proj.id) {
      // copy overlay scroll into saved value (used by page) and make underlying interactive while we navigate
      savePreviewScrollForNavigation();
      hideProjectWithDelay(200, true);
    } else {
      hideProject();
    }

    await router.push(`/${proj.slug}`);
  };

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
            <a
              href={`/${proj.slug}`}
              onMouseEnter={() => handleMouseEnter(proj)}
              onMouseLeave={handleMouseLeave}
              onClick={(e) => handleClick(e, proj)}
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
            </a>
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
