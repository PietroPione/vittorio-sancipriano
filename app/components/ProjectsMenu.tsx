"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

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

  if (projects.length === 0) return null;

  return (
    <nav className="text-sm pt-20 font-medium flex flex-wrap gap-2">
      {projects.map((proj, i) => (
        <React.Fragment key={proj.id}>
          <Link
            href={`/${proj.slug}`}
            className="hover:underline"
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
