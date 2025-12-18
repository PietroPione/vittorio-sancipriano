"use client";

import Link from "next/link";
import React from "react";

type BottomRightLinksProps = {
  creditsText?: string;
  creditsHref?: string;
  cookiePolicyText?: string;
  cookiePolicyHref?: string;
};

export default function BottomRightLinks({
  creditsText = "Credits",
  creditsHref = "/credits",
  cookiePolicyText = "Cookie policy",
  cookiePolicyHref = "/cookie-policy",
}: BottomRightLinksProps) {
  return (
    <>
      <div className="fixed bottom-4 left-6 z-[150] hidden md:block">
        <div className="origin-bottom-left -rotate-90 flex flex-row items-center gap-3 text-[10px] tracking-[0.12em]">
          <Link
            href={creditsHref}
            className="text-[var(--foreground)] opacity-70 hover:opacity-100 hover:underline underline-offset-4"
          >
            {creditsText}
          </Link>
          <Link
            href={cookiePolicyHref}
            className="text-[var(--foreground)] opacity-70 hover:opacity-100 hover:underline underline-offset-4"
          >
            {cookiePolicyText}
          </Link>
        </div>
      </div>
      <div className="md:hidden w-full py-6 flex items-center justify-center gap-6 text-[12px] tracking-[0.08em]">
        <Link
          href={creditsHref}
          className="text-[var(--foreground)] opacity-70 hover:opacity-100 hover:underline underline-offset-4"
        >
          {creditsText}
        </Link>
        <Link
          href={cookiePolicyHref}
          className="text-[var(--foreground)] opacity-70 hover:opacity-100 hover:underline underline-offset-4"
        >
          {cookiePolicyText}
        </Link>
      </div>
    </>
  );
}
