export interface Progetto {
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