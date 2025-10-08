import React from "react";
import { notFound } from "next/navigation";
import ProjectPageClient from "@/components/ProjectPageClient";

export const dynamic = "force-dynamic";

interface Progetto {
  id: number;
  slug: string;
  title: { rendered: string };
  acf: {
    composer: {
      select_photo_qty: "1" | "2" | "3";
      [key: string]: any;
    }[];
    titolo_personalizzato?: string;
  };
}

export async function generateStaticParams() {
  try {
    const res = await fetch(
      "https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?_fields=slug&per_page=100",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const projects: { slug: string }[] = await res.json();
    return projects.map((project) => ({
      slug: project.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch slugs for generateStaticParams:", error);
    return [];
  }
}

async function getProject(slug: string): Promise<Progetto> {
  const res = await fetch(
    `https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?slug=${slug}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) notFound();

  const projects: Progetto[] = await res.json();
  if (!projects || projects.length === 0) notFound();

  return projects[0];
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await getProject(slug);
  const pageTitle = project.acf.titolo_personalizzato || project.title.rendered;

  return (
    <main className="mx-auto pt-24">
      <h1
        className="sr-only"
        dangerouslySetInnerHTML={{ __html: pageTitle }}
      />
      <ProjectPageClient project={project} pageTitle={pageTitle} />
    </main>
  );
}
