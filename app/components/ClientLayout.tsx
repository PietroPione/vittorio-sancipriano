"use client";

import { ThemeProvider } from "./ThemeProvider";
import ProjectPreview from "./ProjectPreview";
import PageTransition from "./PageTransition";
import CustomCursor from "./CustomCursor"; // Importa il cursore

type Theme = {
    background: string;
    foreground: string;
};

export default function ClientLayout({
    children,
    theme,
}: {
    children: React.ReactNode;
    theme: Theme;
}) {
    return (
        <ThemeProvider theme={theme}>
            <CustomCursor />
            <PageTransition>{children}</PageTransition>
            <ProjectPreview />
        </ThemeProvider>
    );
}