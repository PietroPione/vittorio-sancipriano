"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookieNoticeDismissed";

type CookieContent = {
  message?: string;
  moreText?: string;
  linkHref?: string;
  buttonText?: string;
};

const CookieNotice: React.FC<{ content?: CookieContent }> = ({ content }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const dismissed = window.localStorage.getItem(STORAGE_KEY) === "1";
    if (!dismissed) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "1");
    }
    setVisible(false);
  };

  if (!visible) return null;

  const message =
    content?.message?.trim() ||
    "Usiamo solo cookie tecnici essenziali per far funzionare il sito; non serve accettare nulla e non tracciamo dati di navigazione.";
  const moreText = content?.moreText?.trim() || "";
  const linkHref = content?.linkHref?.trim() || "";
  const buttonText = content?.buttonText?.trim() || "Scopri di più";
  const showSecondRow = moreText || linkHref;

  return (
    <div className="fixed inset-x-0 bottom-6 z-[140] flex justify-center px-4">
      <div className="relative w-[min(800px,100%)] rounded-md border border-[var(--foreground)]/20 bg-[var(--background)]/90 text-[var(--foreground)] shadow-lg backdrop-blur">
        <button
          aria-label="Chiudi informativa cookie"
          className="absolute right-3 top-2 text-sm opacity-80 transition hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            dismiss();
          }}
        >
          ×
        </button>
        <div className="flex flex-col gap-3 px-4 py-3 text-sm leading-relaxed">
          <p className="w-full">{message}</p>
          {showSecondRow ? (
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-start">
              {moreText ? <p>{moreText}</p> : <span />}
              {linkHref && buttonText ? (
                <Link
                  href={linkHref}
                  className="self-start rounded border border-[var(--foreground)]/30 px-3 py-1 text-sm transition hover:-translate-y-[1px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismiss();
                  }}
                >
                  {buttonText}
                </Link>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CookieNotice;
