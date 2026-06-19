import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaPrint, FaArrowLeft, FaFilePdf, FaImage, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { generateSignature } from "../utils/crypto";
import { getTemplateForCert } from "../utils/certificateTemplates";
import { apiRequest } from "../utils/api";
import CertificateHtml from "../components/CertificateHtml";
import { downloadVectorPdf } from "../utils/pdfGenerator";

// Canvas drawing helper function (imported style/logic matching Locker.jsx)
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

  // Draw QR code placeholder
  ctx.fillStyle = template.theme === "light" ? "#f5f5f4" : "#1e1b4b";
  ctx.fillRect(w - 140, h - 140, 90, 90);
  ctx.strokeStyle = accentColor;
  ctx.strokeRect(w - 140, h - 140, 90, 90);
  ctx.fillStyle = accentColor;
  ctx.font = "bold 9px 'Courier New', monospace";
  ctx.textAlign = "center";
  ctx.fillText("SCAN TO VERIFY", w - 95, h - 38);
};

const CertViewer = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const certId = searchParams.get("id");
  const urlHash = searchParams.get("hash");

  const [verificationResult, setVerificationResult] = useState({ state: "verifying", data: null, sig: "" });

  useEffect(() => {
    if (!certId || !urlHash) {
      setVerificationResult({ state: "failed", data: null, sig: "" });
      return;
    }

    const verifyCert = async () => {
      try {
        const db = await apiRequest(`/api/certificates`);
        
        let cert = null;
        let user = null;
        
        // Search through the API returned mapping
        for (const [userId, userRecord] of Object.entries(db)) {
          const match = userRecord.details.find(d => d.id.toUpperCase() === certId.toUpperCase());
          if (match) {
            cert = match;
            user = { name: userRecord.name };
            break;
          }
        }

        if (!cert) {
          setVerificationResult({ state: "failed", data: null, sig: "" });
          return;
        }
        
        // Use existing template mapping or fallback to metadata
        const template = getTemplateForCert(cert.id) || {
          id: cert.id,
          theme: "blue",
          title: "Certificate of Completion",
          eventTitle: cert.metadata?.eventTitle || "CySCOM Event",
          description: cert.metadata?.description || "has successfully participated.",
          date: cert.metadata?.date || new Date(cert.issued_at).toLocaleDateString(),
          signatories: []
        };
        
        const expectedSig = generateSignature(cert.id, user.name, template.eventTitle, cert.type, template.date);

        if (expectedSig !== urlHash) {
          setVerificationResult({ state: "failed", data: null, sig: "" });
          return;
        }

        setVerificationResult({ state: "success", data: { user, cert, template }, sig: expectedSig });
      } catch (err) {
        console.error(err);
        setVerificationResult({ state: "failed", data: null, sig: "" });
      }
    };
    verifyCert();
  }, [certId, urlHash]);

  const { state: verificationState, data: certData, sig: computedSignature } = verificationResult;

  // Render canvas once verified
  useEffect(() => {
    if (verificationState !== "success" || !certData || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const { user, cert, template } = certData;

    drawCertificateOnCanvas(canvas, template, { name: user.name, role: cert.type }, cert.id, computedSignature);

    // Asynchronously load real QR code
    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous";
    const verifyUrl = `${window.location.origin}/opensrc/verify?id=${cert.id}&hash=${computedSignature}`;
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
  }, [verificationState, certData, computedSignature]);

  const handleDownloadPdf = async () => {
    if (!certData) return;
    await downloadVectorPdf({
      template: certData.template,
      user: { name: certData.user.name, role: certData.cert.type },
      certId: certData.cert.id,
      signature: computedSignature
    });
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas || !certData) return;

    const link = document.createElement("a");
    link.download = `${certData.user.name.replace(/\s+/g, "_")}_Certificate_${certData.cert.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  if (verificationState === "verifying") {
    return (
      <div className="min-h-screen bg-[#020204] text-white flex flex-col items-center justify-center font-mono p-4">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
        <div className="text-xs uppercase tracking-widest text-blue-400 animate-pulse">
          Decrypting secure credential key...
        </div>
      </div>
    );
  }

  if (verificationState === "failed") {
    return (
      <div className="min-h-screen bg-[#020204] text-white flex flex-col items-center justify-center font-mono p-6">
        <div className="max-w-md w-full border border-red-500/30 bg-red-950/10 rounded-lg p-8 text-center backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-red-500 animate-pulse" />
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4 animate-bounce" />
          <h2 className="text-lg font-bold tracking-widest text-red-400 uppercase mb-2">
            CREDENTIAL ERROR
          </h2>
          <p className="text-xs text-red-200/60 leading-relaxed mb-6">
            The verification uplink failed. The cryptographic signature is incorrect, missing, or the credential does not exist in our database.
          </p>
          <button
            onClick={() => navigate("/opensrc/locker")}
            className="w-full py-2.5 rounded border border-red-500/30 text-xs font-bold tracking-widest uppercase hover:bg-red-950/20 text-red-300 transition-colors cursor-target"
          >
            Return to Secure Locker
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020204] text-white flex flex-col justify-between font-mono relative overflow-hidden print:bg-black print:min-h-0 print:h-fit">
      
      {/* Abstract Background Elements */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-5 print:hidden" />
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-blue-500/10 blur-[120px] print:hidden" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-pink-500/5 blur-[120px] print:hidden" />

      {/* Floating Header Actions */}
      <header className="p-4 md:p-6 flex items-center justify-between z-10 border-b border-blue-900/10 bg-black/40 backdrop-blur-md print:hidden">
        <button
          onClick={() => navigate("/opensrc/locker")}
          className="flex items-center gap-2 text-xs font-bold text-blue-400 hover:text-white transition-colors cursor-target"
        >
          <FaArrowLeft /> BACK TO LOCKER
        </button>
        <div className="flex items-center gap-2 text-[10px] text-green-400 border border-green-500/20 bg-green-950/20 px-3 py-1.5 rounded-full uppercase tracking-widest animate-pulse">
          <FaCheckCircle /> Cryptographically Verified
        </div>
      </header>

      {/* Presentation Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 z-10 print:p-0 print:m-0">
        <div className="max-w-4xl w-full flex flex-col items-center justify-center print:max-w-none">
          
          {/* Document Frame */}
          <div className="w-full border border-blue-900/30 bg-black/90 p-2 md:p-4 rounded-lg shadow-2xl relative shadow-blue-500/5 group hover:border-blue-500/20 transition-all duration-500 print:border-none print:shadow-none print:p-0 print:bg-transparent">
            {/* Holographic scanner effect line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-[scan_3s_ease-in-out_infinite] pointer-events-none print:hidden" />
            
            {/* Vector Client-Side HTML/CSS certificate */}
            <CertificateHtml
              template={certData.template}
              user={{ name: certData.user.name, role: certData.cert.type }}
              certId={certData.cert.id}
              signature={computedSignature}
              qrUrl={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                `${window.location.origin}/opensrc/verify?id=${certData.cert.id}&hash=${computedSignature}`
              )}`}
            />

            {/* Hidden canvas for PNG download capture only */}
            <canvas
              ref={canvasRef}
              width={1000}
              height={707}
              className="hidden"
            />
          </div>

          {/* User & Info Subtitle */}
          <div className="text-center mt-6 max-w-xl print:hidden">
            <span className="text-[10px] text-blue-400 uppercase tracking-widest font-semibold">
              Recipient Profile
            </span>
            <h2 className="text-xl font-bold uppercase text-white mt-1">
              {certData.user.name}
            </h2>
            <p className="text-xs text-blue-200/50 mt-1 leading-normal">
              Awarded for securing the role of <span className="text-blue-400">{certData.cert.type}</span> in <span className="text-blue-400">{certData.template.eventTitle}</span> during {certData.cert.year}.
            </p>
          </div>
        </div>
      </main>

      {/* Action Bar */}
      <footer className="p-6 md:p-8 flex flex-col sm:flex-row items-center justify-center gap-4 z-10 border-t border-blue-900/10 bg-black/60 backdrop-blur-md print:hidden">
        <button
          onClick={handleDownloadPdf}
          className="w-full sm:w-auto px-6 py-3.5 rounded border border-blue-500/30 font-bold text-xs uppercase cursor-target bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
        >
          <FaFilePdf /> Save Vector PDF
        </button>

        <button
          onClick={handleDownloadPng}
          className="w-full sm:w-auto px-6 py-3.5 rounded border border-blue-500/30 font-bold text-xs uppercase cursor-target bg-blue-950/20 hover:bg-blue-900/20 text-white transition-colors flex items-center justify-center gap-2"
        >
          <FaImage /> Save as PNG Image
        </button>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-3.5 rounded border border-blue-500/30 font-bold text-xs uppercase cursor-target bg-blue-950/20 hover:bg-blue-900/20 text-blue-400 hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <FaPrint /> Print Document
        </button>
      </footer>
    </div>
  );
};

export default CertViewer;
