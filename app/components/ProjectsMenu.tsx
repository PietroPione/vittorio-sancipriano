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

  if (projects.length === 0) return null;

  return (
    <nav className="text-sm pt-20 font-medium flex flex-wrap gap-2">
      {projects.map((proj, i) => (
        <React.Fragment key={proj.id}>
          <Link
            href={`/${proj.slug}`}
            onMouseEnter={() => showProject(proj)}
            onMouseLeave={hideProjectWithDelay}
            className="hover:underline cursor-pointer"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: `${proj.acf?.titolo_personalizzato || proj.title.rendered
                  } ${proj.acf?.data || ""}`,
              }}
            />
          </Link>
          {i < projects.length - 1 && <span className="mx-1">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}