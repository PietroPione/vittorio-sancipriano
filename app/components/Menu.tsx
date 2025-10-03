"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import Link from "next/link";

export interface MenuItem {
    ID: number;
    title: string;
    url: string;
}

const menuVariants = {
    open: {
        opacity: 1,
        x: 0,
        transition: { staggerChildren: 0.08, delayChildren: 0.1, staggerDirection: -1 },
    },
    closed: {
        opacity: 0,
        x: 50,
        transition: { staggerChildren: 0.03, staggerDirection: -1 },
    },
};

const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: 30 },
};

let inactivityTimer: NodeJS.Timeout | null = null;

const Menu = ({
    menuItems,
    pageTitle,
}: {
    menuItems: MenuItem[];
    pageTitle?: string;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);

    const startCloseTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => setIsOpen(false), 1000);
    };

    const cancelCloseTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
    };

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    if (!menuItems || menuItems.length === 0) return null;

    return (
        <header className="fixed w-full top-4 left-0 right-0 z-50">
            <div className="px-4 flex justify-between items-center">
                <Link href="/" className="w-1/2">
                    <h1
                        // Titolo: Cambia colore usando la variabile --foreground
                        className="inline-block max-w-full truncate text-[var(--foreground)] text-xs"
                        dangerouslySetInnerHTML={{
                            __html: `Vittorio Sancipriano${pageTitle ? ` - ${pageTitle}` : ""}`,
                        }}
                    />
                </Link>
                <div
                    ref={nodeRef}
                    className="relative flex items-center"
                    onMouseLeave={startCloseTimer}
                    onMouseEnter={cancelCloseTimer}
                >
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={menuVariants}
                                transition={{ duration: 0.3 }}
                                // Contenitore Menu: Aggiunge BG e cambia colore testo usando le variabili
                                className="absolute right-full mr-4 flex flex-col text-[var(--foreground)] bg-[var(--background)] text-xs py-2 px-4 shadow-lg rounded-md"
                                onMouseEnter={cancelCloseTimer}
                                onMouseLeave={startCloseTimer}
                            >
                                <motion.ul
                                    className="flex flex-row space-x-2"
                                    variants={menuVariants}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                >
                                    {menuItems.map((item) => (
                                        <motion.li
                                            key={item.ID}
                                            variants={itemVariants}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link
                                                href={item.url}
                                                // Link: hover usa text-primary (che è già dinamico tramite tailwind.config.ts)
                                                className="hover:text-primary whitespace-nowrap"
                                            >
                                                {item.title}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Logo toggle: Cambia colore usando la variabile --foreground */}
                    <Logo
                        className={`w-6 h-6 text-[var(--foreground)] cursor-pointer `}
                        onClick={() => setIsOpen(!isOpen)}
                        onMouseEnter={cancelCloseTimer}
                        onMouseLeave={startCloseTimer}
                    />
                </div>
            </div>
        </header>
    );
};

export default Menu;