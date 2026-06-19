import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaExclamationTriangle, FaShieldAlt, FaExternalLinkAlt, FaFilePdf } from "react-icons/fa";
import { generateSignature } from "../utils/crypto";
import { getTemplateForCert } from "../utils/certificateTemplates";
import { apiRequest } from "../utils/api";
import Button from "../components/Button";
import CertificateHtml from "../components/CertificateHtml";
import { downloadVectorPdf } from "../utils/pdfGenerator";

// Canvas drawing helper function matching Locker/CertViewer
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

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const certId = searchParams.get("id");
  const urlHash = searchParams.get("hash");

  const [verificationResult, setVerificationResult] = useState({ state: "loading", data: null, sig: "" });

  useEffect(() => {
    if (!certId || !urlHash) {
      setVerificationResult({ state: "invalid", data: null, sig: "" });
      return;
    }

    const verifyCert = async () => {
      try {
        const res = await apiRequest(`/api/certificates?cert_id=${certId}`);
        const certs = res.certificates;
        if (!certs || certs.length === 0) {
          setVerificationResult({ state: "invalid", data: null, sig: "" });
          return;
        }

        const cert = certs[0];
        const user = { name: cert.user_name }; // from API join
        
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
          setVerificationResult({ state: "invalid", data: null, sig: "" });
          return;
        }

        setVerificationResult({ state: "valid", data: { user, cert, template }, sig: expectedSig });
      } catch (err) {
        console.error(err);
        setVerificationResult({ state: "invalid", data: null, sig: "" });
      }
    };
    verifyCert();
  }, [certId, urlHash]);

  const { state: verifyState, data, sig } = verificationResult;

  // Render Certificate Preview on Canvas if valid
  useEffect(() => {
    if (verifyState !== "valid" || !data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const { user, cert, template } = data;

    drawCertificateOnCanvas(canvas, template, { name: user.name, role: cert.type }, cert.id, sig);

    // Asynchronously load real QR code
    const qrImage = new Image();
    qrImage.crossOrigin = "anonymous";
    const verifyUrl = `${window.location.origin}/verify?id=${cert.id}&hash=${sig}`;
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
  }, [verifyState, data, sig]);

  const handleDownloadPdf = async () => {
    if (!data) return;
    await downloadVectorPdf({
      template: data.template,
      user: { name: data.user.name, role: data.cert.type },
      certId: data.cert.id,
      signature: sig
    });
  };

  const handleOpenViewer = () => {
    window.open(`/cert-viewer?id=${certId}&hash=${urlHash}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10 font-mono select-none">
      
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-10 print:hidden" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10 print:hidden">
        <div className="px-3 py-1 rounded-full border border-blue-500/20 bg-blue-950/20 text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-3 animate-pulse">
          <FaShieldAlt className="inline mr-1" /> Authentication Registry Node
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white font-zentry tracking-wider uppercase">
          CREDENTIAL <span className="text-blue-400">VERIFICATION</span>
        </h1>
        <p className="mt-2 text-xs md:text-sm text-blue-200/50">
          Cryptographically verifying the integrity of academic and event achievements.
        </p>
      </div>

      {verifyState === "verifying" && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4" />
          <p className="text-xs text-blue-400 uppercase tracking-widest">Querying blockchain record structure...</p>
        </div>
      )}

      {verifyState === "invalid" && (
        <div className="max-w-xl mx-auto bg-black/80 border border-red-500/30 rounded-lg p-8 backdrop-blur-md relative overflow-hidden shadow-2xl shadow-red-500/5">
          <div className="absolute top-0 left-0 w-full h-[3px] bg-red-500 animate-pulse" />
          <div className="flex flex-col items-center text-center">
            <FaExclamationTriangle className="text-red-500 text-5xl mb-4 animate-bounce" />
            <h2 className="text-lg font-bold tracking-widest text-red-400 uppercase mb-2">
              VERIFICATION STATUS: REJECTED
            </h2>
            <p className="text-xs text-red-200/60 leading-relaxed mb-6">
              Security Warning: The credentials provided do not map to our registered database, or the signature hash has been modified or corrupted.
            </p>
            
            <div className="w-full h-px bg-red-950/40 mb-6" />

            <div className="flex flex-col gap-3 w-full">
              <Button
                title="Go to Locker Search"
                onClick={() => navigate("/opensrc/locker")}
                containerClass="w-full bg-red-950/20 border border-red-500/30 text-xs font-mono text-red-300 hover:bg-red-900/20 cursor-target"
              />
              <Button
                title="Return Home"
                onClick={() => navigate("/opensrc")}
                containerClass="w-full bg-black border border-blue-900/20 text-xs font-mono text-blue-200/60 hover:text-white cursor-target"
              />
            </div>
          </div>
        </div>
      )}

      {verifyState === "valid" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto print:block">
          
          {/* Details Card */}
          <div className="lg:col-span-5 bg-black/85 border border-green-500/30 rounded-lg p-6 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden shadow-xl shadow-green-500/5 print:hidden">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-green-500" />
            
            <div>
              <div className="flex items-center gap-2 text-green-400 font-bold text-xs uppercase tracking-wider mb-6">
                <FaCheckCircle className="text-lg animate-pulse" /> SECURE UPLINK MATCHED
              </div>

              <div className="flex flex-col gap-4 font-mono">
                <div className="border-b border-blue-950 pb-3">
                  <span className="text-[9px] text-blue-400/60 uppercase">Recipient Name</span>
                  <p className="text-base font-bold text-white uppercase mt-0.5">{data.user.name}</p>
                </div>

                <div className="border-b border-blue-950 pb-3">
                  <span className="text-[9px] text-blue-400/60 uppercase">Assigned Role</span>
                  <p className="text-sm font-bold text-white uppercase mt-0.5">{data.cert.type}</p>
                </div>

                <div className="border-b border-blue-950 pb-3">
                  <span className="text-[9px] text-blue-400/60 uppercase">Authorized Event</span>
                  <p className="text-sm font-bold text-white uppercase mt-0.5">{data.template.eventTitle}</p>
                </div>

                <div className="border-b border-blue-950 pb-3">
                  <span className="text-[9px] text-blue-400/60 uppercase">Issue Timestamp</span>
                  <p className="text-xs text-white uppercase mt-0.5">{data.template.date} // Year {data.cert.year}</p>
                </div>

                <div>
                  <span className="text-[9px] text-blue-400/60 uppercase">Verification Hash</span>
                  <div className="mt-1 p-2 bg-blue-950/20 border border-blue-950 rounded text-[9px] text-blue-400 font-mono break-all leading-relaxed">
                    {sig}
                  </div>
                  <span className="text-[8px] text-blue-300/30 leading-normal block mt-1">
                    Authenticity verified using SHA-256 secure hash generation.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-8">
              <button
                onClick={handleOpenViewer}
                className="w-full py-3 rounded border border-green-500/30 font-bold text-xs uppercase text-green-300 bg-green-950/20 hover:bg-green-900/20 transition-all flex items-center justify-center gap-2 cursor-target hover:shadow-md hover:shadow-green-500/5"
              >
                <FaExternalLinkAlt /> Open Immersive HTML Viewer
              </button>
              <button
                onClick={handleDownloadPdf}
                className="w-full py-3 rounded border border-blue-500/30 font-bold text-xs uppercase text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 cursor-target"
              >
                <FaFilePdf /> Save Vector PDF
              </button>
            </div>
          </div>

          {/* Certificate Live Render Card */}
          <div className="lg:col-span-7 bg-black/75 border border-blue-900/20 rounded-lg p-4 flex flex-col justify-center items-center backdrop-blur-sm relative group hover:border-blue-500/10 transition-colors duration-500 print:border-none print:shadow-none print:p-0 print:bg-transparent">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent animate-[scan_3.5s_ease-in-out_infinite] pointer-events-none print:hidden" />
            
            <CertificateHtml
              template={data.template}
              user={{ name: data.user.name, role: data.cert.type }}
              certId={data.cert.id}
              signature={sig}
              qrUrl={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                `${window.location.origin}/verify?id=${data.cert.id}&hash=${sig}`
              )}`}
            />

            {/* Hidden canvas for background tasks / PNG downloads */}
            <canvas
              ref={canvasRef}
              width={1000}
              height={707}
              className="hidden"
            />
            <div className="mt-3 text-center print:hidden">
              <span className="text-[9px] text-blue-400/40 uppercase tracking-widest font-mono">
                Visual Inspection Preview (HTML vector render)
              </span>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};

export default Verify;
