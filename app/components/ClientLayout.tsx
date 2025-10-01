"use client";

import { ThemeProvider } from "./ThemeProvider";

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
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}