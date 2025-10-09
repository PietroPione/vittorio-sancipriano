"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";
import Link from "next/link";
import { useTitle } from "./TitleContext";

export interface MenuItem {
    ID: number;
    title: string;
    url: string;
}

const menuVariants = {
    open: {
        opacity: 1,
        x: 0,
        transition: {
            staggerChildren: 0.07,
            delayChildren: 0.2,
            staggerDirection: 1,
        },
    },
    closed: {
        opacity: 0,
        x: 20,
        transition: {
            staggerChildren: 0.05,
            staggerDirection: -1,
        },
    },
};

const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: 30 },
};

let inactivityTimer: NodeJS.Timeout | null = null;

const Menu = ({
    menuItems,
}: {
    menuItems: MenuItem[];
}) => {
    const { pageTitle, setPageTitle } = useTitle();
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
                {/* Desktop: Logo sempre visibile */}
                <Link
                    href="/"
                    className="hidden md:block"
                    onClick={() => setPageTitle("")}
                >
                    <h1
                        className="inline-block text-[var(--foreground)] text-xs whitespace-nowrap"
                        dangerouslySetInnerHTML={{
                            __html: `Vittorio Sancipriano${pageTitle ? ` - ${pageTitle}` : ""}`,
                        }}
                    />

                </Link>

                {/* Mobile: Menu a sinistra o Logo */}
                <div className="md:hidden flex-1">
                    <AnimatePresence>
                        {isOpen ? (
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={menuVariants}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col text-[var(--foreground)] text-xs"
                            >
                                <motion.ul
                                    className="flex flex-row space-x-2"
                                    variants={menuVariants}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                >
                                    <motion.li
                                        variants={itemVariants}
                                        onClick={() => setIsOpen(false)}
                                    >

                                    </motion.li>
                                    {menuItems.map((item) => (
                                        <motion.li
                                            key={item.ID}
                                            variants={itemVariants}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link
                                                href={item.url}
                                                className="hover:text-primary whitespace-nowrap"
                                            >
                                                {item.title}
                                            </Link>
                                        </motion.li>
                                    ))}
                                </motion.ul>
                            </motion.div>
                        ) : (
                            <Link
                                href="/"
                                onClick={() => setPageTitle("")}
                            >
                                <h1
                                    className="inline-block text-[var(--foreground)] text-xs whitespace-nowrap"
                                    dangerouslySetInnerHTML={{
                                        __html: `Vittorio Sancipriano${pageTitle ? ` - ${pageTitle}` : ""}`,
                                    }}
                                />
                            </Link>
                        )}
                    </AnimatePresence>
                </div>

                {/* Desktop: Menu dropdown a destra */}
                <div
                    ref={nodeRef}
                    className="relative hidden md:flex items-center"
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
                                className="absolute top-auto right-full mt-0 mr-4 flex flex-col items-start text-[var(--foreground)] bg-[var(--background)] text-xs py-4 px-4 "
                                onMouseEnter={cancelCloseTimer}
                                onMouseLeave={startCloseTimer}
                            >
                                <motion.ul
                                    className="flex flex-row space-x-4"
                                    variants={menuVariants}
                                    initial="closed"
                                    animate="open"
                                    exit="closed"
                                >
                                    <motion.li
                                        variants={itemVariants}
                                        onClick={() => setIsOpen(false)}
                                    >

                                    </motion.li>
                                    {menuItems.map((item) => (
                                        <motion.li
                                            key={item.ID}
                                            variants={itemVariants}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <Link
                                                href={item.url}
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

                    <Logo
                        className="w-6 h-6 text-[var(--foreground)] cursor-pointer hidden md:block"
                        onClick={() => setIsOpen(!isOpen)}
                        onMouseEnter={cancelCloseTimer}
                        onMouseLeave={startCloseTimer}
                    />
                </div>

                {/* Mobile: Logo toggle a destra */}
                <div className="md:hidden">
                    <Logo
                        className="w-6 h-6 text-[var(--foreground)] cursor-pointer"
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </div>
            </div>
        </header>
    );
};

export default Menu;