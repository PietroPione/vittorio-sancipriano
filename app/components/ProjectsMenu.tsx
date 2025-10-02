"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link"; // Assicurati che l'import sia corretto

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          "https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: Progetto[] = await response.json();
        setProjects(data);
        console.log("Progetti caricati:", data);
      } catch (err: any) {
        console.error("Errore fetch progetti:", err);
        setError(err.message);
      }
    };

    fetchProjects();
  }, []);

  if (error) {
    return <div className="text-red-500">Errore: {error}</div>;
  }

  if (projects.length === 0) {
    return <div>Caricamento…</div>;
  }

  return (
    <nav className="text-sm font-medium flex flex-wrap gap-2">
      {projects.map((proj, i) => (
        <React.Fragment key={proj.id}>

          <Link
            href={`/progetto/${proj.slug}`}
            className="hover:underline"
            dangerouslySetInnerHTML={{
              __html: `${proj.acf?.titolo_personalizzato || proj.title.rendered} ${proj.acf?.data || ""
                }`,
            }}
          />
          {i < projects.length - 1 && <span className="mx-1">/</span>}
        </React.Fragment>
      ))}
    </nav>
  );
}