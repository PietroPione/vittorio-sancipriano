import Menu, { MenuItem } from "@/app/components/Menu";
import React from "react";

interface Progetto {
  title: { rendered: string };
  acf: {
    titolo_personalizzato?: string;
  };
}

async function getProject(slug: string): Promise<Progetto | null> {
  const res = await fetch(
    `https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?slug=${slug}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  const projects = await res.json();
  return projects[0] || null;
}

async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const res = await fetch(
      `https://vs.ferdinandocambiale.com/wp-json/wp/v2/menu`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string };
}) {
  const [project, menuItems] = await Promise.all([
    getProject(params.slug),
    getMenuItems(),
  ]);

  const pageTitle = project?.acf?.titolo_personalizzato || project?.title?.rendered;

  return (
    <div>
      <Menu menuItems={menuItems} pageTitle={pageTitle} />
      {children}
    </div>
  );
}