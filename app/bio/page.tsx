import React from "react";
import { notFound } from "next/navigation";
import ProjectPageClient from "@/components/ProjectPageClient";

// This interface is compatible with the Progetto interface,
// as titolo_personalizzato is optional.
interface Page {
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

async function getPage(slug: string): Promise<Page> {
  const res = await fetch(
    `https://vs.ferdinandocambiale.com/wp-json/wp/v2/pages?slug=${slug}`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) {
    console.error(`Failed to fetch page with slug ${slug}: ${res.statusText}`);
    notFound();
  }

  const pages: Page[] = await res.json();
  if (!pages || pages.length === 0) {
    console.error(`No page found with slug ${slug}`);
    notFound();
  }

  return pages[0];
}

export default async function BioPage() {
  const page = await getPage("bio");
  const pageTitle = page.title.rendered;

  return (
    <main className="mx-auto pt-24">
      <h1
        className="sr-only"
        dangerouslySetInnerHTML={{ __html: pageTitle }}
      />
      {/* The 'project' prop expects a Progetto, but our Page type is compatible. */}
      <ProjectPageClient project={page} pageTitle={pageTitle} />
    </main>
  );
}
