// components/Menu.tsx
import React from "react";

export interface MenuItem {
    ID: number;
    title: string;
    url: string;
}

const WP_BASE_URL = "https://vs.ferdinandocambiale.com";

async function getMenuItems(): Promise<MenuItem[]> {
    try {
        const res = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/menu`, {
            cache: "no-store", // evita cache se vuoi sempre fresco
        });

        if (!res.ok) {
            console.error("Errore HTTP:", res.status);
            return [];
        }

        return res.json();
    } catch (err) {
        console.error("Errore nel recupero del menu:", err);
        return [];
    }
}

const Menu = async () => {
    const menuItems = await getMenuItems();

    if (!menuItems || menuItems.length === 0) {
        return null; // niente messaggi inutili :)
    }

    return (
        <nav>
            <ul>
                {menuItems.map((item) => (
                    <li key={item.ID}>
                        <a href={item.url} target="_blank" rel="noopener noreferrer">
                            {item.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Menu;
