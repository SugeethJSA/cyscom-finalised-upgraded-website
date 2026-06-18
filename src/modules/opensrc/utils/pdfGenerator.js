import { jsPDF } from "jspdf";

/**
 * Helper to fetch any URL image and convert it to Base64 data url.
 * Handles CORS cleanly for our QR code images.
 */
async function getBase64ImageFromUrl(url) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error("Failed to load image for PDF:", err);
    return null;
  }
}

/**
 * Dynamic Vector PDF Generator using jsPDF.
 * Renders vector paths, texts, and embedded logos/QRs in full color.
 */
export async function downloadVectorPdf({ template, user, certId, signature, logoUrl = "/img/logo.png" }) {
  // Theme styling configurations (RGB color arrays)
  let bg = [5, 5, 8];             // #050508
  let primary = [59, 130, 246];    // #3b82f6
  let secondary = [236, 72, 153];  // #ec4899
  let title = [255, 255, 255];     // #ffffff
  let accent = [96, 165, 250];    // #60a5fa
  let body = [223, 223, 242];      // #dfdff2
  let hasGrid = true;

  if (template.theme === "gold") {
    bg = [12, 13, 18];             // #0c0d12
    primary = [251, 191, 36];      // #fbbf24
    secondary = [217, 119, 6];     // #d97706
    title = [251, 191, 36];        // #fbbf24
    accent = [245, 158, 11];       // #f59e0b
    body = [254, 240, 138];        // #fef08a
  } else if (template.theme === "emerald") {
    bg = [3, 8, 5];                // #030805
    primary = [16, 185, 129];      // #10b981
    secondary = [4, 120, 87];      // #047857
    title = [52, 211, 153];        // #34d399
    accent = [5, 150, 105];        // #059669
    body = [209, 250, 229];        // #d1fae5
  } else if (template.theme === "light") {
    bg = [250, 250, 249];          // #fafaf9
    primary = [68, 64, 60];        // #44403c
    secondary = [120, 113, 108];   // #78716c
    title = [28, 25, 23];          // #1c1917
    accent = [68, 64, 60];         // #44403c
    body = [41, 37, 36];           // #292524
    hasGrid = false;
  } else if (template.theme === "cyberpunk" || template.theme === "cyberneon") {
    bg = [5, 5, 8];
    primary = [59, 130, 246];
    secondary = [236, 72, 153];
    title = [255, 255, 255];
    accent = [96, 165, 250];
    body = [223, 223, 242];
    hasGrid = true;
  }

  // Pre-load images to avoid asynchronous delays during PDF build
  const qrVerifyUrl = `${window.location.origin}/verify?id=${certId}&hash=${signature}`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrVerifyUrl)}`;

  const [logoBase64, qrBase64] = await Promise.all([
    getBase64ImageFromUrl(logoUrl),
    getBase64ImageFromUrl(qrApiUrl)
  ]);

  // Initialize jsPDF in landscape A4 size (297mm x 210mm)
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });

  // 1. Draw solid background
  doc.setFillColor(bg[0], bg[1], bg[2]);
  doc.rect(0, 0, 297, 210, "F");

  // 2. Draw Cyber Grid lines
  if (hasGrid) {
    doc.setDrawColor(primary[0], primary[1], primary[2]);
    doc.setLineWidth(0.04);
    const spacing = 10; // 10mm grids
    for (let x = 0; x < 297; x += spacing) {
      doc.line(x, 0, x, 210);
    }
    for (let y = 0; y < 210; y += spacing) {
      doc.line(0, y, 297, y);
    }
  }

  // 3. Draw outer double frame
  doc.setDrawColor(primary[0], primary[1], primary[2]);
  doc.setLineWidth(1.6);
  doc.rect(6, 6, 285, 198); // 6mm margin

  // 4. Draw inner pink border
  doc.setDrawColor(secondary[0], secondary[1], secondary[2]);
  doc.setLineWidth(0.5);
  doc.rect(8, 8, 281, 194); // 8mm margin

  // 5. Draw decorative corner brackets
  doc.setFillColor(accent[0], accent[1], accent[2]);
  const bracketSize = 8;
  // Top-Left
  doc.rect(5, 5, bracketSize, 1, "F");
  doc.rect(5, 5, 1, bracketSize, "F");
  // Top-Right
  doc.rect(292 - bracketSize, 5, bracketSize, 1, "F");
  doc.rect(291, 5, 1, bracketSize, "F");
  // Bottom-Left
  doc.rect(5, 204, bracketSize, 1, "F");
  doc.rect(5, 205 - bracketSize, 1, bracketSize, "F");
  // Bottom-Right
  doc.rect(292 - bracketSize, 204, bracketSize, 1, "F");
  doc.rect(291, 205 - bracketSize, 1, bracketSize, "F");

  // 6. Draw brand logo at top center
  if (logoBase64) {
    doc.addImage(logoBase64, "PNG", 133.5, 12, 30, 30);
  }

  // 7. Render Header texts
  doc.setFont("courier", "bold");
  doc.setFontSize(8.5);
  doc.setTextColor(accent[0], accent[1], accent[2]);
  doc.text("CYSCOM VIT CHENNAI // SECURE CREDENTIAL UPLINK", 148.5, 48, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(title[0], title[1], title[2]);
  doc.text("CERTIFICATE OF CONTRIBUTION", 148.5, 58, { align: "center" });

  // Divider
  doc.setDrawColor(accent[0], accent[1], accent[2]);
  doc.setLineWidth(0.3);
  doc.line(117, 63, 180, 63);

  // 8. Render certificate body award texts
  doc.setFont("times", "italic");
  doc.setFontSize(13);
  doc.setTextColor(body[0], body[1], body[2]);
  doc.text("This is proudly awarded to", 148.5, 75, { align: "center" });

  // Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(30);
  doc.setTextColor(title[0], title[1], title[2]);
  doc.text(user.name, 148.5, 88, { align: "center" });

  // Description Text
  const parsedDesc = template.description
    .replace("{NAME}", user.name)
    .replace("{ROLE}", user.role);

  doc.setFont("courier", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(body[0], body[1], body[2]);
  const splitDescription = doc.splitTextToSize(parsedDesc, 190);
  doc.text(splitDescription, 148.5, 102, { align: "center" });

  // Issue Timestamp
  doc.setFont("courier", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(accent[0], accent[1], accent[2]);
  doc.text(`ISSUED ON: ${template.date} // CREDENTIAL ID: ${certId}`, 148.5, 138, { align: "center" });

  // 9. Draw Signatories
  const sigs = template.signatories || [];
  if (sigs.length > 0) {
    doc.setDrawColor(accent[0], accent[1], accent[2]);
    doc.setLineWidth(0.25);
    doc.line(25, 172, 85, 172);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(body[0], body[1], body[2]);
    doc.text(sigs[0].name, 25, 178);

    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text(sigs[0].title, 25, 183);
  }

  if (sigs.length > 1) {
    doc.setDrawColor(accent[0], accent[1], accent[2]);
    doc.setLineWidth(0.25);
    doc.line(212, 172, 272, 172);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(body[0], body[1], body[2]);
    doc.text(sigs[1].name, 272, 178, { align: "right" });

    doc.setFont("courier", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text(sigs[1].title, 272, 183, { align: "right" });
  }

  // 10. Draw Cryptographic Verification Signatures
  doc.setFont("courier", "normal");
  doc.setFontSize(6.5);
  doc.setTextColor(accent[0], accent[1], accent[2]);
  doc.text("VERIFICATION DIGITAL SIGNATURE:", 25, 194);

  doc.setFont("courier", "bold");
  doc.setFontSize(6);
  doc.setTextColor(body[0], body[1], body[2]);
  doc.text(signature, 25, 198);

  doc.setFont("courier", "bold");
  doc.setFontSize(5);
  doc.setTextColor(accent[0], accent[1], accent[2]);
  doc.text("THIS CREDENTIAL IS SIGNED CRYPTOGRAPHICALLY AND CANNOT BE ALTERED.", 25, 202);

  // 11. Draw QR code
  if (qrBase64) {
    doc.addImage(qrBase64, "PNG", 242, 134, 30, 30);
    doc.setFont("courier", "bold");
    doc.setFontSize(6.5);
    doc.setTextColor(accent[0], accent[1], accent[2]);
    doc.text("SCAN TO VERIFY", 257, 168, { align: "center" });
  }

  // Set Document Metadata properties (includes cryptographic signing validation fields)
  doc.setProperties({
    title: `Cyscom VIT Credential - ${user.name}`,
    subject: `${template.eventTitle} Certificate - Cryptographically Signed (${signature})`,
    author: "Cyscom VIT Chennai",
    creator: "Cyscom Cryptographic Engine",
    keywords: `cyscom, certificate, ${certId}, signature:${signature}, verified:true`
  });

  // Save the PDF file
  doc.save(`${user.name.replace(/\s+/g, "_")}_Certificate_${certId}.pdf`);
}
