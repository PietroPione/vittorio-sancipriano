import ThemeToggle from "@/components/ThemeToggle";

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

async function getThemeData(): Promise<ThemeData> {
  const res = await fetch("https://vs.ferdinandocambiale.com/wp-json/wp/v2/options", {
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
  const themeData = await getThemeData();
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
        <ClientLayout
          theme={{
            background: theme.colore_light,
            foreground: theme.colore_dark,
          }}
        >
          {children}
          <ThemeToggle /> {/* 👈 aggiunto qui */}
        </ClientLayout>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Vittorio Sancipriano",
  description:
    "Being in love with art his whole life, Sancipriano first joined the Photography scene in 2010 as a reportage photographer; his early work includes stories from Morocco, Russia, Mongolia, Palestine.",
};
