export const DEFAULT_CERTIFICATE_DB = {
  "VIT-OWASP-001": {
    name: "Sugeeth JSA",
    details: [
      { id: "CYS-801", type: "Core Committee Member", year: "2025" },
      { id: "CYS-802", type: "Open Source Project Developer", year: "2025" }
    ]
  },
  "VIT-OWASP-002": {
    name: "Joyeeta Dey",
    details: [
      { id: "CYS-803", type: "Cabinet Coordinator", year: "2025" }
    ]
  },
  "VIT-OWASP-003": {
    name: "Vatz",
    details: [
      { id: "CYS-804", type: "Core Developer", year: "2025" },
      { id: "CYS-805", type: "CTF Winner - 1st Place", year: "2025" }
    ]
  }
};

export function getCertificates() {
  const local = localStorage.getItem("cyscom_certificates");
  if (local) {
    try {
      return JSON.parse(local);
    } catch (e) {
      console.error("Local certificates parsing error:", e);
    }
  }
  // Initialize on first run to avoid empty registry
  localStorage.setItem("cyscom_certificates", JSON.stringify(DEFAULT_CERTIFICATE_DB));
  return DEFAULT_CERTIFICATE_DB;
}

export function saveCertificates(certs) {
  localStorage.setItem("cyscom_certificates", JSON.stringify(certs));
}

/**
 * Searches the certificate database to find a matching detail object.
 * Returns { user: { name }, cert: { id, type, year } } or null.
 */
export function findCertificateById(certId) {
  const upperId = certId.trim().toUpperCase();
  const db = getCertificates();
  for (const [userId, userRecord] of Object.entries(db)) {
    // If query is the user ID, return their first cert for verification
    if (userId === upperId) {
      return {
        user: { name: userRecord.name },
        cert: userRecord.details[0]
      };
    }
    
    // Search within details
    const match = userRecord.details.find(d => d.id.toUpperCase() === upperId);
    if (match) {
      return {
        user: { name: userRecord.name },
        cert: match
      };
    }
  }
  return null;
}

/**
 * Finds the full user record (containing details array) by user ID or certificate ID.
 */
export function findUserByQuery(query) {
  const upper = query.trim().toUpperCase();
  const db = getCertificates();
  if (db[upper]) {
    return db[upper];
  }
  for (const userRecord of Object.values(db)) {
    const hasCert = userRecord.details.some(d => d.id.toUpperCase() === upper);
    if (hasCert) {
      return userRecord;
    }
  }
  return null;
}

