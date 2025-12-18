import ProjectsMenu from "../components/ProjectsMenu";
import { Progetto } from "@/types/Progetto";


// Definizione dei tipi per i dati dei progetti, allineati con ComposerCard.tsx
interface ImageAcf {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface SubItem {
  immagine_o_testo?: "img" | "txt" | "";
  immagine?: ImageAcf | false;
  testo?: string;
  left?: string;
  top?: string;
  larghezza?: string;
}

interface ComposerItem {
  immagine_1?: SubItem;
  immagine_2?: SubItem;
  immagine_3?: SubItem;
  [key: string]: any;
}


async function getProjects(): Promise<Progetto[]> {
  try {
    // Fetch all projects in a single API call for better performance
    const res = await fetch("https://www.backendvittoriosancipriano.com/wp-json/wp/v2/progetto?per_page=100", { next: { revalidate: 3600 } });

    if (!res.ok) {
      console.error("Failed to fetch projects:", res.status, res.statusText);
      throw new Error('Failed to fetch project list');
    }

    const projects: Progetto[] = await res.json();
    return projects;

  } catch (err) {
    console.error("Errore fetch progetti:", err);
    return [];
  }
}

export default async function Home() {
  const projects = await getProjects();

  return (
    <div>
      <main className="px-4 h-[93vh]">
        <ProjectsMenu projects={projects} />
      </main>
    </div>
  );
}
