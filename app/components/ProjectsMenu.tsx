"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    showProject(null);
    router.push(`/${slug}`);
  };

  // Aggiungi controllo per undefined/null
  if (!projects || !Array.isArray(projects) || projects.length === 0) return null;

  return (
    <nav className="text-sm pt-20 font-medium flex flex-col md:flex-row md:flex-wrap items-center justify-center gap-2 relative z-50">
      {projects.map((proj, i) => (
        <React.Fragment key={proj.id}>
          <Link
            href={`/${proj.slug}`}
            onMouseEnter={() => showProject(proj)}
            onMouseLeave={hideProjectWithDelay}
            onClick={(e) => handleClick(e, proj.slug)}
            className="hover:underline cursor-pointer relative z-50"
          >
            <span
              dangerouslySetInnerHTML={{
                __html: `${proj.acf?.titolo_personalizzato || proj.title.rendered
                  } ${proj.acf?.data || ""}`,
              }}
            />
          </Link>
          {i < projects.length - 1 && <span className="mx-1 relative z-50">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}