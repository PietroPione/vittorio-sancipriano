import ThemeToggle from "@/components/ThemeToggle";
import Menu, { MenuItem } from "@/components/Menu";
import { TitleProvider } from "@/components/TitleContext";
import { ProjectPreviewProvider } from "@/components/ProjectPreviewProvider";
import ProjectPreview from "@/components/ProjectPreview";

import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import React from "react";

type ThemeOptions = {
  colore_dark: string;
  colore_light: string;
  dimensione_data: string;
  dimensione_titoli: string;
};

type ThemeData = {
  acf: ThemeOptions;
};


async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const res = await fetch(
      `http://vs.ferdinandocambiale.com/wp-json/wp/v2/menu`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) {
      console.error("Failed to fetch menu items:", res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

async function getThemeData(): Promise<ThemeData> {
  const res = await fetch("http://vs.ferdinandocambiale.com/wp-json/wp/v2/options", {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    console.error("Errore nel fetching delle opzioni del tema:", res.statusText);
    return {
      acf: {
        colore_dark: "#333333",
        colore_light: "#ffffff",
        dimensione_data: "2",
        dimensione_titoli: "3",
      },
    };
  }

  const data = await res.json();

  if (data && typeof data === "object") {
    return { acf: data as ThemeOptions };
  }

  return {
    acf: {
      colore_dark: "#333333",
      colore_light: "#ffffff",
      dimensione_data: "2",
      dimensione_titoli: "3",
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeData, menuItems] = await Promise.all([
    getThemeData(),
    getMenuItems(),
  ]);
  const theme = themeData.acf;

  console.log("Colore Light from API (Primary):", theme.colore_light);
  console.log("Colore Dark from API (Secondary):", theme.colore_dark);

  return (
    <html
      lang="it"
      style={
        {
          "--color-primary": theme.colore_light,
          "--color-secondary": theme.colore_dark,
          "--background": theme.colore_light,
          "--foreground": theme.colore_dark,
        } as React.CSSProperties
      }
    >
      <link
        rel="stylesheet"
        href="https://use.typekit.net/euy7heu.css"
        precedence="default"
      />
      <body className="antialiased">
        <TitleProvider>
          <ProjectPreviewProvider>
            <ClientLayout
              theme={{
                background: theme.colore_light,
                foreground: theme.colore_dark,
              }}
            >
              <Menu menuItems={menuItems} />
              {children}
              <ThemeToggle />
            </ClientLayout>
          </ProjectPreviewProvider>
        </TitleProvider>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Vittorio Sancipriano",
  description:
    "Being in love with art his whole life, Sancipriano first joined the Photography scene in 2010 as a reportage photographer; his early work includes stories from Morocco, Russia, Mongolia, Palestine.",
};
