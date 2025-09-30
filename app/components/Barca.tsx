import React from 'react';

type Props = {
    className?: string;
};

// Componente Barca SVG che mantiene la struttura originale con trasformazione <g>
export default function Barca({ className = "w-6 h-6" }: Props) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 71.256 67.459"
            className={className}
            fill="none"
            stroke="currentColor" // Prende il colore dal testo/tailwind (es. text-primary)
            strokeWidth="2"
        >
            {/* L'elemento <g> e la sua trasformazione vengono mantenuti per posizionare il disegno. */}
            <g transform="translate(-1407.146 -342.243)">
                {/* Attributi come fill e stroke-width sono stati rimossi dalle linee interne 
                    poiché ereditano correttamente dall'elemento SVG padre. */}
                <line x1="27.856" y2="46.513" transform="translate(1417.978 342.5)" />
                <line x1="27.856" transform="translate(1417.978 389.013)" />
                <line y2="56.224" transform="translate(1445.834 342.5)" />
                <line x2="22.49" transform="translate(1445.834 393.102)" />
                <line x2="22.49" y2="38.59" transform="translate(1445.834 354.511)" />
                <line x2="70.535" transform="translate(1407.5 398.724)" />
                <line x2="50.346" transform="translate(1417.978 409.202)" />
                <line x1="9.711" y2="10.478" transform="translate(1468.324 398.724)" />
                <line x1="10.478" y1="10.478" transform="translate(1407.5 398.724)" />
            </g>
        </svg>
    );
}
