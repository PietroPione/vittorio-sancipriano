"use client";

import React, { useState, useEffect, useRef } from "react";
// Assumendo che il percorso e la struttura di cookieData.json siano corretti
// e che tu voglia usare un type definition per questo file.
// Per semplicità, definisco l'interfaccia qui.
// Se 'testi.json' ha una struttura complessa, potresti doverla raffinare.

// Definizione dell'interfaccia per la struttura dati di testi.json
interface CookiePolicyData {
    cookieBanner: {
        title: string;
        information: string;
        buttonLink: string;
        buttonText: string;
    };
    // Aggiungi qui altre sezioni del tuo file JSON se necessario
    [key: string]: any;
}

// Assumendo che questo sia il percorso corretto per il tuo file JSON
// Poiché non ho accesso al tuo filesystem, uso 'require' o un import
// se questo modulo non viene risolto correttamente in Next.js.
// Useremo un semplice 'require' o 'import' che funziona tipicamente in un ambiente Next.js/Webpack.
// Nota: Se sei in un ambiente di esecuzione limitato, potresti dover mockare o escludere l'import.
// Per questo esempio, usiamo 'require' per la compatibilità con TSX in certi contesti.
// Se l'import da '../app/cookie-policy/testi.json' ti dà problemi, converti il JSON in un file .ts o .js.
const cookieData: CookiePolicyData = require("../app/cookie-policy/testi.json");

// Tipo di placeholder per il componente Lancio, che deve essere definito altrove.
// Devi assicurarti di avere un componente 'Lancio' importato correttamente.
const Lancio = ({ url, testo, iconName, fillColor, hoverFillColor, hoverColor }: any) => {
    // Componente placeholder o il tuo vero componente Lancio
    return <button className="cursor-pointer">{testo}</button>;
};

export default function CookiePopup() {
    // Stato per la visibilità del popup
    const [isVisible, setIsVisible] = useState<boolean>(false);

    // Riferimento al div del popup per il rilevamento del click esterno
    const popupRef = useRef<HTMLDivElement>(null);

    const handleClosePopup = (): void => {
        setIsVisible(false);
        // Utilizzo di window.localStorage per specificità
        if (typeof window !== 'undefined') {
            window.localStorage.setItem("cookiePopupSeen", "true");
        }
    };

    // Effetto per l'inizializzazione: verifica se il popup è già stato visto
    useEffect(() => {
        let hasSeenPopup = null;
        if (typeof window !== 'undefined') {
            hasSeenPopup = window.localStorage.getItem("cookiePopupSeen");
        }
        // Imposta la visibilità se non è stato ancora visto
        setIsVisible(!hasSeenPopup);
    }, []);

    // Effetto per la chiusura al click esterno
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            // Controlla se l'elemento di riferimento esiste e se il click non è al suo interno
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
    }, [isVisible]); // Rimosso popupRef dalla dipendenza, non cambia

    if (!isVisible) {
        return null;
    }

    const handleDivClick = (): void => {
        handleClosePopup();
    };

    return (
        <div className="fixed inset-0 z-50">
            {/* Overlay semitrasparente */}
            <div className="fixed inset-0 bg-[var(--green-alph)] opacity-50 "></div>

            {/* Contenitore principale del popup */}
            <div className="fixed inset-x-0 bottom-0 flex items-end justify-center">
                <div
                    ref={popupRef}
                    className="p-6 w-full max-w-4xl rounded-t-xl bg-[var(--green-alph)]" // Aggiunto max-w e rounded
                    // Impedisce la chiusura del popup quando si clicca al suo interno
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
                        {/* Wrapper del pulsante che chiude il popup */}
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
