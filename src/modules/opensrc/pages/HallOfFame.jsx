import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTrophy, FaChevronRight } from "react-icons/fa";
import { apiRequest } from "../utils/api";

const HallOfFame = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHof = async () => {
      try {
        const res = await apiRequest("/api/hall-of-fame?status=approved");
        setSubmissions(res.hall_of_fame || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHof();
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Hackathons", "Ideathons", "Quizzes", "Security/CTF", "Other"];

  const filteredSubmissions = useMemo(() => {
    if (activeCategory === "All") return submissions;
    return submissions.filter(s => s.category === activeCategory || (s.category !== activeCategory && activeCategory === "Other" && !["Hackathons", "Ideathons", "Quizzes", "Security/CTF"].includes(s.category)));
  }, [activeCategory, submissions]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10 select-none">
      
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-10" />

      {/* Header Summary */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="px-3 py-1 rounded-full border border-blue-500/20 bg-blue-950/20 text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-3 animate-pulse">
          Hall of Fame Node
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white font-zentry tracking-wider uppercase">
          OUR SHINING <span className="text-blue-400">STARS</span>
        </h1>
        <p className="mt-2 text-xs md:text-sm text-blue-200/50 font-mono">
          Celebrating event winners, tech leaders, and coding champions
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        {categories.map((cat, idx) => (
          <button
            key={idx}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full border text-xs font-mono transition-all duration-300 cursor-target ${
              activeCategory === cat
                ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                : "border-blue-900/30 bg-blue-950/5 text-blue-300/60 hover:text-blue-300 hover:border-blue-500/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events / Submissions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredSubmissions.map((sub, idx) => (
            <motion.div
              key={sub.id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col rounded-lg cyber-card border border-blue-900/30 bg-blue-950/5 p-6 relative overflow-hidden group hover:border-blue-500/50"
            >
              {/* Glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white tracking-tight leading-tight uppercase font-zentry">
                  {sub.user_name}
                </h3>
                <span className="text-[10px] font-mono bg-blue-900/30 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-sm uppercase">
                  {sub.category}
                </span>
              </div>
              
              <p className="text-sm text-blue-200/60 font-mono mb-4 flex-grow">
                {sub.reason}
              </p>

              {sub.proof_url && (
                <div className="mt-auto border-t border-blue-900/30 pt-4 flex justify-between items-center text-xs font-mono">
                  <a href={sub.proof_url} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-white flex items-center gap-1 cursor-target">
                    View Verification <FaChevronRight size={10} />
                  </a>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {isLoading && <div className="text-center text-blue-500 font-mono mt-8 animate-pulse">Syncing Hall of Fame Records...</div>}
      {!isLoading && filteredSubmissions.length === 0 && (
        <div className="text-center text-blue-200/40 font-mono mt-8 border border-dashed border-blue-900/30 p-10 rounded-xl">
          No records found in this category.
        </div>
      )}
    </div>
  );
};

export default HallOfFame;
