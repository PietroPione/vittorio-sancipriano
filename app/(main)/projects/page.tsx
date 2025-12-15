import React from "react";
import ProjectsMenu from "@/components/ProjectsMenu";

import { Progetto } from "@/types/Progetto";


async function getProjects(): Promise<Progetto[]> {
  try {
    const res = await fetch(
      `https://www.vittoriosancipriano.com/wp-json/wp/v2/progetto?per_page=100`,
      { next: { revalidate: 3600 } }
    );
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

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="container mx-auto px-4">
      <ProjectsMenu projects={projects} />
    </main>
  );
}
