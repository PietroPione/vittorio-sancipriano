"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface MenuItem {
    ID: number;
    title: string;
    url: string;
}

const WP_BASE_URL = "https://vs.ferdinandocambiale.com";

async function getMenuItems(): Promise<MenuItem[]> {
    try {
        const res = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/menu`, { cache: "no-store" });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

const Menu = () => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => { getMenuItems().then(setMenuItems); }, []);
    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (nodeRef.current && !nodeRef.current.contains(e.target as Node)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    if (!menuItems || menuItems.length === 0) return null;

    const menuVariants = { open: { opacity: 1, x: 0 }, closed: { opacity: 0, x: 50 } };

    return (
        <div className="fixed w-full top-4 left-0 right-0 flex justify-between items-center px-4 z-50">
            {/* Sinistra */}
            <h1 className="text-white font-bold text-xl">Vittorio Sancipriano</h1>

            {/* Destra toggle + menu */}
            <div ref={nodeRef} className="relative flex items-center">
                {/* Menu animato */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={menuVariants}
                            transition={{ duration: 0.3 }}
                            className="absolute right-full mr-2 flex flex-col bg-black text-white rounded shadow-lg py-2 px-4"
                        >
                            <ul className="flex flex-col space-y-2">
                                {menuItems.map((item) => (
                                    <li key={item.ID}>
                                        <a
                                            href={item.url}
                                            className="hover:text-primary"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Toggle */}
                <button onClick={() => setIsOpen(!isOpen)} className="w-10 h-10 flex items-center justify-center">
                    <img
                        src="/logoMenu.png"
                        alt="Menu Toggle"
                        className={`w-full h-full object-contain transition-transform ${isOpen ? "rotate-90" : ""}`}
                    />
                </button>
            </div>
        </div>
    );
};

export default Menu;
