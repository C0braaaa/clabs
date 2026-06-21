"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TRANSLATIONS } from "./translations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faQrcode,
  faFilePdf,
  faImage,
  faCode,
  faKey,
  faParagraph,
  faPuzzlePiece,
  faSearch,
  faArrowRight,
  faLock,
  faFaceFrown,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Predefined list of tools
const TOOLS = [
  {
    id: "qr-generator",
    title: "Tạo Mã QR",
    description:
      "Tạo nhanh mã QR từ đường dẫn (URL) hoặc văn bản tùy chỉnh. Hỗ trợ thay đổi màu sắc và tải về chất lượng cao.",
    category: "Tiện ích",
    status: "Sẵn sàng",
    target: "/tools/qr-generator",
    icon: <FontAwesomeIcon icon={faQrcode} className="w-6 h-6 text-brand" />,
  },
  {
    id: "pdf-to-word",
    title: "PDF Sang Word",
    description:
      "Chuyển đổi tài liệu PDF sang định dạng Microsoft Word (.docx) mà vẫn giữ nguyên bố cục và cấu trúc tài liệu.",
    category: "Tài liệu",
    status: "Sẵn sàng",
    target: "/tools/pdf-converter",
    icon: (
      <FontAwesomeIcon icon={faFilePdf} className="w-6 h-6 text-secondary" />
    ),
  },
  {
    id: "image-optimizer",
    title: "Nén & Tối Ưu Ảnh",
    description:
      "Giảm dung lượng hình ảnh (PNG, JPEG, WebP) nhanh chóng giúp tăng tốc độ tải trang mà không làm mờ ảnh.",
    category: "Hình ảnh",
    status: "Sắp ra mắt",
    target: "#",
    icon: <FontAwesomeIcon icon={faImage} className="w-6 h-6 text-accent" />,
  },
  {
    id: "json-formatter",
    title: "Định Dạng JSON",
    description:
      "Làm đẹp dữ liệu JSON, kiểm tra lỗi cú pháp, thu gọn hoặc định dạng dễ đọc chỉ với một cú nhấp chuột.",
    category: "Lập trình",
    status: "Sắp ra mắt",
    target: "#",
    icon: <FontAwesomeIcon icon={faCode} className="w-6 h-6 text-brand" />,
  },
  {
    id: "base64-codec",
    title: "Mã Hóa Base64",
    description:
      "Chuyển đổi chuỗi ký tự thường sang mã hóa Base64 và ngược lại một cách an toàn, nhanh chóng trực tuyến.",
    category: "Lập trình",
    status: "Sắp ra mắt",
    target: "#",
    icon: <FontAwesomeIcon icon={faKey} className="w-6 h-6 text-secondary" />,
  },
  {
    id: "lorem-generator",
    title: "Tạo Lorem Ipsum",
    description:
      "Bộ tạo các đoạn văn bản giả lập (Lorem Ipsum) với các tùy chọn từ ngữ, câu hoặc đoạn phục vụ thiết kế UI.",
    category: "Tiện ích",
    status: "Sắp ra mắt",
    target: "#",
    icon: (
      <FontAwesomeIcon icon={faParagraph} className="w-6 h-6 text-accent" />
    ),
  },
];

const CATEGORIES = ["Tất cả", "Tiện ích", "Tài liệu", "Hình ảnh", "Lập trình"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tất cả");
  const [theme, setTheme] = useState("dark"); // Default to dark
  const [lang, setLang] = useState("vi"); // Default to Vietnamese

  useEffect(() => {
    // Theme initialization
    const root = document.documentElement;
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

    // Language initialization
    const savedLang = localStorage.getItem("lang") || "vi";
    setLang(savedLang);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    if (newTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }
  };

  const t = TRANSLATIONS[lang];

  // Map translations to TOOLS
  const translatedTools = TOOLS.map((tool) => ({
    ...tool,
    originalCategory: tool.category,
    title: t.tools[tool.id].title,
    description: t.tools[tool.id].description,
    category: t.categories[tool.category],
    status: tool.status === "Sẵn sàng" ? t.ready : t.comingSoon,
  }));

  // Filtering logic
  const filteredTools = translatedTools.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "Tất cả" || tool.originalCategory === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col grid-bg">
      {/* HEADER */}
      <Header theme={theme} toggleTheme={toggleTheme} lang={lang} setLang={setLang} />

      {/* HERO SECTION */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 md:px-8 py-12 md:py-20 flex flex-col gap-16">
        <section className="text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12 border-b border-border-ui/50 pb-16">
          <div className="flex-1 flex flex-col gap-6 max-w-2xl">
            {/* <div className="inline-flex self-center md:self-start px-3 py-1 rounded-full border border-brand/20 bg-brand/5 text-xs font-bold text-brand uppercase tracking-wider">
              {t.heroBadge}
            </div> */}
            <h1 className="text-4xl md:text-6xl tracking-tight leading-[1.1] text-text-primary">
              {t.heroHeading1} <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-brand via-brand-hover to-accent">
                {t.heroHeading2}
              </span>
            </h1>
            <p className="text-lg text-text-muted leading-relaxed">
              {t.heroDesc}
            </p>
          </div>

          <div className="w-full max-w-md bg-bg-card border border-border-ui rounded-3xl p-6 md:p-8 shadow-xl shadow-brand/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-brand/10 to-transparent rounded-full blur-xl"></div>
            <h3 className="font-display text-lg mb-4 flex items-center gap-2">
              <span>{t.searchTitle}</span>
            </h3>

            <div className="flex flex-col gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-bg-card-hover border border-border-ui rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all text-text-primary placeholder-text-muted"
                />
                <FontAwesomeIcon
                  icon={faSearch}
                  className="w-5 h-5 text-text-muted absolute left-4 top-1/2 -translate-y-1/2"
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activeCategory === cat
                        ? "bg-brand text-white shadow-md shadow-brand/20"
                        : "bg-bg-card-hover text-text-muted border border-border-ui hover:text-text-primary hover:bg-border-ui/30"
                    }`}
                  >
                    {t.categories[cat]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TOOLS GRID */}
        <section
          id="tools-section"
          className="flex flex-col gap-8 scroll-mt-24"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col gap-1 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl text-text-primary">
                {t.categories[activeCategory]} ({filteredTools.length})
              </h2>
              <p className="text-sm text-text-muted">{t.toolsDesc}</p>
            </div>
          </div>

          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="group bg-bg-card border border-border-ui rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 card-glow flex flex-col justify-between"
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-bg-card-hover border border-border-ui flex items-center justify-center transition-all group-hover:bg-brand/10 group-hover:border-brand/20">
                        {tool.icon}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-bg-card-hover border border-border-ui text-text-muted">
                          {tool.category}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded ${
                            tool.status === t.ready
                              ? "bg-accent/10 border border-accent/20 text-accent"
                              : "bg-secondary/10 border border-secondary/20 text-secondary"
                          }`}
                        >
                          {tool.status}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-brand transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed mb-6">
                      {tool.description}
                    </p>
                  </div>

                  {/* Actions */}
                  {tool.status === t.ready ? (
                    <Link
                      href={tool.target}
                      className="w-full py-3 rounded-xl bg-bg-card-hover border border-border-ui text-center text-sm font-semibold text-text-primary hover:bg-brand hover:text-white hover:border-brand transition-all flex items-center justify-center gap-2"
                    >
                      {t.getStarted}
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        className="w-4 h-4 transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 rounded-xl bg-bg-page/50 border border-border-ui/50 text-center text-sm font-semibold text-text-muted/60 cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {t.underDev}
                      <FontAwesomeIcon icon={faLock} className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 border border-dashed border-border-ui rounded-3xl text-center flex flex-col items-center justify-center">
              <FontAwesomeIcon
                icon={faFaceFrown}
                className="w-12 h-12 text-text-muted mb-4"
              />
              <h3 className="font-display text-lg text-text-primary mb-1">
                {t.noToolsTitle}
              </h3>
              <p className="text-sm text-text-muted">{t.noToolsDesc}</p>
            </div>
          )}
        </section>
      </main>

      {/* FOOTER */}
      <Footer lang={lang} />
    </div>
  );
}
