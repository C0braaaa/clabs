"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TRANSLATIONS } from "../../translations";
import QRCode from "qrcode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faQrcode,
  faSliders,
  faPalette,
  faImage,
  faDownload,
  faCopy,
  faTrash,
  faLink,
  faWifi,
  faEnvelope,
  faPhone,
  faCircleNotch,
  faPuzzlePiece,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

export default function QrGenerator() {
  // Theme & Language
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("vi");

  // QR Input States
  const [inputType, setInputType] = useState("text"); // text, wifi, email, phone
  const [textVal, setTextVal] = useState("");
  
  // Wi-Fi States
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPass, setWifiPass] = useState("");
  const [wifiSec, setWifiSec] = useState("WPA");

  // Email States
  const [emailTo, setEmailTo] = useState("");
  const [emailSub, setEmailSub] = useState("");
  const [emailBody, setEmailBody] = useState("");

  // Phone State
  const [phoneVal, setPhoneVal] = useState("");

  // Styling States
  const [fgColor, setFgColor] = useState("#0284c7");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(400);
  const [qrMargin, setQrMargin] = useState(2);
  const [errorLevel, setErrorLevel] = useState("Q"); // L, M, Q, H

  // Logo States
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState("");
  const [logoSizePercent, setLogoSizePercent] = useState(20); // 10% to 25%

  // Output Preview State
  const [previewSrc, setPreviewSrc] = useState("");
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize theme & language from localStorage
  useEffect(() => {
    const root = document.documentElement;
    const savedTheme =
      localStorage.getItem("theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.add("light");
      root.classList.remove("dark");
    }

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

  // Helper to compose data based on tab selected
  const getQRData = () => {
    switch (inputType) {
      case "wifi":
        // Format: WIFI:S:SSID;T:WPA;P:PASSWORD;;
        const sec = wifiSec === "None" ? "" : wifiSec;
        return `WIFI:S:${wifiSsid};T:${sec};P:${wifiPass};;`;
      case "email":
        // Format: mailto:to?subject=sub&body=body
        const subject = encodeURIComponent(emailSub);
        const body = encodeURIComponent(emailBody);
        return `mailto:${emailTo}?subject=${subject}&body=${body}`;
      case "phone":
        // Format: tel:number
        return `tel:${phoneVal}`;
      case "text":
      default:
        return textVal || "https://clabs.co";
    }
  };

  // Generate QR Code on canvas and output image
  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const data = getQRData();
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Generate base QR using qrcode library options
      const qrOpts = {
        errorCorrectionLevel: errorLevel,
        width: qrSize,
        margin: qrMargin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      };

      // Draw QR directly onto the virtual canvas
      await QRCode.toCanvas(canvas, data, qrOpts);

      // Draw logo overlay if exists
      if (logoPreviewUrl) {
        const ctx = canvas.getContext("2d");
        const logoImg = new Image();
        logoImg.src = logoPreviewUrl;
        
        await new Promise((resolve) => {
          logoImg.onload = () => {
            // Logo dimension sizing
            const qrWidth = canvas.width;
            const logoSize = qrWidth * (logoSizePercent / 100);
            const x = (qrWidth - logoSize) / 2;
            const y = (qrWidth - logoSize) / 2;

            // Draw white background container for logo to make it clean
            ctx.fillStyle = bgColor;
            const borderSize = logoSize * 0.15; // 15% padding
            ctx.beginPath();
            ctx.roundRect(
              x - borderSize, 
              y - borderSize, 
              logoSize + borderSize * 2, 
              logoSize + borderSize * 2, 
              logoSize * 0.25 // rounded corners
            );
            ctx.fill();

            // Draw logo image
            ctx.drawImage(logoImg, x, y, logoSize, logoSize);
            resolve();
          };
          logoImg.onerror = () => resolve(); // skip on error
        });
      }

      // Convert canvas drawing to Image Source for displaying
      setPreviewSrc(canvas.toDataURL("image/png"));
    } catch (err) {
      console.error("QR Generation error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Re-generate QR whenever values change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      generateQRCode();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [
    inputType,
    textVal,
    wifiSsid,
    wifiPass,
    wifiSec,
    emailTo,
    emailSub,
    emailBody,
    phoneVal,
    fgColor,
    bgColor,
    qrSize,
    qrMargin,
    errorLevel,
    logoPreviewUrl,
    logoSizePercent
  ]);

  // Color preset handlers
  const applyPreset = (fg, bg) => {
    setFgColor(fg);
    setBgColor(bg);
  };

  // File Upload Handlers
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoPreviewUrl(url);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreviewUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Downloads
  const downloadPng = () => {
    const link = document.createElement("a");
    link.download = `clabs-qrcode-${Date.now()}.png`;
    link.href = previewSrc;
    link.click();
  };

  const downloadJpeg = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // JPEG requires solid background instead of transparency
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const ctx = tempCanvas.getContext("2d");
    
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    ctx.drawImage(canvas, 0, 0);

    const link = document.createElement("a");
    link.download = `clabs-qrcode-${Date.now()}.jpg`;
    link.href = tempCanvas.toDataURL("image/jpeg", 0.95);
    link.click();
  };

  const downloadSvg = async () => {
    try {
      const data = getQRData();
      const qrOpts = {
        errorCorrectionLevel: errorLevel,
        margin: qrMargin,
        color: {
          dark: fgColor,
          light: bgColor,
        },
      };

      const svgStr = await QRCode.toString(data, {
        type: "svg",
        ...qrOpts,
      });

      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `clabs-qrcode-${Date.now()}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = async () => {
    try {
      const response = await fetch(previewSrc);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col grid-bg">
      {/* HEADER */}
      <Header theme={theme} toggleTheme={toggleTheme} lang={lang} setLang={setLang} />

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-8">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold text-text-muted hover:text-brand transition-colors group cursor-pointer"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="transition-transform group-hover:-translate-x-1" />
            <span>{t.qrGen.backHome}</span>
          </Link>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl text-text-primary flex items-center gap-3">
            <FontAwesomeIcon icon={faQrcode} className="text-brand" />
            <span>{t.qrGen.title}</span>
          </h1>
          <p className="text-sm text-text-muted">{t.qrGen.subtitle}</p>
        </div>

        {/* Workspace Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Panel: Configuration Form */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Input Type Selector Tabs */}
            <div className="bg-bg-card border border-border-ui rounded-2xl p-1.5 flex flex-wrap gap-1">
              {[
                { id: "text", label: t.qrGen.inputText, icon: faLink },
                { id: "wifi", label: t.qrGen.inputWifi, icon: faWifi },
                { id: "email", label: t.qrGen.inputEmail, icon: faEnvelope },
                { id: "phone", label: t.qrGen.inputPhone, icon: faPhone }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setInputType(tab.id)}
                  className={`flex-1 min-w-[110px] py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
                    inputType === tab.id
                      ? "bg-brand text-white shadow-md shadow-brand/10"
                      : "text-text-muted hover:text-text-primary hover:bg-bg-card-hover"
                  }`}
                >
                  <FontAwesomeIcon icon={tab.icon} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Input Fields Content */}
            <div className="bg-bg-card border border-border-ui rounded-2xl p-6 shadow-sm">
              {inputType === "text" && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    {t.qrGen.inputText}
                  </label>
                  <textarea
                    value={textVal}
                    onChange={(e) => setTextVal(e.target.value)}
                    placeholder={t.qrGen.placeholderText}
                    rows={4}
                    className="w-full p-4 bg-bg-card-hover border border-border-ui rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 text-text-primary placeholder-text-muted transition-all resize-none"
                  />
                </div>
              )}

              {inputType === "wifi" && (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1.5 relative">
                        <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                          {lang === "vi" ? "Tên Wi-Fi (SSID)" : "Wi-Fi Name (SSID)"}
                        </label>
                        <div className="relative inline-block cursor-help text-text-muted hover:text-brand transition-colors group">
                          <FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5" />
                          {/* Tooltip Content */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-bg-card border border-border-ui text-text-primary text-xs font-normal normal-case leading-relaxed rounded-xl shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-30">
                            {lang === "vi" ? (
                              <>
                                <strong>SSID (Service Set Identifier):</strong> Là tên mạng Wi-Fi hiển thị trên thiết bị của bạn khi dò tìm kết nối (ví dụ: <em>CLabs_Guest</em>, <em>Home_WiFi</em>). Nhập chính xác tên này để thiết bị quét mã QR có thể nhận diện và kết nối tự động.
                              </>
                            ) : (
                              <>
                                <strong>SSID (Service Set Identifier):</strong> The public name of your Wi-Fi network shown on devices scanning for connections (e.g. <em>CLabs_Guest</em>, <em>Home_WiFi</em>). Enter this exactly so scanning devices can connect automatically.
                              </>
                            )}
                            {/* Triangle arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-bg-card"></div>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-border-ui -z-10 mt-px"></div>
                          </div>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={wifiSsid}
                        onChange={(e) => setWifiSsid(e.target.value)}
                        placeholder="e.g. CLabs_WiFi"
                        className="w-full px-4 py-3 bg-bg-card-hover border border-border-ui rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 text-text-primary placeholder-text-muted transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                        {t.qrGen.placeholderWifiPass}
                      </label>
                      <input
                        type="password"
                        value={wifiPass}
                        onChange={(e) => setWifiPass(e.target.value)}
                        placeholder="Password..."
                        className="w-full px-4 py-3 bg-bg-card-hover border border-border-ui rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 text-text-primary placeholder-text-muted transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      {t.qrGen.wifiSecType}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {["WPA", "WEP", "None"].map((sec) => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setWifiSec(sec)}
                          className={`py-2.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                            wifiSec === sec
                              ? "bg-brand/10 text-brand border-brand"
                              : "bg-bg-card-hover border-border-ui text-text-muted hover:text-text-primary"
                          }`}
                        >
                          {sec === "None" ? t.qrGen.wifiSecNone : sec}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {inputType === "email" && (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      {t.qrGen.placeholderEmailTo}
                    </label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      placeholder="hello@example.com"
                      className="w-full px-4 py-3 bg-bg-card-hover border border-border-ui rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 text-text-primary placeholder-text-muted transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      {t.qrGen.placeholderEmailSub}
                    </label>
                    <input
                      type="text"
                      value={emailSub}
                      onChange={(e) => setEmailSub(e.target.value)}
                      placeholder="Subject..."
                      className="w-full px-4 py-3 bg-bg-card-hover border border-border-ui rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 text-text-primary placeholder-text-muted transition-all"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                      {t.qrGen.placeholderEmailBody}
                    </label>
                    <textarea
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      placeholder="Message body..."
                      rows={3}
                      className="w-full p-4 bg-bg-card-hover border border-border-ui rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 text-text-primary placeholder-text-muted transition-all resize-none"
                    />
                  </div>
                </div>
              )}

              {inputType === "phone" && (
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-text-primary uppercase tracking-wider">
                    {t.qrGen.placeholderPhone}
                  </label>
                  <input
                    type="tel"
                    value={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.value)}
                    placeholder="+84 987 654 321"
                    className="w-full px-4 py-3 bg-bg-card-hover border border-border-ui rounded-xl text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 text-text-primary placeholder-text-muted transition-all"
                  />
                </div>
              )}
            </div>

            {/* Colors Section */}
            <div className="bg-bg-card border border-border-ui rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-display text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-ui pb-3">
                <FontAwesomeIcon icon={faPalette} className="text-brand" />
                <span>{t.qrGen.sectionColors}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* FG Color */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-text-muted">{t.qrGen.colorFg}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-12 h-10 rounded-lg border border-border-ui cursor-pointer p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-28 px-3 py-2 bg-bg-card-hover border border-border-ui rounded-lg text-xs font-semibold focus:outline-none text-text-primary uppercase"
                    />
                  </div>
                </div>

                {/* BG Color */}
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-text-muted">{t.qrGen.colorBg}</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-12 h-10 rounded-lg border border-border-ui cursor-pointer p-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-28 px-3 py-2 bg-bg-card-hover border border-border-ui rounded-lg text-xs font-semibold focus:outline-none text-text-primary uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Color Presets */}
              <div className="flex flex-col gap-2 pt-2">
                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">
                  {t.qrGen.colorPreset}
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "CLabs Blue", fg: "#0284c7", bg: "#ffffff" },
                    { name: "Mint Emerald", fg: "#10b981", bg: "#ffffff" },
                    { name: "Velvet Purple", fg: "#8b5cf6", bg: "#ffffff" },
                    { name: "Obsidian", fg: "#0f172a", bg: "#ffffff" },
                    { name: "Cyberpunk", fg: "#38bdf8", bg: "#090c15" },
                    { name: "Gold Luxury", fg: "#d97706", bg: "#ffffff" }
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => applyPreset(preset.fg, preset.bg)}
                      className="px-2.5 py-1.5 rounded-lg border border-border-ui bg-bg-card-hover hover:border-brand transition-all text-xs font-semibold text-text-primary flex items-center gap-1.5 cursor-pointer"
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                        style={{ background: `linear-gradient(135deg, ${preset.fg} 50%, ${preset.bg} 50%)` }}
                      ></span>
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Design & Size Controls */}
            <div className="bg-bg-card border border-border-ui rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-display text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-ui pb-3">
                <FontAwesomeIcon icon={faSliders} className="text-brand" />
                <span>{t.qrGen.sectionDesign}</span>
              </h3>

              <div className="flex flex-col gap-4">
                {/* Size Resolution Slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-text-muted">
                    <span>{t.qrGen.optionSize}</span>
                    <span className="text-text-primary">{qrSize}x{qrSize} px</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="800"
                    step="50"
                    value={qrSize}
                    onChange={(e) => setQrSize(Number(e.target.value))}
                    className="w-full accent-brand bg-bg-card-hover rounded-lg h-2 cursor-pointer"
                  />
                </div>

                {/* Margin Slider */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-text-muted">
                    <span>{t.qrGen.optionMargin}</span>
                    <span className="text-text-primary">{qrMargin} blocks</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="6"
                    step="1"
                    value={qrMargin}
                    onChange={(e) => setQrMargin(Number(e.target.value))}
                    className="w-full accent-brand bg-bg-card-hover rounded-lg h-2 cursor-pointer"
                  />
                </div>

                {/* Error Correction Level dropdown */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 relative">
                    <span className="text-xs font-bold text-text-muted">{t.qrGen.optionError}</span>
                    <div className="relative inline-block cursor-help text-text-muted hover:text-brand transition-colors group">
                      <FontAwesomeIcon icon={faCircleInfo} className="w-3.5 h-3.5" />
                      {/* Tooltip Content */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-bg-card border border-border-ui text-text-primary text-xs font-normal leading-relaxed rounded-xl shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-30">
                        {lang === "vi" ? (
                          <>
                            <strong>Khả năng sửa lỗi (Error Correction):</strong> Giúp mã QR vẫn quét được nếu bị bẩn hoặc bị che khuất một phần (như khi chèn logo).
                            <div className="mt-1.5 grid grid-cols-2 gap-1 font-semibold text-[10px]">
                              <span>L: Thấp (~7%)</span>
                              <span>M: TB (~15%)</span>
                              <span>Q: Khá (~25%)</span>
                              <span>H: Cao (~30%)</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <strong>Error Correction Level:</strong> Allows the QR code to be scanned even if dirty or partially covered (e.g. by a logo).
                            <div className="mt-1.5 grid grid-cols-2 gap-1 font-semibold text-[10px]">
                              <span>L: Low (~7%)</span>
                              <span>M: Med (~15%)</span>
                              <span>Q: Quart (~25%)</span>
                              <span>H: High (~30%)</span>
                            </div>
                          </>
                        )}
                        {/* Triangle arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-bg-card"></div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-border-ui -z-10 mt-px"></div>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { key: "L", label: t.qrGen.errorL },
                      { key: "M", label: t.qrGen.errorM },
                      { key: "Q", label: t.qrGen.errorQ },
                      { key: "H", label: t.qrGen.errorH }
                    ].map((lvl) => (
                      <button
                        key={lvl.key}
                        onClick={() => setErrorLevel(lvl.key)}
                        className={`py-2 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          errorLevel === lvl.key
                            ? "bg-brand text-white border-brand shadow-sm shadow-brand/10"
                            : "bg-bg-card-hover border-border-ui text-text-muted hover:text-text-primary"
                        }`}
                        title={lvl.label}
                      >
                        {lvl.key} ({lvl.key === "L" ? "7%" : lvl.key === "M" ? "15%" : lvl.key === "Q" ? "25%" : "30%"})
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Logo Overlay Section */}
            <div className="bg-bg-card border border-border-ui rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-display text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2 border-b border-border-ui pb-3">
                <FontAwesomeIcon icon={faImage} className="text-brand" />
                <span>{t.qrGen.sectionLogo}</span>
              </h3>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  {/* File selector input */}
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2.5 rounded-xl border border-dashed border-brand/40 bg-brand/5 hover:bg-brand/10 transition-colors text-xs font-bold text-brand cursor-pointer"
                  >
                    <FontAwesomeIcon icon={faImage} className="mr-2" />
                    {t.qrGen.logoLabel}
                  </button>

                  {logoPreviewUrl && (
                    <button
                      onClick={removeLogo}
                      className="px-4 py-2.5 rounded-xl border border-secondary/20 bg-secondary/5 hover:bg-secondary/10 transition-colors text-xs font-bold text-secondary cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faTrash} className="mr-2" />
                      {t.qrGen.removeLogo}
                    </button>
                  )}
                </div>

                <p className="text-xs text-text-muted">{t.qrGen.logoHelp}</p>

                {logoPreviewUrl && (
                  <div className="flex flex-col gap-4 border border-border-ui/50 rounded-xl p-4 bg-bg-card-hover/40">
                    <div className="flex items-center gap-4">
                      {/* Logo Preview box */}
                      <div className="w-12 h-12 rounded-lg border border-border-ui bg-white flex items-center justify-center p-1.5">
                        <img
                          src={logoPreviewUrl}
                          alt="Logo Preview"
                          className="max-w-full max-h-full object-contain rounded"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between text-xs font-bold text-text-muted">
                          <span>Logo scale size</span>
                          <span className="text-text-primary">{logoSizePercent}%</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="25"
                          step="1"
                          value={logoSizePercent}
                          onChange={(e) => setLogoSizePercent(Number(e.target.value))}
                          className="w-full accent-brand h-1 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Panel: Live Preview Frame */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 flex flex-col gap-6">
            
            <div className="bg-bg-card border border-border-ui rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col items-center gap-6">
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-brand/10 to-transparent rounded-full blur-xl"></div>
              
              <div className="w-full border-b border-border-ui pb-3 text-center lg:text-left">
                <h3 className="font-display text-base font-bold text-text-primary">
                  {t.qrGen.previewTitle}
                </h3>
              </div>

              {/* Main Visual QR Box Container */}
              <div 
                className="w-full max-w-[340px] aspect-square rounded-2xl border border-border-ui p-6 flex items-center justify-center relative transition-all shadow-inner"
                style={{ backgroundColor: bgColor }}
              >
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt="CLabs QR Code Live Preview"
                    className="w-full h-full object-contain select-none"
                  />
                ) : (
                  <div className="text-center p-6 flex flex-col items-center justify-center gap-3">
                    <FontAwesomeIcon icon={faQrcode} className="text-border-ui text-5xl animate-pulse" />
                    <p className="text-xs text-text-muted leading-relaxed">
                      {t.qrGen.previewPlaceholder}
                    </p>
                  </div>
                )}

                {/* Virtual hidden Canvas used to compile image */}
                <canvas ref={canvasRef} className="hidden" />

                {isGenerating && (
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
                    <FontAwesomeIcon icon={faCircleNotch} className="text-brand text-2xl animate-spin" />
                  </div>
                )}
              </div>

              {/* Actions Box */}
              {previewSrc && (
                <div className="w-full flex flex-col gap-3">
                  {/* Copy Image Button */}
                  <button
                    onClick={copyToClipboard}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      copied
                        ? "bg-accent text-white"
                        : "bg-brand text-white hover:bg-brand-hover shadow-lg shadow-brand/10"
                    }`}
                  >
                    <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
                    <span>{copied ? t.qrGen.copySuccess : t.qrGen.btnCopy}</span>
                  </button>

                  {/* Download Formats Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={downloadPng}
                      className="py-2.5 rounded-lg border border-border-ui bg-bg-card-hover hover:border-brand/40 text-text-primary transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faDownload} className="text-text-muted" />
                      <span>PNG</span>
                    </button>

                    <button
                      onClick={downloadJpeg}
                      className="py-2.5 rounded-lg border border-border-ui bg-bg-card-hover hover:border-brand/40 text-text-primary transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faDownload} className="text-text-muted" />
                      <span>JPEG</span>
                    </button>

                    <button
                      onClick={downloadSvg}
                      className="py-2.5 rounded-lg border border-border-ui bg-bg-card-hover hover:border-brand/40 text-text-primary transition-all text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faDownload} className="text-text-muted" />
                      <span>SVG</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* FOOTER */}
      <Footer lang={lang} />
    </div>
  );
}
