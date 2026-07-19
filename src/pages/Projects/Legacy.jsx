import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { apiRequest } from "./utils/api";

const DEFAULT_LEGACY = [
  {
    name: "Sugeeth JSA",
    post: "Cabinet Head & Lead Developer",
    github: "https://github.com/SugeethJSA",
    linkedin: "https://www.linkedin.com/in/sugeethjsa",
    pic: "/img/logo.png"
  }
];

const Legacy = () => {
  const [membersList, setMembersList] = useState(DEFAULT_LEGACY);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLegacy = async () => {
      try {
        const res = await apiRequest("/api/users/legacy");
        const data = res.legacy || res;
        const arr = Array.isArray(data) ? data : Object.values(data);
        if (arr && arr.length > 0) {
          // Map DB response to expected UI format
          setMembersList(arr.map(u => ({
            name: u.name,
            post: `Legacy Member (Est. ${new Date(u.legacy_date).getFullYear()})`,
            pic: "/img/logo.png"
          })));
        }
      } catch (err) {
        console.error("Failed to load legacy members:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLegacy();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10 select-none">
      
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-10" />

      {/* Header Info */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="px-3 py-1 rounded-full border border-blue-500/20 bg-blue-950/20 text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-3 animate-pulse">
          Archive Registry Node
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white font-zentry tracking-wider uppercase">
          THE CYSCOM <span className="text-blue-400">LEGACY</span>
        </h1>
        <p className="mt-2 text-xs md:text-sm text-blue-200/50 font-mono">
          Honoring the developers, creators, and coordinators who shaped Cyscom VIT VITC
        </p>
      </div>

      {/* Legacy Team Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {membersList.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="flex flex-col rounded-lg cyber-card border border-blue-900/20 bg-black/80 p-6 relative overflow-hidden"
          >
            {/* Hologram/Scanner line effect overlay */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30 animate-pulse pointer-events-none" />

            {/* Profile Picture */}
            <div className="relative w-24 h-24 rounded-full border border-blue-500/30 overflow-hidden mx-auto mb-6 bg-blue-950/10">
              <img
                src={member.pic}
                alt={member.name}
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
              />
              {/* Outer glowing border ring */}
              <div className="absolute inset-0 border border-blue-500/40 rounded-full animate-ping opacity-20 pointer-events-none" />
            </div>

            {/* Name and Role */}
            <div className="text-center mb-6">
              <h3 className="text-base font-bold text-white font-general uppercase tracking-wide">
                {member.name}
              </h3>
              <p className="text-[10px] font-mono text-blue-400 mt-1 uppercase tracking-wider">
                {member.post}
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 items-center justify-center mt-auto">
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-white transition-colors duration-300"
                >
                  GitHub
                </a>
              )}
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-blue-400 transition-colors duration-300"
                >
                  LinkedIn
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      {isLoading && <div className="text-center text-zinc-500 font-mono mt-8">Loading legacy records...</div>}
    </div>
  );
};

export default Legacy;
