// components/ClientLayout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './ThemeProvider'; // Aggiorna il percorso se necessario

// Definiamo il tipo di dato per il nostro tema per usare TypeScript
type Theme = {
    background: string;
    foreground: string;
};

// Funzione fittizia di fetching
// Sostituire con la tua logica di fetching da WordPress
async function fetchThemeData(): Promise<Theme> {
    // Simuliamo il fetching dei dati del tema da WordPress
    await new Promise(resolve => setTimeout(resolve, 50));
    return {
        background: '#121212', // Dati da WP
        foreground: '#FFFFFF', // Dati da WP
    };
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme | null>(null);

    useEffect(() => {
        fetchThemeData().then(data => setTheme(data));
    }, []);

    // Puoi mostrare un loading state se preferisci
    if (!theme) {
        return (
            <body className="antialiased" style={{ backgroundColor: '#f0f0f0' }}>
                {/* Oppure uno skeleton */}
                <div>Caricamento tema...</div>
            </body>
        );
    }

    // Una volta che il tema è caricato, lo applichiamo
    return (
        <ThemeProvider theme={theme}>
            {/* Manteniamo il <body> qui perché altrimenti l'elemento <ThemeProvider> 
          non avrebbe un contenitore logico nel DOM se non c'è fetching.
          Ma il modo più pulito è spostare il tag <body> nel layout.tsx 
          e usare ClientLayout solo per la logica. Vedere il punto 3. */}
            {children}
        </ThemeProvider>
    );
}