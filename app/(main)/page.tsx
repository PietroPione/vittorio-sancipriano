import ProjectsMenu from "@/components/ProjectsMenu";
import { Progetto } from "@/types";
import React from "react";

async function getProjects(): Promise<Progetto[]> {
  try {
    const res = await fetch("https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?_embed", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      console.error("Failed to fetch projects:", res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <div>
      <main className="px-12">
        <ProjectsMenu projects={projects} />
      </main>
    </div>
  );
}