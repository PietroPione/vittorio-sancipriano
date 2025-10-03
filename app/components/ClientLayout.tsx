"use client";

import { ThemeProvider } from "./ThemeProvider";
import { ProjectPreviewProvider } from "./ProjectPreviewProvider";
import ProjectPreview from "./ProjectPreview";

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
        <ProjectPreviewProvider>
            <ThemeProvider theme={theme}>
                {children}
                <ProjectPreview />
            </ThemeProvider>
        </ProjectPreviewProvider>
    );
}