import React from "react";
import { notFound } from "next/navigation";
import ProjectPageClient from "@/components/ProjectPageClient";

interface Content {
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

async function fetchAllSlugs() {
  const postTypes = ["progetto", "pages"];
  const allSlugs = [];

  for (const type of postTypes) {
    try {
      const res = await fetch(
        `https://vs.ferdinandocambiale.com/wp-json/wp/v2/${type}?_fields=slug&per_page=100`,
        { next: { revalidate: 3600 } }
      );
      if (res.ok) {
        const items: { slug: string }[] = await res.json();
        allSlugs.push(...items.map(item => ({ slug: [item.slug] })));
      }
    } catch (error) {
      console.error(`Failed to fetch slugs for ${type}:`, error);
    }
  }
  return allSlugs;
}

export async function generateStaticParams() {
  return await fetchAllSlugs();
}

async function getData(slug: string): Promise<Content> {
  const projectRes = await fetch(
    `https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?slug=${slug}`,
    { next: { revalidate: 3600 } }
  );

  if (projectRes.ok) {
    const projects: Content[] = await projectRes.json();
    if (projects && projects.length > 0) {
      return projects[0];
    }
  }

  const pageRes = await fetch(
    `https://vs.ferdinandocambiale.com/wp-json/wp/v2/pages?slug=${slug}`,
    { next: { revalidate: 3600 } }
  );

  if (pageRes.ok) {
    const pages: Content[] = await pageRes.json();
    if (pages && pages.length > 0) {
      return pages[0];
    }
  }

  notFound();
}

type Props = {
  params: Promise<{ slug?: string[] }>;
};

export default async function Page({ params }: Props) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug ? awaitedParams.slug[0] : "home";
  if (slug === "home") {
    // redirect to a default page or handle appropriately
    // for now, we assume a slug is always present for project/pages
    notFound();
  }

  const content = await getData(slug);
  const pageTitle = content.acf.titolo_personalizzato || content.title.rendered;

  return (
    <main className="mx-auto pt-24">
      <h1
        className="sr-only"
        dangerouslySetInnerHTML={{ __html: pageTitle }}
      />
      <ProjectPageClient
        project={content}
        pageTitle={pageTitle}
        slug={slug}
      />
    </main>
  );
}
