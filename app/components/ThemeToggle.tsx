"use client";

import React, { useState } from "react";
import Luna from "./Luna";

const ThemeToggle: React.FC = () => {
    const [isLightBackground, setIsLightBackground] = useState(true);

    const toggleTheme = () => {
        const newIsLightBackground = !isLightBackground;
        setIsLightBackground(newIsLightBackground);

        const lightColorVar = 'var(--color-primary)';
        const darkColorVar = 'var(--color-secondary)';

        if (newIsLightBackground) {
            document.documentElement.style.setProperty("--background", lightColorVar);
            document.documentElement.style.setProperty("--foreground", darkColorVar);
        } else {
            document.documentElement.style.setProperty("--background", darkColorVar);
            document.documentElement.style.setProperty("--foreground", lightColorVar);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-[100]">
            <button
                onClick={toggleTheme}
                className="text-[var(--foreground)]"
                aria-label="Toggle theme"
            >
                <div className="flex items-end justify-end">
                    <Luna className="w-6 h-6" />
                </div>

            </button>
        </div>
    );
};

export default ThemeToggle;