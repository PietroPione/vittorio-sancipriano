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
        inactivityTimer = setTimeout(() => setIsOpen(false), 1000); // chiude dopo 1s
    };

    const cancelCloseTimer = () => {
        if (inactivityTimer) clearTimeout(inactivityTimer);
    };

    // Chiudi se clicchi fuori
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
            <div className="container flex justify-between items-center">
                <Link href="/">
                    <h1 className="text-white font-bold text-xl" dangerouslySetInnerHTML={{ __html: `Vittorio Sancipriano${pageTitle ? ` - ${pageTitle}` : ""}` }} />
                </Link>
                <div
                    ref={nodeRef}
                    className="relative flex items-center"
                    onMouseLeave={startCloseTimer}  // appena esci parte countdown
                    onMouseEnter={cancelCloseTimer} // se rientri annulla countdown
                >
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={menuVariants}
                                transition={{ duration: 0.3 }}
                                className="absolute right-full mr-4 flex flex-col bg-black text-white rounded shadow-lg py-2 px-4"
                                onMouseEnter={cancelCloseTimer}  // dentro il menu non chiude
                                onMouseLeave={startCloseTimer}   // esci → parte timer
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

                    {/* Logo toggle */}
                    <Logo
                        className={`w-10 h-10 text-white cursor-pointer transition-transform ${isOpen ? "rotate-90" : ""
                            }`}
                        onClick={() => setIsOpen(!isOpen)}
                        onMouseEnter={cancelCloseTimer} // sul logo non chiude
                        onMouseLeave={startCloseTimer}  // se lasci il logo parte countdown
                    />
                </div>
            </div>
        </header>
    );
};

export default Menu;
