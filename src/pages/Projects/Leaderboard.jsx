import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaChevronDown, FaChevronUp, FaInfoCircle, FaCrown, FaUserShield, FaAward } from "react-icons/fa";

// Point Categories cheatsheet data
const POINT_CATEGORIES = [
  { name: "Complete Project", points: 200, cat: "Projects" },
  { name: "Mini Project", points: 100, cat: "Projects" },
  { name: "CTF Winner", points: 75, cat: "CTF" },
  { name: "Hard PR", points: 60, cat: "Development" },
  { name: "OC Heavy", points: 70, cat: "Events" },
  { name: "UIUX Design", points: 45, cat: "Design" },
  { name: "Medium PR", points: 40, cat: "Development" },
  { name: "CTF Host", points: 30, cat: "CTF" },
  { name: "Easy PR", points: 20, cat: "Development" },
  { name: "Attendance", points: 5, cat: "Organization" }
];

// Helper to render beautiful glowing SVG badges for ranks
const RankBadge = ({ rank = "unranked" }) => {
  const normalizedRank = rank.toLowerCase().replace(".webp", "");
  
  if (normalizedRank.includes("radiant")) {
    return (
      <svg className="w-8 h-8 filter drop-shadow-[0_0_5px_rgba(251,191,36,0.8)]" viewBox="0 0 32 32" fill="none">
        <polygon points="16,4 28,12 28,24 16,28 4,24 4,12" fill="url(#radiant-grad)" />
        <polygon points="16,8 24,14 24,22 16,25 8,22 8,14" fill="#0c0a09" />
        <polygon points="16,11 20,15 20,20 16,22 12,20 12,15" fill="#fbbf24" />
        <circle cx="16" cy="17" r="2" fill="#ffffff" />
        <defs>
          <linearGradient id="radiant-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#ea580c" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  
  if (normalizedRank.includes("ascendent")) {
    return (
      <svg className="w-8 h-8 filter drop-shadow-[0_0_5px_rgba(139,92,246,0.8)]" viewBox="0 0 32 32" fill="none">
        <polygon points="16,4 26,10 26,22 16,28 6,22 6,10" fill="url(#asc-grad)" />
        <polygon points="16,7 23,12 23,20 16,25 9,20 9,12" fill="#0c0a09" />
        <polygon points="16,11 20,14 20,18 16,21 12,18 12,14" fill="#a78bfa" />
        <defs>
          <linearGradient id="asc-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (normalizedRank.includes("diamond")) {
    return (
      <svg className="w-8 h-8 filter drop-shadow-[0_0_5px_rgba(56,189,248,0.7)]" viewBox="0 0 32 32" fill="none">
        <polygon points="16,4 26,14 16,28 6,14" fill="url(#dia-grad)" />
        <polygon points="16,8 22,14 16,24 10,14" fill="#0c0a09" />
        <polygon points="16,11 19,14 16,19 13,14" fill="#38bdf8" />
        <defs>
          <linearGradient id="dia-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (normalizedRank.includes("platinum")) {
    return (
      <svg className="w-8 h-8 filter drop-shadow-[0_0_4px_rgba(45,212,191,0.6)]" viewBox="0 0 32 32" fill="none">
        <polygon points="16,4 27,9 23,25 16,28 9,25 5,9" fill="url(#plat-grad)" />
        <polygon points="16,7 23,11 20,22 16,25 12,22 9,11" fill="#0c0a09" />
        <circle cx="16" cy="16" r="4" fill="#2dd4bf" />
        <defs>
          <linearGradient id="plat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2dd4bf" />
            <stop offset="100%" stopColor="#0f766e" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (normalizedRank.includes("gold")) {
    return (
      <svg className="w-8 h-8 filter drop-shadow-[0_0_4px_rgba(251,191,36,0.6)]" viewBox="0 0 32 32" fill="none">
        <polygon points="16,4 26,8 26,22 16,28 6,22 6,8" fill="url(#gold-grad)" />
        <polygon points="16,7 23,10 23,20 16,25 9,20 9,10" fill="#0c0a09" />
        <polygon points="16,11 19,13 19,17 16,21 13,17 13,13" fill="#fbbf24" />
        <defs>
          <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (normalizedRank.includes("silver")) {
    return (
      <svg className="w-8 h-8 filter drop-shadow-[0_0_3px_rgba(156,163,175,0.5)]" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" fill="url(#silver-grad)" />
        <circle cx="16" cy="16" r="9" fill="#0c0a09" />
        <polygon points="16,10 19,13 19,19 16,22 13,19 13,13" fill="#9ca3af" />
        <defs>
          <linearGradient id="silver-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d1d5db" />
            <stop offset="100%" stopColor="#6b7280" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (normalizedRank.includes("bronze")) {
    return (
      <svg className="w-8 h-8 filter drop-shadow-[0_0_3px_rgba(180,83,9,0.5)]" viewBox="0 0 32 32" fill="none">
        <polygon points="16,4 27,15 16,26 5,15" fill="url(#bronze-grad)" />
        <polygon points="16,8 23,15 16,22 9,15" fill="#0c0a09" />
        <circle cx="16" cy="15" r="2" fill="#b45309" />
        <defs>
          <linearGradient id="bronze-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ca8a04" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  if (normalizedRank.includes("iron")) {
    return (
      <svg className="w-8 h-8 filter drop-shadow-[0_0_2px_rgba(100,116,139,0.4)]" viewBox="0 0 32 32" fill="none">
        <polygon points="8,4 24,4 28,16 16,28 4,16" fill="url(#iron-grad)" />
        <polygon points="10,6 22,6 25,15 16,25 7,15" fill="#0c0a09" />
        <defs>
          <linearGradient id="iron-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
        </defs>
      </svg>
    );
  }

  // Unranked / fallback
  return (
    <svg className="w-8 h-8 opacity-40" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="10" stroke="#475569" strokeWidth="2" />
      <circle cx="16" cy="16" r="4" fill="#475569" />
    </svg>
  );
};

const Leaderboard = () => {
  const [dbData, setDbData] = useState(null);
  const [currentActNum, setCurrentActNum] = useState("8");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPointsGuideOpen, setIsPointsGuideOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch leaderboard data
  useEffect(() => {
    const dbUrl = import.meta.env.VITE_FIREBASE_DB_URL;
    
    const loadMockData = () => {
      const cached = localStorage.getItem("cyscom_leaderboard_data");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          setDbData(parsed);
          const actsKeys = Object.keys(parsed.acts);
          if (actsKeys.length > 0) {
            setCurrentActNum(actsKeys[actsKeys.length - 1]);
          }
          setLoading(false);
          return;
        } catch (e) {
          console.error("Local storage leaderboard parsing error:", e);
        }
      }

      fetch("/data/leaderboard-mock.json")
        .then((res) => {
          if (!res.ok) throw new Error("Could not load local scores");
          return res.json();
        })
        .then((data) => {
          setDbData(data);
          localStorage.setItem("cyscom_leaderboard_data", JSON.stringify(data));
          // Set to the latest act available in mock data
          const actsKeys = Object.keys(data.acts);
          if (actsKeys.length > 0) {
            setCurrentActNum(actsKeys[actsKeys.length - 1]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Local data load failed:", err);
          setLoading(false);
        });
    };

    if (dbUrl) {
      // Connect directly to Firebase REST API
      const normalizedUrl = dbUrl.replace(/\/$/, "");
      
      const fetchLiveLeaderboard = async () => {
        try {
          // Firebase Realtime DB URL queries the entire /vitcc/owasp node
          const res = await fetch(`${normalizedUrl}/vitcc/owasp.json`);
          if (!res.ok) throw new Error("Database network error");
          const rawDb = await res.json();
          
          if (!rawDb) throw new Error("Database empty");
          
          // Reformat live firebase structure to match local mock format
          const acts = {};
          let maxAct = 1;
          
          Object.keys(rawDb).forEach(key => {
            if (key.startsWith("leaderboard-act")) {
              const actNumber = key.replace("leaderboard-act", "");
              const membersList = [];
              const cabinetList = [];
              const rawMembers = rawDb[key];
              
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
              
              // Sort members by Rating descending
              membersList.sort((a, b) => b.Rating - a.Rating);
              cabinetList.sort((a, b) => b.Rating - a.Rating);
              
              const actInt = parseInt(actNumber);
              if (actInt > maxAct) maxAct = actInt;
              
              acts[actNumber] = {
                name: `ACT ${actNumber} - ${2017 + actInt}`, // Approximation of year
                cabinet: cabinetList,
                members: membersList,
                wizard: null
              };
            }
          });
          
          // Inject announcements/wizard if present
          if (rawDb.announcements && rawDb.announcements.current_wizard) {
            const wz = rawDb.announcements.current_wizard;
            // Place it in the max/latest act
            if (acts[maxAct]) {
              acts[maxAct].wizard = wz;
            }
          }
          
          setDbData({ acts });
          setCurrentActNum(String(maxAct));
          setLoading(false);
        } catch (e) {
          console.error("Firebase read failure, falling back to mock:", e);
          loadMockData();
        }
      };
      
      fetchLiveLeaderboard();
    } else {
      // No firebase url defined, fallback to local mock database file
      loadMockData();
    }
  }, []);

  // Filtered leaderboard calculations
  const activeActData = useMemo(() => {
    if (!dbData || !dbData.acts[currentActNum]) return null;
    return dbData.acts[currentActNum];
  }, [dbData, currentActNum]);

  const sortedActMembers = useMemo(() => {
    if (!activeActData) return [];
    
    // Sort and calculate dynamic badges if 'Image' is missing or unranked
    return activeActData.members.map((member, index) => {
      // Assign dynamic rank tags based on descending rating if not set by DB
      let displayBadge = member.Image || "unranked";
      
      if (!member.Image || member.Image === "unranked") {
        if (member.Rating >= 750) displayBadge = "ascendent-1";
        else if (member.Rating >= 500) displayBadge = "diamond-1";
        else if (member.Rating >= 300) displayBadge = "platinum-1";
        else if (member.Rating >= 150) displayBadge = "gold-1";
        else if (member.Rating >= 100) displayBadge = "silver-1";
        else if (member.Rating >= 70) displayBadge = "bronze-1";
        else if (member.Rating >= 40) displayBadge = "iron-1";
      }
      
      return {
        ...member,
        calculatedBadge: displayBadge,
        rankIndex: index + 1
      };
    });
  }, [activeActData]);

  const filteredMembers = useMemo(() => {
    return sortedActMembers.filter((m) =>
      m.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [sortedActMembers, searchQuery]);

  const filteredCabinet = useMemo(() => {
    if (!activeActData) return [];
    return activeActData.cabinet.filter((c) =>
      c.Name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeActData, searchQuery]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] select-none">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-mono text-blue-400">Loading scores...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-10 select-none relative z-10">
      
      {/* Background Grids */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-10" />

      {/* Header Titles */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="px-3 py-1 rounded-full border border-blue-500/20 bg-blue-950/20 text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-3 animate-pulse">
          Live Rankings Node
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white font-zentry tracking-wider uppercase">
          CONTRIBUTOR <span className="text-blue-400">LEADERBOARD</span>
        </h1>
        <p className="mt-2 text-xs md:text-sm text-blue-200/50 font-mono">
          Visualizing Project Contributions across CYSCOM VIT Acts
        </p>
      </div>

      {/* Dashboard Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
        
        {/* Search Box */}
        <div className="relative min-h-screen w-full bg-black text-blue-50 overflow-x-hidden pt-24 pb-20 md:w-80">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-blue-500/50 text-sm" />
          <input
            type="text"
            placeholder="Search contributor name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/60 border border-blue-900/30 rounded-full pl-10 pr-4 py-2.5 text-xs font-mono focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 text-white transition-all cursor-target"
          />
        </div>

        {/* Act Selector */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <span className="text-xs font-mono text-blue-400/80">Select Timeline:</span>
          <div className="relative">
            <select
              value={currentActNum}
              onChange={(e) => setCurrentActNum(e.target.value)}
              className="bg-black/85 border border-blue-900/40 rounded px-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-blue-500/60 cursor-target pr-8 appearance-none"
            >
              {dbData &&
                Object.keys(dbData.acts)
                  .sort((a, b) => Number(b) - Number(a))
                  .map((key) => (
                    <option key={key} value={key}>
                      {dbData.acts[key].name}
                    </option>
                  ))}
            </select>
            <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-blue-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Wizard of the Fortnight */}
      {activeActData?.wizard?.active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-10 p-6 rounded-lg cyber-card border-yellow-500/20 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(251,191,36,0.05) 0%, rgba(0,0,0,0.9) 100%)",
            boxShadow: "0 0 20px rgba(251,191,36,0.05), inset 0 0 15px rgba(251,191,36,0.02)"
          }}
        >
          {/* Glowing yellow lights */}
          <div className="absolute -right-16 -top-16 w-32 h-32 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="p-4 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-3xl animate-bounce">
              <FaCrown />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <span className="text-[10px] font-mono text-yellow-400 uppercase tracking-[0.2em] font-semibold">
                Wizard of the Fortnight
              </span>
              <h2 className="text-xl md:text-2xl font-zentry font-black text-white uppercase mt-1">
                {activeActData.wizard.wizard_name}
              </h2>
              <p className="text-xs font-mono text-blue-200/50 mt-1.5 leading-relaxed">
                Celebrating outstanding contributions and driving community impact. Active through:{" "}
                <span className="text-yellow-300 font-bold">
                  {activeActData.wizard.expires_at 
                    ? new Date(activeActData.wizard.expires_at).toLocaleDateString()
                    : "Fortnight Expiry"}
                </span>
              </p>
            </div>
            <div className="px-5 py-2.5 rounded border border-yellow-500/30 bg-yellow-500/5 font-mono text-center">
              <span className="block text-[10px] text-yellow-400/80 uppercase">Activity Points</span>
              <span className="text-2xl font-bold text-yellow-300">
                +{activeActData.wizard.points || 80}
              </span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main Tables Grid */}
      <div className="grid grid-cols-1 gap-10">
        
        {/* Cabinet Members Table */}
        {filteredCabinet.length > 0 && (
          <div className="flex flex-col">
            <h2 className="text-lg font-bold font-general uppercase tracking-widest text-white mb-4 flex items-center gap-2">
              <FaUserShield className="text-blue-500" /> Cabinet Members
            </h2>
            <div className="w-full overflow-x-auto border border-blue-900/20 bg-black/60 rounded-lg backdrop-blur-sm">
              <table className="w-full min-w-[600px] text-left border-collapse font-mono text-xs">
                <thead>
                  <tr className="border-b border-blue-900/30 bg-blue-950/20 text-blue-400 font-semibold uppercase">
                    <th className="py-4 px-6 text-center w-20">Rank</th>
                    <th className="py-4 px-6 w-24 text-center">Badge</th>
                    <th className="py-4 px-6 w-28 text-center">Rating</th>
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6 text-right w-44">Ongoing Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCabinet.map((member, idx) => (
                    <tr 
                      key={idx}
                      className="border-b border-blue-950/40 hover:bg-blue-950/10 transition-colors"
                    >
                      <td className="py-4 px-6 text-center font-bold text-blue-500">#</td>
                      <td className="py-3 px-6 flex justify-center items-center">
                        <RankBadge rank="radiant" />
                      </td>
                      <td className="py-4 px-6 text-center font-bold text-white text-lg">∞</td>
                      <td className="py-4 px-6 font-bold text-white">{member.Name}</td>
                      <td className="py-4 px-6 text-right font-semibold text-blue-400">∞ Contributions</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Regular Members Table */}
        <div className="flex flex-col">
          <h2 className="text-lg font-bold font-general uppercase tracking-widest text-white mb-4 flex items-center gap-2">
            <FaAward className="text-blue-500" /> Contributor Rankings
          </h2>
          <div className="w-full overflow-x-auto border border-blue-900/20 bg-black/60 rounded-lg backdrop-blur-sm">
            <table className="w-full min-w-[600px] text-left border-collapse font-mono text-xs">
              <thead>
                <tr className="border-b border-blue-900/30 bg-blue-950/20 text-blue-400 font-semibold uppercase">
                  <th className="py-4 px-6 text-center w-20">Rank</th>
                  <th className="py-4 px-6 w-24 text-center">Tier</th>
                  <th className="py-4 px-6 w-28 text-center">Rating</th>
                  <th className="py-4 px-6">Name</th>
                  <th className="py-4 px-6 text-right w-44">Contributions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-950/40">
                {filteredMembers.length > 0 ? (
                  filteredMembers.map((member, idx) => (
                    <tr 
                      key={idx}
                      className="hover:bg-blue-950/10 transition-colors"
                    >
                      <td className="py-4 px-6 text-center font-bold text-blue-300">
                        {member.rankIndex}
                      </td>
                      <td className="py-3 px-6 flex justify-center items-center">
                        <RankBadge rank={member.calculatedBadge} />
                      </td>
                      <td className="py-4 px-6 text-center text-white font-bold">
                        {member.Rating}
                      </td>
                      <td className="py-4 px-6 text-blue-50">{member.Name}</td>
                      <td className="py-4 px-6 text-right font-semibold text-blue-300/80">
                        {member.Contributions}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-blue-400/50 italic">
                      No matching contributors found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Point Categories cheatsheet */}
      <div className="mt-14 border border-blue-900/20 bg-black/40 rounded-lg p-6">
        <button
          onClick={() => setIsPointsGuideOpen(!isPointsGuideOpen)}
          className="w-full flex items-center justify-between text-white hover:text-blue-400 transition-colors font-general uppercase tracking-wider text-sm cursor-target"
        >
          <span className="flex items-center gap-2">
            <FaInfoCircle className="text-blue-500" /> Point Allocation Structure
          </span>
          {isPointsGuideOpen ? <FaChevronUp /> : <FaChevronDown />}
        </button>

        <AnimatePresence>
          {isPointsGuideOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden mt-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4 border-t border-blue-950/40">
                {POINT_CATEGORIES.map((cat, idx) => (
                  <div 
                    key={idx} 
                    className="p-3 border border-blue-950 rounded bg-blue-950/10 flex flex-col justify-between"
                  >
                    <span className="text-[9px] font-mono text-blue-500 uppercase font-semibold">
                      {cat.cat}
                    </span>
                    <span className="text-xs text-white font-bold mt-1 line-clamp-1">{cat.name}</span>
                    <span className="text-sm font-bold text-blue-400 mt-2">+{cat.points} pts</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Leaderboard;
