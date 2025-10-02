import React from "react";
import { notFound } from "next/navigation";

import ComposerCard from "@/components/ComposerCard";
import Menu, { MenuItem } from "@/components/Menu";

export const dynamic = "force-dynamic";

interface Progetto {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    composer: any[];
    titolo_personalizzato?: string;
  };
}

async function getProject(slug: string): Promise<Progetto> {
  const res = await fetch(
    `https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?slug=${slug}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    notFound();
  }

  const projects: Progetto[] = await res.json();

  if (!projects || projects.length === 0) {
    notFound();
  }

  return projects[0];
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [project, menuItems] = await Promise.all([
    getProject(slug),
    getMenuItems(),
  ]);

  const pageTitle = project.acf.titolo_personalizzato || project.title.rendered;

  return (
    <main className=" mx-auto pt-24">
      <Menu menuItems={menuItems} pageTitle={pageTitle} />

      <h1
        className="sr-only"
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
