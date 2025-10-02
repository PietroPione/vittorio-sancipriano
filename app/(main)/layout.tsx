import Menu, { MenuItem } from "@/app/components/Menu";
import React from "react";

async function getMenuItems(): Promise<MenuItem[]> {
  try {
    const res = await fetch(
      `https://vs.ferdinandocambiale.com/wp-json/wp/v2/menu`,
      { cache: "no-store" }
    );
    if (!res.ok) {
      console.error("Failed to fetch menu items:", res.statusText);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Error fetching menu items:", error);
    return [];
  }
}

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const menuItems = await getMenuItems();

  return (
    <>
      <Menu menuItems={menuItems} />
      {children}
    </>
  );
}