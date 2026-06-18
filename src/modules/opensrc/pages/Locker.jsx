import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaEye, FaExclamationTriangle, FaFilePdf, FaImage } from "react-icons/fa";
import { generateSignature } from "../utils/crypto";
import { getTemplateForCert } from "../utils/certificateTemplates";
import { findUserByQuery } from "../utils/certificateData";
import CertificateHtml from "../components/CertificateHtml";
import { downloadVectorPdf } from "../utils/pdfGenerator";

// Canvas drawing helper function
const drawCertificateOnCanvas = (canvas, template, user, certId, signature) => {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  // Clear canvas
  ctx.clearRect(0, 0, w, h);

  // Theme Colors
  let bgFill = "#050508";
  let primaryStroke = "#3b82f6";
  let secondaryStroke = "#ec4899";
  let titleColor = "#ffffff";
  let accentColor = "#60a5fa";
  let bodyTextColor = "#dfdff2";

  if (template.theme === "gold") {
    bgFill = "#0c0d12";
    primaryStroke = "#fbbf24";
    secondaryStroke = "#d97706";
    titleColor = "#fbbf24";
    accentColor = "#f59e0b";
    bodyTextColor = "#fef08a";
  } else if (template.theme === "emerald") {
    bgFill = "#030805";
    primaryStroke = "#10b981";
    secondaryStroke = "#047857";
    titleColor = "#34d399";
    accentColor = "#059669";
    bodyTextColor = "#d1fae5";
  } else if (template.theme === "light") {
    bgFill = "#fafaf9";
    primaryStroke = "#44403c";
    secondaryStroke = "#78716c";
    titleColor = "#1c1917";
    accentColor = "#44403c";
    bodyTextColor = "#292524";
  }

  // Draw background
  ctx.fillStyle = bgFill;
  ctx.fillRect(0, 0, w, h);

  // Draw Cyber Grid Lines for dark themes
  if (template.theme !== "light") {
    ctx.strokeStyle = "rgba(59, 130, 246, 0.03)";
    ctx.lineWidth = 1;
    const gridSpacing = 40;
    for (let x = 0; x < w; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
  }

  // Draw frame border
  ctx.lineWidth = 6;
  ctx.strokeStyle = primaryStroke;
  ctx.strokeRect(20, 20, w - 40, h - 40);

  ctx.lineWidth = 2;
  ctx.strokeStyle = secondaryStroke;
  ctx.strokeRect(28, 28, w - 56, h - 56);

  // Corner decorative brackets
  ctx.fillStyle = accentColor;
  const bracketSize = 25;
  // Top-Left
  ctx.fillRect(16, 16, bracketSize, 4);
  ctx.fillRect(16, 16, 4, bracketSize);
  // Top-Right
  ctx.fillRect(w - 16 - bracketSize, 16, bracketSize, 4);
  ctx.fillRect(w - 20, 16, 4, bracketSize);
  // Bottom-Left
  ctx.fillRect(16, h - 20, bracketSize, 4);
  ctx.fillRect(16, h - 16 - bracketSize, 4, bracketSize);
  // Bottom-Right
  ctx.fillRect(w - 16 - bracketSize, h - 20, bracketSize, 4);
  ctx.fillRect(w - 20, h - 16 - bracketSize, 4, bracketSize);

  // Title Headers
  ctx.textAlign = "center";
  ctx.fillStyle = accentColor;
  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.fillText("CYSCOM VIT CHENNAI // SECURE CREDENTIAL UPLINK", w / 2, 70);

  ctx.fillStyle = titleColor;
  ctx.font = "900 34px 'General Sans', sans-serif";
  ctx.fillText("CERTIFICATE OF CONTRIBUTION", w / 2, 120);

  // Divider Line
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(w / 2 - 100, 145);
  ctx.lineTo(w / 2 + 100, 145);
  ctx.stroke();

  // "This is to certify that"
  ctx.fillStyle = bodyTextColor;
  ctx.font = "italic 16px 'Georgia', serif";
  ctx.fillText("This is proudly awarded to", w / 2, 190);

  // User Name (Large and bold)
  ctx.fillStyle = titleColor;
  ctx.font = "900 42px 'General Sans', sans-serif";
  ctx.fillText(user.name, w / 2, 250);

  // Description
  const parsedDesc = template.description
    .replace("{NAME}", user.name)
    .replace("{ROLE}", user.role);

  ctx.fillStyle = bodyTextColor;
  ctx.font = "14px 'Courier New', monospace";
  
  // Text Wrap Helper
  const wrapText = (text, x, y, maxWidth, lineHeight) => {
    const words = text.split(" ");
    let line = "";
    let currentY = y;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + " ";
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
  };

  wrapText(parsedDesc, w / 2, 310, 700, 24);

  // Date and details
  ctx.fillStyle = accentColor;
  ctx.font = "11px 'Courier New', monospace";
  ctx.fillText(`ISSUED ON: ${template.date} // CREDENTIAL ID: ${certId}`, w / 2, 420);

  // Signatories
  const sigs = template.signatories || [];
  if (sigs.length > 0) {
    ctx.textAlign = "left";
    ctx.fillStyle = bodyTextColor;
    ctx.font = "bold 13px 'General Sans', sans-serif";
    ctx.fillText(sigs[0].name, 80, 520);
    ctx.font = "11px 'Courier New', monospace";
    ctx.fillStyle = accentColor;
    ctx.fillText(sigs[0].title, 80, 538);
    // Draw signature line
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 500);
    ctx.lineTo(260, 500);
    ctx.stroke();
  }

  if (sigs.length > 1) {
    ctx.textAlign = "right";
    ctx.fillStyle = bodyTextColor;
    ctx.font = "bold 13px 'General Sans', sans-serif";
    ctx.fillText(sigs[1].name, w - 80, 520);
    ctx.font = "11px 'Courier New', monospace";
    ctx.fillStyle = accentColor;
    ctx.fillText(sigs[1].title, w - 80, 538);
    // Draw signature line
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(w - 80, 500);
    ctx.lineTo(w - 260, 500);
    ctx.stroke();
  }

  // Draw Cryptographic Verification hash at bottom left
  ctx.textAlign = "left";
  ctx.fillStyle = template.theme === "light" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.3)";
  ctx.font = "9px 'Courier New', monospace";
  ctx.fillText(`VERIFICATION DIGITAL SIGNATURE: ${signature.slice(0, 32)}...`, 50, h - 45);
  ctx.fillText("THIS CREDENTIAL IS SIGNED CRYPTOGRAPHICALLY AND CANNOT BE ALTERED.", 50, h - 32);

  // Draw QR code and Cyscom logo if preloaded images are provided
  // We draw a nice mock QR placeholder first, and then let the useEffect draw the actual QR image
  ctx.fillStyle = template.theme === "light" ? "#f5f5f4" : "#1e1b4b";
  ctx.fillRect(w - 140, h - 140, 90, 90);
  ctx.strokeStyle = accentColor;
  ctx.strokeRect(w - 140, h - 140, 90, 90);
  ctx.fillStyle = accentColor;
  ctx.font = "bold 9px 'Courier New', monospace";
ctx.textAlign = "center";
  ctx.fillText("SCAN TO VERIFY", w - 95, h - 38);
};

const Locker = () => {
  // Search State
  const [queryId, setQueryId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [hasQueried, setHasQueried] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Refs for Canvas drawing (used for hidden PNG downloads)
  const canvasRefs = useRef({});

  // Redraw Search Certificates on result load
  useEffect(() => {
    if (!searchResult) return;
    
    searchResult.details.forEach(cert => {
      const template = getTemplateForCert(cert.id);
      const signature = generateSignature(cert.id, searchResult.name, template.eventTitle, cert.type, template.date);
      
      const canvas = canvasRefs.current[cert.id];
      if (canvas) {
        drawCertificateOnCanvas(canvas, template, { name: searchResult.name, role: cert.type }, cert.id, signature);
        
        // Asynchronously load real QR code
        const qrImage = new Image();
        qrImage.crossOrigin = "anonymous";
        const verifyUrl = `${window.location.origin}/verify?id=${cert.id}&hash=${signature}`;
        qrImage.onload = () => {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(qrImage, canvas.width - 140, canvas.height - 140, 90, 90);
          }
        };
        qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;

        // Draw Cyscom Logo
        const logoImage = new Image();
        logoImage.src = "/img/logo.png";
        logoImage.onload = () => {
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(logoImage, canvas.width / 2 - 40, 16, 80, 80);
          }
        };
      }
    });
  }, [searchResult]);

  const handleSearch = (e) => {
    e.preventDefault();
    const upperId = queryId.trim().toUpperCase();
    if (!upperId) return;

    setHasQueried(true);
    const result = findUserByQuery(upperId);
    
    if (result) {
      setSearchResult(result);
      setErrorMsg("");
    } else {
      setSearchResult(null);
      setErrorMsg(`Uplink Error: No credentials associated with ID "${upperId}".`);
    }
  };

  const handleReset = () => {
    setQueryId("");
    setSearchResult(null);
    setHasQueried(false);
    setErrorMsg("");
  };

  const handleDownloadPng = (certId, name) => {
    const canvas = canvasRefs.current[certId];
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `${name.replace(/\s+/g, "_")}_Certificate_${certId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handleDownloadPdf = async (certId, name, certType) => {
    const template = getTemplateForCert(certId);
    const signature = generateSignature(certId, name, template.eventTitle, certType, template.date);
    await downloadVectorPdf({
      template,
      user: { name, role: certType },
      certId,
      signature
    });
  };

  const handleOpenInNewPage = (certId, name, certType) => {
    const template = getTemplateForCert(certId);
    const signature = generateSignature(certId, name, template.eventTitle, certType, template.date);
    window.open(`/cert-viewer?id=${certId}&hash=${signature}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10 select-none">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-10" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="px-3 py-1 rounded-full border border-blue-500/20 bg-blue-950/20 text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-3 animate-pulse">
          Secure Credential Node
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white font-zentry tracking-wider uppercase">
          DIGITAL <span className="text-blue-400">LOCKER</span>
        </h1>
        <p className="mt-2 text-xs md:text-sm text-blue-200/50 font-mono">
          Query, inspect, and retrieve Cyscom VIT contribution credentials securely.
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key="tab-search"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
        >
          {!hasQueried || errorMsg ? (
            <div className="max-w-md mx-auto">
              <form onSubmit={handleSearch} className="bg-black/70 border border-blue-900/30 rounded-lg p-6 backdrop-blur-sm shadow-xl shadow-blue-500/5">
                <label className="block text-xs font-mono text-blue-400/80 mb-2 uppercase tracking-widest">
                  Enter Certificate ID / Identifier
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="e.g. VIT-OWASP-001 or CYS-801"
                      value={queryId}
                      onChange={(e) => setQueryId(e.target.value)}
                      className="w-full bg-black border border-blue-900/40 rounded px-3.5 py-2.5 text-xs font-mono text-white placeholder-blue-300/35 focus:outline-none focus:border-blue-500 cursor-target"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 cursor-target"
                  >
                    <FaSearch /> Query
                  </button>
                </div>
                <p className="text-[10px] text-blue-300/30 font-mono mt-3 leading-relaxed">
                  Provide your unique registry code or certificate serial key to pull authenticated database properties.
                </p>
              </form>

              {errorMsg && (
                <div className="mt-4 p-4 border border-red-500/20 bg-red-950/20 rounded-lg text-red-400 text-xs font-mono flex gap-2 items-start animate-shake">
                  <FaExclamationTriangle className="flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block uppercase mb-1">Access Failure</span>
                    {errorMsg}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4 mb-8">
                <div className="text-left font-mono">
                  <span className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold block">Registry Owner</span>
                  <span className="text-lg font-bold text-white uppercase">{searchResult.name}</span>
                </div>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 border border-blue-500/20 bg-blue-950/20 hover:bg-blue-900/20 rounded font-mono text-[10px] uppercase text-blue-400 hover:text-white transition-colors cursor-target"
                >
                  Clear Query
                </button>
              </div>

              {/* Grid Layout of User's Certificates */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center">
                {searchResult.details.map(cert => {
                  const template = getTemplateForCert(cert.id);
                  const signature = generateSignature(cert.id, searchResult.name, template.eventTitle, cert.type, template.date);

                  return (
                    <div
                      key={cert.id}
                      className="w-full max-w-[500px] border border-blue-900/20 bg-black/60 p-4 rounded-lg flex flex-col items-center hover:border-blue-500/20 transition-all duration-300 group shadow-lg"
                    >
                      {/* Responsive Vector HTML Render */}
                      <div className="w-full relative rounded overflow-hidden aspect-[1.414/1] shadow-2xl">
                        <CertificateHtml
                          template={template}
                          user={{ name: searchResult.name, role: cert.type }}
                          certId={cert.id}
                          signature={signature}
                          qrUrl={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                            `${window.location.origin}/verify?id=${cert.id}&hash=${signature}`
                          )}`}
                        />
                        
                        {/* Hidden canvas used solely for drawing high-res PNG downloads */}
                        <canvas
                          ref={el => {
                            if (el) canvasRefs.current[cert.id] = el;
                          }}
                          width={1000}
                          height={707}
                          className="hidden"
                        />
                      </div>

                      {/* Information Meta */}
                      <div className="w-full font-mono mt-4 flex items-center justify-between text-left">
                        <div>
                          <span className="text-[8px] text-blue-400/80 uppercase block">Credential ID</span>
                          <span className="text-xs font-bold text-white">{cert.id}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[8px] text-blue-400/80 uppercase block">Secure Hash</span>
                          <span className="text-[8px] text-blue-200/50 block font-semibold">{signature.slice(0, 16)}...</span>
                        </div>
                      </div>

                      {/* Downloads Actions Bar */}
                      <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-blue-900/10">
                        <button
                          onClick={() => handleOpenInNewPage(cert.id, searchResult.name, cert.type)}
                          className="py-2.5 rounded border border-blue-500/20 bg-blue-950/20 hover:bg-blue-900/20 text-white font-mono text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-target"
                        >
                          <FaEye /> View Full
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(cert.id, searchResult.name, cert.type)}
                          className="py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-mono text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-target"
                        >
                          <FaFilePdf /> Get PDF
                        </button>
                        <button
                          onClick={() => handleDownloadPng(cert.id, searchResult.name)}
                          className="py-2.5 rounded border border-blue-500/20 bg-blue-950/20 hover:bg-blue-900/20 text-white font-mono text-[9px] uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-target"
                        >
                          <FaImage /> Get PNG
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Locker;
