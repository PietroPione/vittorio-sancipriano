// components/ThemeProvider.tsx
'use client';

import React, { useEffect } from 'react';

// Definiamo il tipo di dato per il nostro tema per usare TypeScript
type Theme = {
    background: string;
    foreground: string;
};

// Definiamo le props del nostro provider
type ThemeProviderProps = {
    theme: Theme;
    children: React.ReactNode;
};

export function ThemeProvider({ theme, children }: ThemeProviderProps) {
    useEffect(() => {
        // Applichiamo i colori ricevuti come variabili CSS all'elemento radice <html>
        const root = document.documentElement;
        root.style.setProperty('--background', theme.background);
        root.style.setProperty('--foreground', theme.foreground);
    }, [theme]); // Questo effetto si attiva solo quando l'oggetto `theme` cambia

    // Il provider non renderizza nulla di suo, solo i suoi figli
    return <>{children}</>;
}