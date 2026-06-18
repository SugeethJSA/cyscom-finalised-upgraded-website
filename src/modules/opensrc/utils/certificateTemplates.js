const DEFAULT_TEMPLATES = {
  "VALO": {
    templateId: "VALO",
    eventTitle: "ValoOWASP 2025 Duel",
    description: "This is to certify that {NAME} has successfully secured {ROLE} in the cybersecurity tactical tournament, demonstrating expert intelligence, threat assessment, and code audit capabilities.",
    date: "May 25, 2025",
    theme: "cyberpunk",
    signatories: [
      { name: "Sugeeth JSA", title: "Cabinet Head" },
      { name: "Joyeeta Dey", title: "Cabinet Coordinator" }
    ],
    sponsorLogos: [
      "/img/logo.png", // Stand-in logo
      "/img/logo.png"
    ]
  },
  "HACKATHON": {
    templateId: "HACKATHON",
    eventTitle: "Star Wars Hackathon 2024",
    description: "This is to certify that {NAME} has successfully participated and served as a {ROLE} in the 48-hour galaxy coding challenge, building functional open-source solutions.",
    date: "October 18, 2024",
    theme: "gold",
    signatories: [
      { name: "Vatz", title: "Cabinet Core Tech Lead" },
      { name: "Sugeeth JSA", title: "Cabinet Head" }
    ],
    sponsorLogos: [
      "/img/logo.png"
    ]
  },
  "MERIT": {
    templateId: "MERIT",
    eventTitle: "CYSCOM Open Source Contributors",
    description: "This is to certify that {NAME} has been awarded the title of {ROLE} for exemplary contributions, commits, and peer mentorship in the open-source portal.",
    date: "June 12, 2026",
    theme: "emerald",
    signatories: [
      { name: "Sugeeth JSA", title: "Cabinet Head" },
      { name: "Joyeeta Dey", title: "Cabinet Coordinator" }
    ],
    sponsorLogos: [
      "/img/logo.png"
    ]
  }
};

export function getTemplates() {
  const local = localStorage.getItem("cyscom_cert_templates");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Local templates parsing error:", e);
    }
  }
  return DEFAULT_TEMPLATES;
}

export function saveTemplates(templates) {
  localStorage.setItem("cyscom_cert_templates", JSON.stringify(templates));
}

export function getTemplateForCert(certId) {
  const templates = getTemplates();
  // Guess template from ID structure: CYS-804/CYS-801/etc.
  if (certId.includes("VALO") || certId === "CYS-805") {
    return templates["VALO"];
  }
  if (certId.includes("HACKATHON") || certId === "CYS-801" || certId === "CYS-803") {
    return templates["HACKATHON"];
  }
  return templates["MERIT"]; // Default
}
