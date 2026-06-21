"use client";

import Link from "next/link";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLanguage,
  faChevronDown,
  faCheck,
  faSun,
  faMoon,
  faPuzzlePiece,
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { TRANSLATIONS } from "../app/translations";
import Image from "next/image";

export default function Header({ theme, toggleTheme, lang, setLang }) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = TRANSLATIONS[lang];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-bg-page/75 border-b border-border-ui transition-all duration-300">
      <div className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 md:px-8 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className=" overflow-hidden w-10 h-10 rounded-xl bg-linear-to-tr from-brand to-accent flex items-center justify-center shadow-lg shadow-brand/10 transition-transform group-hover:scale-105">
            <Image
              src="/assets/images/clabs_logo.png"
              alt="Logo"
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-medium text-xl tracking-tight text-text-primary group-hover:text-brand transition-colors">
              CLabs
            </span>
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-bold -mt-1">
              {t.logoSub}
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-text-muted">
          <Link href="/" className="hover:text-text-primary transition-colors">
            {t.navHome}
          </Link>
          <Link
            href="/#tools-section"
            className="hover:text-text-primary transition-colors"
          >
            {t.navTools}
          </Link>
          <a href="#" className="hover:text-text-primary transition-colors">
            {t.navApi}
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {/* Language Dropdown Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="px-3 py-2 rounded-xl border border-border-ui text-text-primary hover:bg-bg-card-hover transition-all flex items-center gap-2 cursor-pointer text-xs font-bold"
              aria-label="Select Language"
            >
              <FontAwesomeIcon
                icon={faLanguage}
                className="w-4 h-4 text-text-muted"
              />
              <span>{lang === "vi" ? "Tiếng Việt" : "English"}</span>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 ${
                  isLangOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isLangOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsLangOpen(false)}
                ></div>
                <div className="absolute right-0 mt-2 w-40 rounded-xl bg-bg-card border border-border-ui shadow-xl p-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  <button
                    onClick={() => {
                      setLang("vi");
                      localStorage.setItem("lang", "vi");
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      lang === "vi"
                        ? "bg-brand/10 text-brand"
                        : "text-text-primary hover:bg-bg-card-hover"
                    }`}
                  >
                    <span>Tiếng Việt</span>
                    {lang === "vi" && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-4 h-4 text-brand"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setLang("en");
                      localStorage.setItem("lang", "en");
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      lang === "en"
                        ? "bg-brand/10 text-brand"
                        : "text-text-primary hover:bg-bg-card-hover"
                    }`}
                  >
                    <span>English</span>
                    {lang === "en" && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="w-4 h-4 text-brand"
                      />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-border-ui text-text-primary hover:bg-bg-card-hover transition-all flex items-center justify-center cursor-pointer"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <FontAwesomeIcon
                icon={faSun}
                className="w-5 h-5 text-yellow-400"
              />
            ) : (
              <FontAwesomeIcon icon={faMoon} className="w-5 h-5 text-sky-600" />
            )}
          </button>

          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl border border-border-ui text-sm font-semibold text-text-primary hover:bg-bg-card-hover transition-all flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
            GitHub
          </a>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2.5 rounded-xl border border-border-ui text-text-primary hover:bg-bg-card-hover transition-all flex items-center justify-center cursor-pointer"
            aria-label="Toggle Menu"
          >
            <FontAwesomeIcon
              icon={isMobileMenuOpen ? faXmark : faBars}
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border-ui bg-bg-page/95 backdrop-blur-md transition-all duration-300 animate-in slide-in-from-top-4">
          <div className="px-4 py-6 flex flex-col gap-5 text-sm font-semibold">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-text-primary hover:text-brand transition-colors py-2 border-b border-border-ui/30"
            >
              {t.navHome}
            </Link>
            <Link
              href="/#tools-section"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-text-primary hover:text-brand transition-colors py-2 border-b border-border-ui/30"
            >
              {t.navTools}
            </Link>
            <a
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-text-primary hover:text-brand transition-colors py-2 border-b border-border-ui/30"
            >
              {t.navApi}
            </a>

            {/* Language selection on Mobile */}
            <div className="flex flex-col gap-2 py-2 border-b border-border-ui/30">
              <span className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
                {lang === "vi" ? "Ngôn ngữ" : "Language"}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setLang("vi");
                    localStorage.setItem("lang", "vi");
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                    lang === "vi"
                      ? "bg-brand/10 border-brand text-brand"
                      : "bg-bg-card-hover border-border-ui text-text-primary"
                  }`}
                >
                  Tiếng Việt
                </button>
                <button
                  onClick={() => {
                    setLang("en");
                    localStorage.setItem("lang", "en");
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold text-center transition-all ${
                    lang === "en"
                      ? "bg-brand/10 border-brand text-brand"
                      : "bg-bg-card-hover border-border-ui text-text-primary"
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Theme & Github on Mobile */}
            <div className="flex items-center justify-between gap-4 pt-2">
              <button
                onClick={toggleTheme}
                className="flex-1 py-2.5 rounded-xl border border-border-ui text-text-primary bg-bg-card-hover hover:bg-bg-card transition-all flex items-center justify-center gap-2 cursor-pointer text-xs font-bold"
              >
                {theme === "dark" ? (
                  <>
                    <FontAwesomeIcon
                      icon={faSun}
                      className="w-4 h-4 text-yellow-400"
                    />
                    <span>
                      {lang === "vi" ? "Giao diện sáng" : "Light Mode"}
                    </span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon
                      icon={faMoon}
                      className="w-4 h-4 text-sky-600"
                    />
                    <span>{lang === "vi" ? "Giao diện tối" : "Dark Mode"}</span>
                  </>
                )}
              </button>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl border border-border-ui text-xs font-bold text-text-primary bg-bg-card-hover hover:bg-bg-card transition-all flex items-center justify-center gap-2"
              >
                <FontAwesomeIcon icon={faGithub} className="w-4 h-4" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
