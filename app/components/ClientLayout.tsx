"use client";

import { ThemeProvider } from "./ThemeProvider";
import ProjectPreview from "./ProjectPreview";
import PageTransition from "./PageTransition";
import CustomCursor from "./CustomCursor"; // Importa il cursore
import CookieNotice from "./CookieNotice";

type Theme = {
    background: string;
    foreground: string;
};

type CookieContent = {
    message: string;
    moreText: string;
    linkHref: string;
    buttonText: string;
};

export default function ClientLayout({
    children,
    theme,
    cookieContent,
}: {
    children: React.ReactNode;
    theme: Theme;
    cookieContent?: CookieContent;
}) {
    return (
        <ThemeProvider theme={theme}>
            <CustomCursor />
            <PageTransition>{children}</PageTransition>
            <ProjectPreview />
            <CookieNotice content={cookieContent} />
        </ThemeProvider>
    );
}
