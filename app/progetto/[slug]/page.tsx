import React from "react";

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
    `https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?slug=${slug}`
  );
  if (!res.ok) {
    return null;
  }
  const projects: Progetto[] = await res.json();
  return projects[0] || null;
}

export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;

  const project = await getProject(slug);

  if (!project) {
    return <div>Progetto non trovato</div>;
  }

  return (
    <main className="container mx-auto pt-24 text-white">
      <h1
        className="text-4xl font-bold mb-8"
        dangerouslySetInnerHTML={{
          __html:
            project.acf.titolo_personalizzato || project.title.rendered,
        }}
      />
      <div className="space-y-8">
        {project.acf.composer.map((item, index) => (
          <div key={index} className="border p-4 rounded">
            <h2 className="text-2xl font-bold mb-2">
              Composer Item {index + 1}
            </h2>
            <pre className="bg-gray-800 p-2 rounded">
              {JSON.stringify(item, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </main>
  );
}