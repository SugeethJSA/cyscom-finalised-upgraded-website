/**
 * Utility to sync templates, certificates, leaderboard points,
 * projects, hall of fame events, legacy members, and admin users
 * between Firebase Realtime Database (via REST API) and LocalStorage cache.
 */

const getDbUrl = () => {
  const url = import.meta.env.VITE_FIREBASE_DB_URL;
  return url ? url.replace(/\/$/, "") : null;
};

const getApiUrl = () => {
  const url = import.meta.env.VITE_API_URL;
  return url ? url.replace(/\/$/, "") : null;
};

// Default bootstrap dataset definitions
const DEFAULT_PROJECTS = [
  {
    name: "cyscom-new-site",
    desc: "The premium visual experience that serves as the official Cyscom VIT Chennai web portal, featuring high-fidelity animations, interactive widgets, and custom loaders.",
    tech: ["React", "GSAP", "Tailwind CSS", "Framer Motion"],
    stars: 14,
    forks: 5,
    github: "https://github.com/SugeethJSA/cyscom-new-site"
  },
  {
    name: "new-blog",
    desc: "A state-of-the-art cyber Chronicles blog portal built for the community to share technical CTF walkthroughs, infosec articles, and challenge writeups.",
    tech: ["React 19", "Tailwind CSS", "React Router v7", "GSAP"],
    stars: 9,
    forks: 3,
    github: "https://github.com/SugeethJSA/cyscom-new-blog"
  },
  {
    name: "CyscomLeaderboard",
    desc: "The robust Python/Flask admin backend and Firebase Realtime Database synchronizer that calculates, details, and tracks member contribution rankings.",
    tech: ["Python", "Flask", "Firebase Realtime DB", "Tailwind CSS"],
    stars: 18,
    forks: 8,
    github: "https://github.com/cyscomvit/CyscomLeaderboard"
  },
  {
    name: "opensrc-website",
    desc: "The legacy Flask website designed to manage open source contributions, certificates, and student credentials across Cyscom VIT acts.",
    tech: ["Python", "Flask", "Bootstrap", "Poetry"],
    stars: 6,
    forks: 4,
    github: "https://github.com/cyscomvit/opensrc-website"
  }
];

const DEFAULT_ADMIN_USERS = [
  {
    username: "admin",
    passwordHash: "0eb6186d3ac869f24f085c46aee1614cfeccab8008f1294b908a85bdbaefd602", // sha256("cyscom2026")
    role: "superadmin",
    permissions: ["manage_users", "manage_projects", "manage_certificates", "manage_leaderboard", "manage_hall_of_fame", "manage_legacy"]
  }
];

/**
 * Downloads latest database entries from Firebase/API and updates LocalStorage cache.
 * Resolves silently if neither Firebase nor API is configured.
 */
export async function syncFromFirebase() {
  // Ensure local storage has defaults seeded first
  if (!localStorage.getItem("cyscom_projects")) {
    localStorage.setItem("cyscom_projects", JSON.stringify(DEFAULT_PROJECTS));
  }
  if (!localStorage.getItem("cyscom_admin_users")) {
    localStorage.setItem("cyscom_admin_users", JSON.stringify(DEFAULT_ADMIN_USERS));
  }

  const apiUrl = getApiUrl();
  const dbUrl = getDbUrl();
  if (!apiUrl && !dbUrl) return;

  const urlForTemplates = apiUrl ? `${apiUrl}/templates` : `${dbUrl}/vitcc/owasp/templates.json`;
  const urlForProjects = apiUrl ? `${apiUrl}/projects` : `${dbUrl}/vitcc/owasp/projects.json`;
  const urlForLeaderboard = apiUrl ? `${apiUrl}/leaderboard` : `${dbUrl}/vitcc/owasp.json`;

  try {
    // 1. Sync Certificate Templates
    const templatesRes = await fetch(urlForTemplates);
    if (templatesRes.ok) {
      const templates = await templatesRes.json();
      if (templates) {
        localStorage.setItem("cyscom_cert_templates", JSON.stringify(templates));
      }
    }


    // 3. Sync Projects
    const projectsRes = await fetch(urlForProjects);
    if (projectsRes.ok) {
      const projects = await projectsRes.json();
      if (projects) {
        localStorage.setItem("cyscom_projects", JSON.stringify(projects));
      }
    }

    // 7. Sync Leaderboard Data (Acts)
    const rawRes = await fetch(urlForLeaderboard);
    if (rawRes.ok) {
      const rawDb = await rawRes.json();
      if (rawDb) {
        const acts = {};
        let maxAct = 1;

        // If we query the API, rawDb might be the leaderboardDb directly.
        // If we query Firebase, rawDb is the entire database with leaderboard-act keys.
        // Let's resolve both structures:
        const dbContainer = apiUrl ? rawDb : rawDb;

        Object.keys(dbContainer).forEach(key => {
          if (key.startsWith("leaderboard-act")) {
            const actNumber = key.replace("leaderboard-act", "");
            const membersList = [];
            const cabinetList = [];
            const rawMembers = dbContainer[key];

            if (rawMembers) {
              Object.values(rawMembers).forEach(member => {
                if (member && typeof member === "object") {
                  const rating = Number(member.Rating || member.rating || 0);
                  const contributions = String(member.Contributions || member.contributions || "0");
                  const name = member.Name || member.name || "Unknown";
                  const image = member.Image || member.image || "unranked";

                  const formattedMember = {
                    Name: name,
                    Rating: rating,
                    Contributions: contributions,
                    Image: image
                  };

                  if (rating >= 5000 && name.toLowerCase() !== "testing") {
                    cabinetList.push(formattedMember);
                  } else if (name.toLowerCase() !== "testing") {
                    membersList.push(formattedMember);
                  }
                }
              });
            }

            membersList.sort((a, b) => b.Rating - a.Rating);
            cabinetList.sort((a, b) => b.Rating - a.Rating);

            const actInt = parseInt(actNumber);
            if (actInt > maxAct) maxAct = actInt;

            acts[actNumber] = {
              name: `ACT ${actNumber} - ${2017 + actInt}`,
              cabinet: cabinetList,
              members: membersList,
              wizard: null
            };
          }
        });

        // Set dynamic announcement wizard
        const rawAnnouncements = apiUrl ? rawDb.announcements : rawDb.announcements;
        if (rawAnnouncements && rawAnnouncements.current_wizard) {
          if (acts[maxAct]) {
            acts[maxAct].wizard = rawAnnouncements.current_wizard;
          }
        }

        if (Object.keys(acts).length > 0) {
          localStorage.setItem("cyscom_leaderboard_data", JSON.stringify({ acts }));
        }
      }
    }
  } catch (err) {
    console.error("Database background synchronization failed:", err);
  }
}

/**
 * Pushes updated templates array to Firebase Realtime Database or API Gateway
 */
export async function pushTemplatesToFirebase(templates) {
  const apiUrl = getApiUrl();
  const dbUrl = getDbUrl();
  if (!apiUrl && !dbUrl) return;

  const url = apiUrl ? `${apiUrl}/api/templates` : `${dbUrl}/vitcc/owasp/templates.json`;

  try {
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(templates)
    });
  } catch (err) {
    console.error("Failed to push templates:", err);
  }
}

/**
 * Pushes updated Projects database to Firebase Realtime Database or API Gateway
 */
export async function pushProjectsToFirebase(projects) {
  const apiUrl = getApiUrl();
  const dbUrl = getDbUrl();
  if (!apiUrl && !dbUrl) return;

  const url = apiUrl ? `${apiUrl}/api/projects` : `${dbUrl}/vitcc/owasp/projects.json`;

  try {
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projects)
    });
  } catch (err) {
    console.error("Failed to push projects catalog:", err);
  }
}

/**
 * Pushes updated Admin Users database to Firebase Realtime Database or API Gateway
 */
export async function pushAdminUsersToFirebase(users) {
  const apiUrl = getApiUrl();
  const dbUrl = getDbUrl();
  if (!apiUrl && !dbUrl) return;

  const url = apiUrl ? `${apiUrl}/api/users` : `${dbUrl}/vitcc/owasp/admin_users.json`;

  try {
    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(users)
    });
  } catch (err) {
    console.error("Failed to push admin users:", err);
  }
}

/**
 * Pushes updated Act contributors back to Firebase Realtime Database structure or API Gateway
 */
export async function pushLeaderboardActToFirebase(actNum, cabinet, members) {
  const apiUrl = getApiUrl();
  const dbUrl = getDbUrl();
  if (!apiUrl && !dbUrl) return;

  const url = apiUrl ? `${apiUrl}/api/leaderboard-act/${actNum}` : `${dbUrl}/vitcc/owasp/leaderboard-act${actNum}.json`;

  try {
    const rawMembers = {};
    let idx = 0;
    
    cabinet.forEach(m => {
      rawMembers[idx++] = {
        Name: m.Name,
        Rating: m.Rating,
        Contributions: m.Contributions,
        Image: m.Image || "unranked"
      };
    });

    members.forEach(m => {
      rawMembers[idx++] = {
        Name: m.Name,
        Rating: m.Rating,
        Contributions: m.Contributions,
        Image: m.Image || "unranked"
      };
    });

    await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rawMembers)
    });
  } catch (err) {
    console.error(`Failed to push Act ${actNum} leaderboard points:`, err);
  }
}

