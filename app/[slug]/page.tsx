import React from "react";
import { notFound } from "next/navigation";
import ProjectPageClient from "@/components/ProjectPageClient";

export const dynamic = "force-dynamic";

interface WPBase {
  id: number;
  slug: string;
  title: { rendered: string };
  acf?: {
    composer?: {
      select_photo_qty: "1" | "2" | "3";
      [key: string]: any;
    }[];
    titolo_personalizzato?: string;
  };
}

async function fetchWPContent(
  type: "progetto" | "pages",
  slug: string
): Promise<WPBase | null> {
  try {
    const res = await fetch(
      `http://vs.ferdinandocambiale.com/wp-json/wp/v2/${type}?slug=${slug}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const items: WPBase[] = await res.json();
    if (!items || items.length === 0) return null;
    return items[0];
  } catch (error) {
    console.error(`Error fetching ${type}:`, error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const [projectsRes, pagesRes] = await Promise.all([
      fetch(
        "http://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?_fields=slug&per_page=100",
        { next: { revalidate: 3600 } }
      ),
      fetch(
        "http://vs.ferdinandocambiale.com/wp-json/wp/v2/pages?_fields=slug&per_page=100",
        { next: { revalidate: 3600 } }
      ),
    ]);

    const projects = projectsRes.ok ? await projectsRes.json() : [];
    const pages = pagesRes.ok ? await pagesRes.json() : [];

    const allSlugs = [...projects, ...pages].map((item: { slug: string }) => ({
      slug: item.slug,
    }));

    return allSlugs;
  } catch (error) {
    console.error("Failed to fetch slugs for generateStaticParams:", error);
    return [];
  }
}

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  // 1️⃣ Prova a recuperare come progetto
  let project = await fetchWPContent("progetto", slug);

  // 2️⃣ Se non trovato, prova come pagina
  if (!project) {
    project = await fetchWPContent("pages", slug);
  }

  // 3️⃣ Se ancora non trovato → 404
  if (!project) notFound();

  const pageTitle =
    project.acf?.titolo_personalizzato || project.title?.rendered || "";

  return (
    <main className="mx-auto pt-24">
      <h1
        className="sr-only"
        dangerouslySetInnerHTML={{ __html: pageTitle }}
      />
      <ProjectPageClient
        project={project}
        pageTitle={pageTitle}
        slug={slug}
      />
    </main>
  );
}
