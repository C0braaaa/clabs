"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { TRANSLATIONS } from "../../translations";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faFilePdf,
  faFileWord,
  faFileExcel,
  faFileImage,
  faUpload,
  faSpinner,
  faCheckCircle,
  faDownload,
  faTimes,
  faSyncAlt,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

// Generates valid structural documents that can be opened successfully in standard software
const generateValidFileBlob = (toolId, fileName) => {
  const dateStr = new Date().toLocaleString();

  switch (toolId) {
    case "pdf-to-word": {
      const docContent = `
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>CLabs Converted Document</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
    h2 { color: #0284c7; }
    .footer { font-size: 11px; color: #64748b; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  </style>
</head>
<body>
  <h2>CLabs Document Converter</h2>
  <p>Tài liệu này được chuyển đổi thành công bởi hệ thống CLabs.</p>
  <p><strong>Tên tệp gốc:</strong> ${fileName}</p>
  <p><strong>Thời gian thực hiện:</strong> ${dateStr}</p>
  <hr/>
  <p>Nội dung từ tệp PDF gốc đã được phân tích cấu trúc và lưu dưới định dạng Word (.docx) tương thích hoàn toàn.</p>
  <p>Bạn có thể thêm, sửa, xóa văn bản và định dạng bảng biểu tùy ý trực tiếp trong Microsoft Word.</p>
  <div class="footer">CLabs © ${new Date().getFullYear()} - All-in-One Utility Suite</div>
</body>
</html>
`;
      return new Blob([docContent], { type: "application/msword" });
    }

    case "word-to-pdf":
    case "image-to-pdf": {
      const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 5 0 R >> >> /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 150 >>
stream
BT
/F1 14 Tf
70 700 Td
(CLabs Document Converter) Tj
0 -40 Td
(Successfully converted to PDF) Tj
0 -30 Td
(Original File: ${fileName}) Tj
0 -30 Td
(Date: ${dateStr}) Tj
0 -30 Td
(Enjoy your clean PDF file!) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000056 00000 n 
0000000111 00000 n 
0000000222 00000 n 
0000000422 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
492
%%EOF
`;
      return new Blob([pdfContent], { type: "application/pdf" });
    }

    case "pdf-to-excel": {
      const xlsContent = `
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head>
  <meta charset="utf-8">
  <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Sheet1</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
  <style>
    th { background-color: #0284c7; color: white; font-weight: bold; }
    td, th { border: 1px solid #cbd5e1; text-align: left; padding: 6px; }
  </style>
</head>
<body>
  <table>
    <tr>
      <th colspan="3">CLabs Converted Excel Sheet</th>
    </tr>
    <tr>
      <td><b>Tên tệp gốc:</b></td>
      <td colspan="2">${fileName}</td>
    </tr>
    <tr>
      <td><b>Ngày chuyển đổi:</b></td>
      <td colspan="2">${dateStr}</td>
    </tr>
    <tr>
      <th>STT</th>
      <th>Dữ liệu trích xuất</th>
      <th>Trạng thái</th>
    </tr>
    <tr>
      <td>1</td>
      <td>Dữ liệu bảng PDF Trang 1</td>
      <td>Đã xử lý</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Dữ liệu bảng PDF Trang 2</td>
      <td>Đã xử lý</td>
    </tr>
  </table>
</body>
</html>
`;
      return new Blob([xlsContent], { type: "application/vnd.ms-excel" });
    }

    default:
      return new Blob(["mock-converted-data"], { type: "text/plain" });
  }
};

const CONVERSION_TOOLS = [
  {
    id: "pdf-to-word",
    icon: faFileWord,
    accept: ".pdf",
    mimeType: "application/pdf",
    outputExt: ".docx",
    outputMime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    iconColor: "text-blue-500",
    labelVi: "PDF sang Word",
    labelEn: "PDF to Word",
    descVi: "Chuyển đổi tài liệu PDF sang định dạng Microsoft Word (.docx) chất lượng cao.",
    descEn: "Convert PDF documents to Microsoft Word (.docx) format with high fidelity.",
  },
  {
    id: "word-to-pdf",
    icon: faFilePdf,
    accept: ".doc,.docx",
    mimeType: "application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    outputExt: ".pdf",
    outputMime: "application/pdf",
    iconColor: "text-red-500",
    labelVi: "Word sang PDF",
    labelEn: "Word to PDF",
    descVi: "Chuyển đổi tài liệu Word (.docx, .doc) sang tệp PDF định dạng chuẩn.",
    descEn: "Convert Word documents (.docx, .doc) to standard PDF files.",
  },
  {
    id: "pdf-to-excel",
    icon: faFileExcel,
    accept: ".pdf",
    mimeType: "application/pdf",
    outputExt: ".xlsx",
    outputMime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    iconColor: "text-emerald-500",
    labelVi: "PDF sang Excel",
    labelEn: "PDF to Excel",
    descVi: "Trích xuất bảng biểu từ PDF sang bảng tính Microsoft Excel (.xlsx).",
    descEn: "Extract tabular data from PDF files to Microsoft Excel (.xlsx) spreadsheets.",
  },
  {
    id: "pdf-to-image",
    icon: faFileImage,
    accept: ".pdf",
    mimeType: "application/pdf",
    outputExt: ".png",
    outputMime: "image/png",
    iconColor: "text-amber-500",
    labelVi: "PDF sang Ảnh",
    labelEn: "PDF to Image",
    descVi: "Chuyển đổi các trang tài liệu PDF thành các hình ảnh định dạng PNG/JPEG.",
    descEn: "Convert pages of a PDF document into high-resolution PNG/JPEG images.",
  },
  {
    id: "image-to-pdf",
    icon: faFilePdf,
    accept: ".png,.jpg,.jpeg,.webp",
    mimeType: "image/png,image/jpeg,image/webp",
    outputExt: ".pdf",
    outputMime: "application/pdf",
    iconColor: "text-red-500",
    labelVi: "Ảnh sang PDF",
    labelEn: "Image to PDF",
    descVi: "Chuyển đổi và ghép các tệp hình ảnh thành một tệp tài liệu PDF thống nhất.",
    descEn: "Convert and compile multiple images into a single cohesive PDF document.",
  },
];

export default function PdfConverter() {
  // Theme & Language
  const [theme, setTheme] = useState("dark");
  const [lang, setLang] = useState("vi");

  // Selection state
  const [activeTool, setActiveTool] = useState(CONVERSION_TOOLS[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // File States
  const [selectedFile, setSelectedFile] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Progress States
  const [progressStage, setProgressStage] = useState("idle"); // idle, uploading, parsing, converting, finalizing, done
  const [progressPercent, setProgressPercent] = useState(0);
  const [resultFileUrl, setResultFileUrl] = useState("");

  const fileInputRef = useRef(null);

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

  // Handle active tool change (resets states)
  const selectTool = (tool) => {
    setActiveTool(tool);
    resetConverter();
    setIsDropdownOpen(false);
  };

  const resetConverter = () => {
    setSelectedFile(null);
    setErrorMsg("");
    setProgressStage("idle");
    setProgressPercent(0);
    setResultFileUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Validate File size and type
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setErrorMsg("");
    // Check file size (limit 10MB)
    const limitBytes = 10 * 1024 * 1024;
    if (file.size > limitBytes) {
      setErrorMsg(t.pdfConv.errorSize);
      return;
    }

    // Check file type
    const fileExt = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
    const acceptedExtensions = activeTool.accept.split(",");
    const isAccepted = acceptedExtensions.some((ext) => {
      if (ext.startsWith(".")) {
        return fileExt === ext;
      }
      return false;
    });

    if (!isAccepted) {
      setErrorMsg(t.pdfConv.errorType);
      return;
    }

    setSelectedFile(file);
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) validateAndSetFile(file);
  };

  // Start conversion (simulated process)
  const startConversion = () => {
    if (!selectedFile) return;

    setProgressStage("uploading");
    setProgressPercent(10);

    // Simulated progress stage durations
    const runStage = (stage, startPercent, endPercent, duration, nextStageCallback) => {
      setProgressStage(stage);
      let currentPercent = startPercent;
      const intervalTime = duration / (endPercent - startPercent);

      const timer = setInterval(() => {
        currentPercent += 1;
        setProgressPercent(currentPercent);
        if (currentPercent >= endPercent) {
          clearInterval(timer);
          nextStageCallback();
        }
      }, intervalTime);
    };

    // Stage 1: Uploading (10% to 30%)
    setTimeout(() => {
      runStage("uploading", 10, 30, 800, () => {
        // Stage 2: Parsing (30% to 60%)
        runStage("parsing", 30, 60, 1200, () => {
          // Stage 3: Converting (60% to 90%)
          runStage("converting", 60, 90, 1500, () => {
            // Stage 4: Finalizing (90% to 100%)
            runStage("finalizing", 90, 100, 800, () => {
              // Completed!
              setProgressStage("done");
              
              if (activeTool.id === "pdf-to-image") {
                const canvas = document.createElement("canvas");
                canvas.width = 800;
                canvas.height = 1000;
                const ctx = canvas.getContext("2d");

                // Draw background
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, 800, 1000);

                // Draw header banner
                ctx.fillStyle = "#0284c7";
                ctx.fillRect(0, 0, 800, 150);

                // Draw header text
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 28px Arial";
                ctx.fillText("CLabs PDF to Image Converter", 50, 85);

                // Draw file info
                ctx.fillStyle = "#334155";
                ctx.font = "20px Arial";
                ctx.fillText(`File goc: ${selectedFile ? selectedFile.name : "Document.pdf"}`, 50, 250);
                ctx.fillText(`Ngay chuyen doi: ${new Date().toLocaleString()}`, 50, 300);

                // Draw content mock
                ctx.fillStyle = "#64748b";
                ctx.font = "italic 18px Arial";
                ctx.fillText("--- Trang 1 cua tai lieu PDF da duoc trich xuat thanh cong ---", 50, 400);

                // Draw dummy document visual blocks
                ctx.fillStyle = "#e2e8f0";
                ctx.fillRect(50, 450, 700, 20);
                ctx.fillRect(50, 490, 700, 20);
                ctx.fillRect(50, 530, 500, 20);

                // Draw watermark
                ctx.fillStyle = "#cbd5e1";
                ctx.font = "bold 40px Arial";
                ctx.fillText("CLABS PREVIEW", 220, 800);

                canvas.toBlob((blob) => {
                  if (blob) {
                    const mockUrl = URL.createObjectURL(blob);
                    setResultFileUrl(mockUrl);
                  }
                }, "image/png");
              } else {
                const blob = generateValidFileBlob(activeTool.id, selectedFile ? selectedFile.name : "document");
                const mockUrl = URL.createObjectURL(blob);
                setResultFileUrl(mockUrl);
              }
            });
          });
        });
      });
    }, 400);
  };

  const triggerFileSelect = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  // Get active label based on language
  const getToolLabel = (tool) => {
    return lang === "vi" ? tool.labelVi : tool.labelEn;
  };

  const getToolDesc = (tool) => {
    return lang === "vi" ? tool.descVi : tool.descEn;
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
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
            <span>{t.pdfConv.backHome}</span>
          </Link>
        </div>

        {/* Title Block */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl text-text-primary flex items-center gap-3">
            <FontAwesomeIcon icon={faFilePdf} className="text-secondary" />
            <span>{t.pdfConv.title}</span>
          </h1>
          <p className="text-sm text-text-muted max-w-2xl">{t.pdfConv.subtitle}</p>
        </div>

        {/* WORKSPACE LAYOUT */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR (Desktop) / TOP DROPDOWN (Mobile) */}
          <div className="w-full lg:w-80 flex flex-col gap-4">
            
            {/* Mobile Dropdown Header Selector */}
            <div className="block lg:hidden relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 bg-bg-card border border-border-ui rounded-xl text-sm font-semibold text-text-primary flex items-center justify-between cursor-pointer shadow-md hover:bg-bg-card-hover transition-all"
              >
                <div className="flex items-center gap-3">
                  <FontAwesomeIcon icon={activeTool.icon} className={`${activeTool.iconColor} w-5 h-5`} />
                  <span>{getToolLabel(activeTool)}</span>
                </div>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`w-4 h-4 text-text-muted transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                  <div className="absolute left-0 right-0 mt-2 rounded-xl bg-bg-card border border-border-ui shadow-2xl p-2 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    {CONVERSION_TOOLS.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => selectTool(tool)}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold flex items-center gap-3 transition-colors cursor-pointer ${
                          activeTool.id === tool.id
                            ? "bg-brand/10 text-brand"
                            : "text-text-primary hover:bg-bg-card-hover"
                        }`}
                      >
                        <FontAwesomeIcon icon={tool.icon} className={`${tool.iconColor} w-5 h-5`} />
                        <span>{getToolLabel(tool)}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Desktop Sidebar List */}
            <div className="hidden lg:flex flex-col bg-bg-card border border-border-ui rounded-2xl p-4 w-full shadow-lg">
              <h3 className="text-xs uppercase font-bold tracking-wider text-text-muted px-3 mb-3">
                {t.pdfConv.sidebarTitle}
              </h3>
              <div className="flex flex-col gap-1.5">
                {CONVERSION_TOOLS.map((tool) => {
                  const isActive = activeTool.id === tool.id;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => selectTool(tool)}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-sm font-semibold flex items-center gap-3.5 transition-all cursor-pointer ${
                        isActive
                          ? "bg-brand text-white shadow-md shadow-brand/20"
                          : "text-text-muted hover:text-text-primary hover:bg-bg-card-hover border border-transparent hover:border-border-ui"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={tool.icon}
                        className={`w-4.5 h-4.5 transition-colors ${
                          isActive ? "text-white" : tool.iconColor
                        }`}
                      />
                      <span>{getToolLabel(tool)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* MAIN CONVERSION WORKSPACE */}
          <div className="flex-1 w-full bg-bg-card border border-border-ui rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col gap-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-brand/5 to-transparent rounded-full blur-2xl"></div>

            {/* Selection Header Description */}
            <div className="border-b border-border-ui pb-5">
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2 mb-1">
                <span>{getToolLabel(activeTool)}</span>
              </h2>
              <p className="text-sm text-text-muted">{getToolDesc(activeTool)}</p>
            </div>

            {/* ERROR DISPLAY */}
            {errorMsg && (
              <div className="px-4 py-3 rounded-xl border border-red-500/20 bg-red-500/5 text-sm text-red-500 flex items-center justify-between">
                <span>{errorMsg}</span>
                <button onClick={() => setErrorMsg("")} className="hover:text-red-400 cursor-pointer">
                  <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* CONVERSION WORKFLOW CONTAINER */}
            <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
              
              {/* STAGE 1: IDLE - FILE UPLOAD AREA */}
              {progressStage === "idle" && (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`w-full max-w-2xl border-2 border-dashed rounded-2xl py-12 px-6 text-center flex flex-col items-center justify-center gap-4 transition-all cursor-pointer ${
                    isDragging
                      ? "border-brand bg-brand/5 shadow-inner"
                      : "border-border-ui bg-bg-card-hover hover:border-brand/40 hover:bg-border-ui/20"
                  }`}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept={activeTool.accept}
                    className="hidden"
                  />
                  <div className="w-16 h-16 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">
                    <FontAwesomeIcon icon={faUpload} className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <span className="text-sm font-semibold text-text-primary">
                      {selectedFile ? selectedFile.name : t.pdfConv.dragDrop}
                    </span>
                    <span className="text-xs text-text-muted">
                      {t.pdfConv.supportedFiles} {activeTool.accept} (Max 10MB)
                    </span>
                  </div>
                  {selectedFile && (
                    <div className="mt-2 px-4 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-bold">
                      {t.pdfConv.selectedFile}: {formatBytes(selectedFile.size)}
                    </div>
                  )}
                </div>
              )}

              {/* STAGE 2: PROCESSING (Uploading, Parsing, Converting, Finalizing) */}
              {progressStage !== "idle" && progressStage !== "done" && (
                <div className="w-full max-w-md flex flex-col gap-6 items-center">
                  <div className="relative w-20 h-20 flex items-center justify-center">
                    <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 text-brand animate-spin" />
                    <span className="absolute text-xs font-bold text-text-primary">{progressPercent}%</span>
                  </div>
                  
                  <div className="w-full flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-bold text-text-muted">
                      <span>
                        {progressStage === "uploading" && t.pdfConv.uploading}
                        {progressStage === "parsing" && t.pdfConv.parsing}
                        {progressStage === "converting" && t.pdfConv.converting}
                        {progressStage === "finalizing" && t.pdfConv.finalizing}
                      </span>
                      <span>{progressPercent}%</span>
                    </div>
                    {/* Progress Bar Track */}
                    <div className="w-full h-2 bg-bg-card-hover border border-border-ui rounded-full overflow-hidden">
                      <div
                        className="h-full bg-linear-to-r from-brand to-accent transition-all duration-300 rounded-full"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Step status details */}
                  <div className="flex flex-col gap-2.5 w-full text-xs text-text-muted border-t border-border-ui/50 pt-4">
                    <div className="flex items-center justify-between">
                      <span>1. {t.pdfConv.uploading}</span>
                      {progressPercent > 30 ? (
                        <FontAwesomeIcon icon={faCheckCircle} className="text-accent w-4 h-4" />
                      ) : (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className={`w-3.5 h-3.5 ${progressStage === "uploading" ? "animate-spin text-brand" : ""}`}
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>2. {t.pdfConv.parsing}</span>
                      {progressPercent > 60 ? (
                        <FontAwesomeIcon icon={faCheckCircle} className="text-accent w-4 h-4" />
                      ) : (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className={`w-3.5 h-3.5 ${progressStage === "parsing" ? "animate-spin text-brand" : ""}`}
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>3. {t.pdfConv.converting}</span>
                      {progressPercent > 90 ? (
                        <FontAwesomeIcon icon={faCheckCircle} className="text-accent w-4 h-4" />
                      ) : (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className={`w-3.5 h-3.5 ${progressStage === "converting" ? "animate-spin text-brand" : ""}`}
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>4. {t.pdfConv.finalizing}</span>
                      {progressPercent === 100 ? (
                        <FontAwesomeIcon icon={faCheckCircle} className="text-accent w-4 h-4" />
                      ) : (
                        <FontAwesomeIcon
                          icon={faSpinner}
                          className={`w-3.5 h-3.5 ${progressStage === "finalizing" ? "animate-spin text-brand" : ""}`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STAGE 3: COMPLETED & DOWNLOAD */}
              {progressStage === "done" && (
                <div className="w-full max-w-md text-center flex flex-col items-center gap-6">
                  <div className="w-20 h-20 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                    <FontAwesomeIcon icon={faCheckCircle} className="w-10 h-10" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-text-primary">{t.pdfConv.completed}</h3>
                    <p className="text-xs text-text-muted">
                      {selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : ""}{activeTool.outputExt}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full">
                    {/* Download Button */}
                    <a
                      href={resultFileUrl}
                      download={`${selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "result"}${activeTool.outputExt}`}
                      className="flex-1 py-3 px-5 rounded-xl bg-accent text-white font-bold hover:bg-accent-hover transition-all flex items-center justify-center gap-2 shadow-lg shadow-accent/20 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                      <span>{t.pdfConv.downloadBtn}</span>
                    </a>

                    {/* Reset Button */}
                    <button
                      onClick={resetConverter}
                      className="py-3 px-5 rounded-xl border border-border-ui bg-bg-card-hover hover:bg-border-ui/30 text-text-primary font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faSyncAlt} className="w-4 h-4" />
                      <span>{t.pdfConv.convertAnother}</span>
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* ACTION CONTAINER (When file is selected but not yet processing) */}
            {progressStage === "idle" && selectedFile && (
              <div className="flex items-center justify-end gap-3 border-t border-border-ui/50 pt-5 mt-4">
                <button
                  onClick={resetConverter}
                  className="py-2.5 px-4 rounded-xl border border-border-ui hover:bg-bg-card-hover text-text-muted hover:text-text-primary transition-all text-xs font-bold cursor-pointer"
                >
                  {t.pdfConv.convertAnother}
                </button>
                <button
                  onClick={startConversion}
                  className="py-2.5 px-6 rounded-xl bg-brand text-white hover:bg-brand-hover transition-all text-xs font-bold shadow-md shadow-brand/10 cursor-pointer"
                >
                  {t.pdfConv.startConvert}
                </button>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* FOOTER */}
      <Footer lang={lang} />
    </div>
  );
}
