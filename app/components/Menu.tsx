"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Logo from "./Logo";

export interface MenuItem {
    ID: number;
    title: string;
    url: string;
}

const Menu = ({ menuItems }: { menuItems: MenuItem[] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const nodeRef = useRef<HTMLDivElement>(null);

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

    const menuVariants = {
        open: { opacity: 1, x: 0 },
        closed: { opacity: 0, x: 50 },
    };

    return (
        <header className="fixed w-full top-4 left-0 right-0 z-50">
            <div className="container flex justify-between items-center">
                <h1 className="text-white font-bold text-xl">Vittorio Sancipriano</h1>
                <div ref={nodeRef} className="relative flex items-center">
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial="closed"
                                animate="open"
                                exit="closed"
                                variants={menuVariants}
                                transition={{ duration: 0.3 }}
                                className="absolute right-full mr-4 flex flex-col bg-black text-white rounded shadow-lg py-2 px-4"
                            >
                                <ul className="flex flex-col space-y-2">
                                    {menuItems.map((item) => (
                                        <li key={item.ID}>
                                            <a
                                                href={item.url}
                                                className="hover:text-primary whitespace-nowrap"
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
                    <Logo
                        className={`w-10 h-10 text-white cursor-pointer transition-transform ${isOpen ? "rotate-90" : ""}`}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </div>
            </div>
        </header>
    );
};

export default Menu;