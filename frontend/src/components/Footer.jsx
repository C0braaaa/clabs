"use client";

import Image from "next/image";
import { TRANSLATIONS } from "../app/translations";

export default function Footer({ lang }) {
  const t = TRANSLATIONS[lang];

  return (
    <footer className="border-t border-border-ui bg-bg-card mt-24">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 md:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-transparent">
            <Image
              src="/assets/images/clabs_logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-display text-md tracking-tight text-text-primary">
            CLabs © {new Date().getFullYear()}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-8 text-sm text-text-muted">
          <a href="#" className="hover:text-text-primary transition-colors">
            {t.terms}
          </a>
          <a href="#" className="hover:text-text-primary transition-colors">
            {t.privacy}
          </a>
          <a href="#" className="hover:text-text-primary transition-colors">
            {t.contact}
          </a>
        </div>

        <div className="text-xs text-text-muted">{t.footerDesc}</div>
      </div>
    </footer>
  );
}
