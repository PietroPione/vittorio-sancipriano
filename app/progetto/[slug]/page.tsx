import React from "react";
import ComposerCard from "@/components/ComposerCard";
import Menu, { MenuItem } from "@/components/Menu";

interface Progetto {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    composer: any[];
    titolo_personalizzato?: string;
  };
}

async function getProject(slug: string): Promise<Progetto | null> {
  const res = await fetch(
    `https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?slug=${slug}`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) {
    return null;
  }
  const projects: Progetto[] = await res.json();
  return projects[0] || null;
}

async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const res = await fetch(
      `https://vs.ferdinandocambiale.com/wp-json/wp/v2/menu`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const [project, menuItems] = await Promise.all([
    getProject(slug),
    getMenuItems(),
  ]);

  if (!project) {
    return <div>Progetto non trovato</div>;
  }

  const pageTitle = project.acf.titolo_personalizzato || project.title.rendered;

  return (
    <main className="container mx-auto pt-24">
      <Menu menuItems={menuItems} pageTitle={pageTitle} />
      <h1
        className="text-4xl font-bold mb-8"
        dangerouslySetInnerHTML={{
          __html: pageTitle,
        }}
      />
      <div className="space-y-8">
        {project.acf.composer &&
          project.acf.composer.map((item, index) => (
            <ComposerCard key={index} item={item} />
          ))}
      </div>
    </main>
  );
}