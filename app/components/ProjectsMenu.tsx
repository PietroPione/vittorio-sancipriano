"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectPreview } from "./ProjectPreviewProvider";
import { Progetto } from "@/types";

interface ProjectsMenuProps {
  projects: Progetto[];
}

export default function ProjectsMenu({ projects }: ProjectsMenuProps) {
  const { setPreviewProject } = useProjectPreview();
  const router = useRouter();
  const [isHiding, setIsHiding] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    setPreviewProject(null);
    setIsHiding(true);
    setTimeout(() => {
      router.push(`/${slug}`);
    }, 300);
  };

  if (projects.length === 0) return null;

  return (
    <nav
      className={`text-sm pt-20 font-medium flex flex-wrap gap-2 transition-opacity duration-300 ${
        isHiding ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      {projects.map((proj, i) => (
        <React.Fragment key={proj.id}>
          <a
            href={`/${proj.slug}`}
            onMouseEnter={() => {
              setPreviewProject(proj);
              router.prefetch(`/${proj.slug}`);
            }}
            onMouseLeave={() => {
              setPreviewProject(null);
            }}
            onClick={(e) => handleClick(e, proj.slug)}
            className="hover:underline cursor-pointer"
            dangerouslySetInnerHTML={{
              __html: `${proj.acf?.titolo_personalizzato || proj.title.rendered} ${
                proj.acf?.data || ""
              }`,
            }}
          />
          {i < projects.length - 1 && <span className="mx-1">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}