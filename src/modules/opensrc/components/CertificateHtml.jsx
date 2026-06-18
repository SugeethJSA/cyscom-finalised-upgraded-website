const CertificateHtml = ({ template, user, certId, signature, qrUrl, logoUrl = "/img/logo.png" }) => {
  // Theme styling configurations matching Locker.jsx canvas logic
  let themeStyles = {
    bg: "bg-[#050508]",
    primaryBorder: "border-[#3b82f6]",
    secondaryBorder: "border-[#ec4899]",
    titleText: "text-white",
    accentText: "text-[#60a5fa]",
    bodyText: "text-[#dfdff2]",
    gridColor: "rgba(59, 130, 246, 0.03)",
    hasGrid: true,
  };

  if (template.theme === "gold") {
    themeStyles = {
      bg: "bg-[#0c0d12]",
      primaryBorder: "border-[#fbbf24]",
      secondaryBorder: "border-[#d97706]",
      titleText: "text-[#fbbf24]",
      accentText: "text-[#f59e0b]",
      bodyText: "text-[#fef08a]",
      gridColor: "rgba(251, 191, 36, 0.02)",
      hasGrid: true,
    };
  } else if (template.theme === "emerald") {
    themeStyles = {
      bg: "bg-[#030805]",
      primaryBorder: "border-[#10b981]",
      secondaryBorder: "border-[#047857]",
      titleText: "text-[#34d399]",
      accentText: "text-[#059669]",
      bodyText: "text-[#d1fae5]",
      gridColor: "rgba(16, 185, 129, 0.02)",
      hasGrid: true,
    };
  } else if (template.theme === "light") {
    themeStyles = {
      bg: "bg-[#fafaf9]",
      primaryBorder: "border-[#44403c]",
      secondaryBorder: "border-[#78716c]",
      titleText: "text-[#1c1917]",
      accentText: "text-[#44403c]",
      bodyText: "text-[#292524]",
      gridColor: "",
      hasGrid: false,
    };
  }

  // Parse text macros
  const parsedDesc = template.description
    .replace("{NAME}", user.name)
    .replace("{ROLE}", user.role);

  const sigs = template.signatories || [];

  return (
    <div 
      className={`print-only-full relative w-full aspect-[1.414/1] ${themeStyles.bg} border-[6px] ${themeStyles.primaryBorder} p-2.5 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-between overflow-hidden select-none transition-all duration-300`}
      style={{
        boxSizing: "border-box",
        pageBreakInside: "avoid"
      }}
    >
      {/* Background Cyber Grid */}
      {themeStyles.hasGrid && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(${themeStyles.gridColor} 1px, transparent 1px),
              linear-gradient(90deg, ${themeStyles.gridColor} 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px"
          }}
        />
      )}

      {/* Decorative corners */}
      <div className={`absolute top-[12px] left-[12px] w-[20px] h-[20px] border-t-4 border-l-4 ${themeStyles.accentText}`} />
      <div className={`absolute top-[12px] right-[12px] w-[20px] h-[20px] border-t-4 border-r-4 ${themeStyles.accentText}`} />
      <div className={`absolute bottom-[12px] left-[12px] w-[20px] h-[20px] border-b-4 border-l-4 ${themeStyles.accentText}`} />
      <div className={`absolute bottom-[12px] right-[12px] w-[20px] h-[20px] border-b-4 border-r-4 ${themeStyles.accentText}`} />

      {/* Inner Frame */}
      <div className={`h-full w-full border-2 ${themeStyles.secondaryBorder} p-6 sm:p-8 md:p-10 lg:p-12 flex flex-col justify-between items-center relative z-10`}>
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center">
          {/* Logo container */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-1 sm:mb-2 relative flex items-center justify-center">
            <img src={logoUrl} alt="Cyscom Logo" className="object-contain max-h-full" />
          </div>
          <span className={`text-[8px] sm:text-[10px] md:text-[11px] font-mono uppercase tracking-[0.2em] ${themeStyles.accentText} font-bold mb-1`}>
            CYSCOM VIT CHENNAI // SECURE CREDENTIAL UPLINK
          </span>
          <h1 className={`text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold font-zentry tracking-wider uppercase ${themeStyles.titleText}`}>
            CERTIFICATE OF CONTRIBUTION
          </h1>
          <div className={`w-32 sm:w-48 h-[1px] ${themeStyles.accentText} bg-current opacity-40 mt-1 sm:mt-2`} />
        </div>

        {/* Content Section */}
        <div className="flex flex-col items-center text-center max-w-[85%] my-2 sm:my-3">
          <p className={`text-xs sm:text-sm md:text-base italic font-serif ${themeStyles.bodyText} opacity-80 mb-2`}>
            This is proudly awarded to
          </p>
          <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black font-general tracking-wide uppercase ${themeStyles.titleText} mb-2`}>
            {user.name}
          </h2>
          <p className={`text-[10px] sm:text-xs md:text-sm font-mono leading-relaxed ${themeStyles.bodyText}`}>
            {parsedDesc}
          </p>
        </div>

        {/* Info & Verification Details */}
        <div className="w-full flex flex-col items-center">
          <span className={`text-[8px] sm:text-[10px] font-mono tracking-widest ${themeStyles.accentText} mb-4`}>
            ISSUED ON: {template.date} // CREDENTIAL ID: {certId}
          </span>

          {/* Footer Grid: Signatories on Left/Right, QR Code on far right */}
          <div className="w-full grid grid-cols-12 items-end gap-2">
            
            {/* Signatory 1 */}
            <div className="col-span-4 flex flex-col items-start font-mono">
              {sigs.length > 0 && (
                <>
                  <div className={`w-28 sm:w-40 h-[1px] ${themeStyles.accentText} bg-current opacity-40 mb-1.5`} />
                  <span className={`text-[10px] sm:text-xs font-bold ${themeStyles.bodyText}`}>{sigs[0].name}</span>
                  <span className={`text-[8px] sm:text-[9px] opacity-70 ${themeStyles.accentText}`}>{sigs[0].title}</span>
                </>
              )}
            </div>

            {/* Verification Hash Detail (Center bottom) */}
            <div className="col-span-5 flex flex-col items-center justify-center font-mono opacity-60 hover:opacity-100 transition-opacity">
              <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.15em] text-center text-current mb-1 font-bold">
                VERIFICATION DIGITAL SIGNATURE:
              </span>
              <span className="text-[6px] sm:text-[7px] select-all break-all text-center max-w-xs font-bold leading-normal font-mono tracking-tighter">
                {signature}
              </span>
              <span className={`text-[5px] sm:text-[6px] text-center mt-1 font-bold ${themeStyles.accentText}`}>
                CRYPTOGRAPHIC INTEGRITY SECURED
              </span>
            </div>

            {/* Signatory 2 & QR container */}
            <div className="col-span-3 flex justify-end items-end gap-4">
              {/* Signatory 2 */}
              <div className="flex flex-col items-end font-mono text-right">
                {sigs.length > 1 && (
                  <>
                    <div className={`w-28 sm:w-40 h-[1px] ${themeStyles.accentText} bg-current opacity-40 mb-1.5`} />
                    <span className={`text-[10px] sm:text-xs font-bold ${themeStyles.bodyText}`}>{sigs[1].name}</span>
                    <span className={`text-[8px] sm:text-[9px] opacity-70 ${themeStyles.accentText}`}>{sigs[1].title}</span>
                  </>
                )}
              </div>

              {/* Verification QR Code */}
              {qrUrl && (
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 p-1 bg-white border ${themeStyles.accentText} rounded flex items-center justify-center`}>
                    <img src={qrUrl} alt="Verification QR" className="w-full h-full object-contain" />
                  </div>
                  <span className={`text-[6px] sm:text-[8px] font-mono mt-1 ${themeStyles.accentText} font-bold`}>
                    SCAN TO VERIFY
                  </span>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

      {/* Embedded print media overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          @page {
            size: landscape !important;
            margin: 0 !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            background-color: ${template.theme === "light" ? "#fafaf9" : "#050508"} !important;
            color: ${template.theme === "light" ? "#292524" : "#dfdff2"} !important;
            width: 297mm !important;
            height: 210mm !important;
          }
          .print-only-full {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 297mm !important;
            height: 210mm !important;
            margin: 0 !important;
            padding: 20px !important;
            border: none !important;
            box-shadow: none !important;
            z-index: 9999999 !important;
            background-color: ${template.theme === "light" ? "#fafaf9" : "#050508"} !important;
            box-sizing: border-box !important;
          }
        }
      `}} />
    </div>
  );
};

export default CertificateHtml;
