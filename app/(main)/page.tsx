import ProjectsMenu from "../components/ProjectsMenu";

interface Progetto {
  id: number;
  slug: string;
  title: { rendered: string };
  link: string;
  acf: {
    composer: any[];
    titolo_personalizzato?: string;
    data?: string;
  };
}

async function getProjects(): Promise<Progetto[]> {
  try {
    // Step 1: Fetch the list of project slugs for efficiency
    const listRes = await fetch("https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?_fields=slug", { next: { revalidate: 3600 } });
    if (!listRes.ok) throw new Error('Failed to fetch project list');
    const projectSlugs: { slug: string }[] = await listRes.json();

    // Step 2: Fetch the full data for each project in parallel
    const projectPromises = projectSlugs.map(p =>
      fetch(`https://vs.ferdinandocambiale.com/wp-json/wp/v2/progetto?slug=${p.slug}`, { next: { revalidate: 3600 } })
        .then(res => res.json())
        .then(data => data[0]) // The API returns an array, we want the first element
    );

    const fullProjects = await Promise.all(projectPromises);
    return fullProjects.filter(p => p); // Filter out any null/undefined results

  } catch (err) {
    console.error("Errore fetch progetti:", err);
    return [];
  }
}


export default async function Home() {
  const projects = await getProjects();

  return (
    <div >
      <main className="px-12">
        <ProjectsMenu projects={projects} />
      </main>
    </div>
  );
}