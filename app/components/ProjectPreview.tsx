"use client";

import React, { useEffect, useState } from "react";
import { useProjectPreview } from "./ProjectPreviewProvider";
import ProjectContent from "./ProjectContent";

interface Progetto {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    composer: any[];
    titolo_personalizzato?: string;
  };
}

export default function ProjectPreview() {
  const { previewSlug } = useProjectPreview();
  const [project, setProject] = useState<Progetto | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (previewSlug) {
      setIsLoading(true);
      const fetchProject = async () => {
        try {
          const res = await fetch(
            `https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?slug=${previewSlug}`
          );
          const data: Progetto[] = await res.json();
          if (data.length > 0) {
            setProject(data[0]);
          } else {
            setProject(null);
          }
        } catch (err) {
          console.error("Errore fetch progetto per preview:", err);
          setProject(null);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProject();
    } else {
      setProject(null);
    }
  }, [previewSlug]);

  const isVisible = !!previewSlug && !!project && !isLoading;

  return (
    <div
      // Utilizziamo top-12 (48px) per superare l'altezza calcolata di 40px
      className={`fixed left-0 right-0 bottom-0 top-12 -z-10 transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"
        }`}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      {project && <ProjectContent project={project} />}
    </div>
  );
}