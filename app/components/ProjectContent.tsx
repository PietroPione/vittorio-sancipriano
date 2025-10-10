"use client";

import React, { useState, useEffect } from "react";
import ComposerCard from "@/components/ComposerCard";
import FullScreenSlider from "@/components/FullScreenSlider";

interface ComposerItem {
    select_photo_qty: "1" | "2" | "3";
    [key: string]: any;
}

interface Progetto {
    id: number;
    slug: string;
    title: { rendered: string };
    acf: {
        composer: ComposerItem[];
        titolo_personalizzato?: string;
    };
}

interface ProjectContentProps {
    project: Progetto;
    isPreview?: boolean;
    slug: string;
}

const extractAllImages = (composer: any[]): { src: string; alt: string }[] => {
    const allImages: { src: string; alt: string }[] = [];

    composer.forEach((block) => {
        Object.keys(block).forEach((key) => {
            if (key.startsWith("immagine_")) {
                const sub = block[key];
                if (sub?.immagine_o_testo === "img" && sub?.immagine?.url) {
                    allImages.push({
                        src: sub.immagine.url,
                        alt: sub.immagine.alt || "Project image",
                    });
                }
            }
        });
    });

    return allImages;
};

const ProjectContent: React.FC<ProjectContentProps> = ({
    project,
    isPreview = false,
    slug,
}) => {
    const composer = Array.isArray(project.acf?.composer) ? project.acf.composer : [];
    const allImages = extractAllImages(composer);

    const [isSliderOpen, setIsSliderOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        // document.body.style.overflow = isPreview ? "hidden" : "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [isPreview]);

    const handleImageClick = (src: string) => {
        const idx = allImages.findIndex((img) => img.src === src);
        if (idx !== -1) {
            setSelectedIndex(idx);
            setIsSliderOpen(true);
        }
    };

    return (
        <>
            <div className="space-y-8">
                {composer.map((item, index) => (
                    <ComposerCard
                        key={index}
                        item={item}
                        onImageClick={handleImageClick}
                        isPreview={isPreview}
                        slug={slug}
                    />
                ))}
            </div>

            {isSliderOpen && (
                <FullScreenSlider
                    images={allImages}
                    initialIndex={selectedIndex}
                    onClose={() => setIsSliderOpen(false)}
                />
            )}
        </>
    );
};

export default ProjectContent;
