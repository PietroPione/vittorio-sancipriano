"use client";

import React, { useState, useEffect, useRef } from "react";

interface CookiePolicyData {
    cookieBanner: {
        title: string;
        information: string;
        buttonLink: string;
        buttonText: string;
    };
    [key: string]: any;
}

const cookieData: CookiePolicyData = require("../app/cookie-policy/testi.json");

const Lancio = ({ url, testo, iconName, fillColor, hoverFillColor, hoverColor }: any) => {
    return <button className="cursor-pointer">{testo}</button>;
};

export default function CookiePopup() {
    const [isVisible, setIsVisible] = useState<boolean>(false);

    const popupRef = useRef<HTMLDivElement>(null);

    const handleClosePopup = (): void => {
        setIsVisible(false);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem("cookiePopupSeen", "true");
        }
    };

    useEffect(() => {
        let hasSeenPopup = null;
        if (typeof window !== 'undefined') {
            hasSeenPopup = window.localStorage.getItem("cookiePopupSeen");
        }
        setIsVisible(!hasSeenPopup);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                handleClosePopup();
            }
        };

        if (isVisible) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isVisible]);

    if (!isVisible) {
        return null;
    }

    const handleDivClick = (): void => {
        handleClosePopup();
    };

    return (
        <div className="fixed inset-0 z-50">
            <div className="fixed inset-0 bg-[var(--green-alph)] opacity-50 "></div>

            <div className="fixed inset-x-0 bottom-0 flex items-end justify-center">
                <div
                    ref={popupRef}
                    className="p-6 w-full max-w-4xl rounded-t-xl bg-[var(--green-alph)]"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                    <div className="container space-y-4">
                        <div className="space-y-2">
                            <h2 className="text-15 text-white md:text-22 font-semibold">
                                {cookieData.cookieBanner.title}
                            </h2>
                            <p className="text-12 md:text-15 text-white">
                                {cookieData.cookieBanner.information}
                            </p>
                        </div>
                        <div className="text-white cursor-pointer" onClick={handleDivClick}>
                            <Lancio
                                url={cookieData.cookieBanner.buttonLink}
                                testo={cookieData.cookieBanner.buttonText}
                                iconName="arrow"
                                fillColor="#fff"
                                hoverFillColor="#fff"
                                hoverColor="#fff"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
