export interface Progetto {
    id: number;
    slug: string;
    title: { rendered: string };
    link?: string;
    acf?: any;
}
