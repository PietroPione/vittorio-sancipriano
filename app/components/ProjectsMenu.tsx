"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useProjectPreview } from "./ProjectPreviewProvider";

interface Progetto {
  id: number;
  slug: string;
  title: { rendered: string };
  link: string;
  acf?: {
    titolo_personalizzato?: string;
    data?: string;
  };
}

export default function ProjectsMenu() {
  const [projects, setProjects] = useState<Progetto[]>([]);
  const { setPreviewSlug } = useProjectPreview();
  const router = useRouter();
  const [isHiding, setIsHiding] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto");
        const data: Progetto[] = await res.json();
        setProjects(data);
      } catch (err) {
        console.error("Errore fetch progetti:", err);
      }
    };
    fetchProjects();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();

    // NASCONDI IMMEDIATAMENTE LA PREVIEW e avvia la transizione del menu
    setPreviewSlug(null);
    setIsHiding(true);

    setTimeout(() => {
      // DOPO LA TRANSIZIONE DEL MENU (300ms) AVVIA LA NAVIGAZIONE
      router.push(`/${slug}`);
    }, 300);
  };

  if (projects.length === 0) return null;

  return (
    <nav
      // AGGIUNGI pointer-events-none QUANDO NASCOSTO
      className={`text-sm pt-20 font-medium flex flex-wrap gap-2 transition-opacity duration-300 ${isHiding ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      {projects.map((proj, i) => (
        <React.Fragment key={proj.id}>
          <a
            href={`/${proj.slug}`}
            onMouseEnter={() => {
              setPreviewSlug(proj.slug);
              router.prefetch(`/${proj.slug}`);
            }}
            onMouseLeave={() => {
              setPreviewSlug(null);
            }}
            onClick={(e) => handleClick(e, proj.slug)}
            className="hover:underline cursor-pointer"
            dangerouslySetInnerHTML={{
              __html: `${proj.acf?.titolo_personalizzato || proj.title.rendered} ${proj.acf?.data || ""}`,
            }}
          />
          {i < projects.length - 1 && <span className="mx-1">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}