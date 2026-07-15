import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FaGithub, FaStar, FaCodeBranch, FaExternalLinkAlt, FaAward, FaTrophy, FaHistory, FaFolderOpen } from "react-icons/fa";
import { TiLocationArrow } from "react-icons/ti";
import { Button } from "@SugeethJSA/cyscomui";

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

const portals = [
  {
    title: "Points Leaderboard",
    desc: "Check active student contributions, rankings, and who crowned the Wizard of the Fortnight.",
    link: "leaderboard",
    icon: <FaAward className="text-3xl text-yellow-300" />,
    color: "border-yellow-500/20 hover:border-yellow-500/50 hover:shadow-yellow-500/10"
  },
  {
    title: "Certificates Locker",
    desc: "Retrieve, view, and download your official participation credentials and certificates.",
    link: "locker",
    icon: <FaFolderOpen className="text-3xl text-blue-400" />,
    color: "border-blue-500/20 hover:border-blue-500/50 hover:shadow-blue-500/10"
  },
  {
    title: "Hall of Fame",
    desc: "Celebrate Cyscom VIT event winners, shining stars, and hackathon Jedis.",
    link: "hall-of-fame",
    icon: <FaTrophy className="text-3xl text-pink-400" />,
    color: "border-pink-500/20 hover:border-pink-500/50 hover:shadow-pink-500/10"
  },
  {
    title: "Project Showcase",
    desc: "Rate and discover projects and writeups built by the community during our events.",
    link: "showcase",
    icon: <FaStar className="text-3xl text-purple-400" />,
    color: "border-purple-500/20 hover:border-purple-500/50 hover:shadow-purple-500/10"
  },
  {
    title: "Legacy Members",
    desc: "Discover past committee members, coordinators, and developers of Cyscom VIT.",
    link: "legacy",
    icon: <FaHistory className="text-3xl text-green-400" />,
    color: "border-green-500/20 hover:border-green-500/50 hover:shadow-green-500/10"
  }
];

const Home = () => {
  const [projectsList] = useState(() => {
    try {
      const cached = localStorage.getItem("cyscom_projects");
      if (cached) {
        const parsed = JSON.parse(cached);
        return Array.isArray(parsed) ? parsed : Object.values(parsed);
      }
      return DEFAULT_PROJECTS;
    } catch {
      return DEFAULT_PROJECTS;
    }
  });

  return (
    <div className="relative w-full pb-20 select-none">
      
      {/* Background Matrix/Cyber effects */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-10" />

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 pt-10 md:pt-16 pb-12 flex flex-col items-center justify-center text-center">
        
        {/* Glowing Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-950/20 text-xs font-mono text-blue-300 tracking-[0.2em] uppercase"
        >
          Open Source Node
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-heading text-white select-none"
        >
          CYSCOM <span className="text-blue-400">OPENSRC</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mx-auto mt-4 text-sm md:text-base text-blue-200/70 font-mono tracking-wide leading-relaxed"
        >
          Welcome to the open-source hub of CYSCOM VIT Chennai. We build, share, and collaborate on software utilities, cybersecurity blogs, and CTF platforms.
        </motion.p>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 flex justify-center gap-4 flex-wrap"
        >
          <Button
            title="Explore Leaderboard"
            rightIcon={<TiLocationArrow />}
            onClick={() => window.location.href = "/opensrc/leaderboard"}
            containerClass="bg-blue-600 border border-blue-500/30 cursor-target shadow-lg shadow-blue-500/20"
          />
          <a
            href="https://github.com/cyscomvit"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-blue-500/30 text-xs uppercase font-general font-semibold tracking-wider text-white bg-blue-950/10 hover:bg-blue-900/20 transition-all duration-300 hover:scale-105 cursor-target"
          >
            <FaGithub className="text-sm" /> GitHub Profile
          </a>
        </motion.div>
      </section>

      {/* Portals Gateway Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10">
        <h2 className="text-xl md:text-2xl font-zentry uppercase tracking-widest text-center text-white mb-10">
          Open Source <span className="text-blue-400">Portals</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {portals.map((portal, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link
                to={portal.link}
                className={`flex flex-col h-full p-6 rounded-lg cyber-card border ${portal.color} transition-all duration-300 cursor-target`}
              >
                <div className="mb-4">{portal.icon}</div>
                <h3 className="text-lg font-bold text-white font-general uppercase tracking-wide mb-2">{portal.title}</h3>
                <p className="text-xs text-blue-200/60 leading-relaxed font-mono mt-auto">{portal.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Showcase Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-14 relative z-10">
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <h2 className="text-xl md:text-2xl font-zentry uppercase tracking-widest text-white">
            Featured <span className="text-blue-400">Repositories</span>
          </h2>
          <div className="h-0.5 w-16 bg-blue-500 mt-3 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projectsList.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="flex flex-col p-6 rounded-lg cyber-card border border-blue-900/30"
            >
              {/* Repository Title */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <FaGithub className="text-2xl text-blue-400" />
                  <span className="text-lg font-bold text-white font-mono tracking-tight">{project.name}</span>
                </div>
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-white transition-colors cursor-target p-2 border border-blue-900/50 bg-blue-950/20 rounded-full hover:border-blue-500/40"
                >
                  <FaExternalLinkAlt className="text-xs" />
                </a>
              </div>

              {/* Description */}
              <p className="text-xs text-blue-200/70 font-mono leading-relaxed mb-6">
                {project.desc}
              </p>

              {/* Tech Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {(project.tech || []).map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full border border-blue-500/20 bg-blue-950/30 text-[10px] font-mono text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats & Contributors */}
              <div className="flex items-center gap-6 mt-auto pt-4 border-t border-blue-950/40 text-xs font-mono text-blue-400/80">
                <span className="flex items-center gap-1.5">
                  <FaStar className="text-yellow-400" /> {project.stars} Stars
                </span>
                <span className="flex items-center gap-1.5">
                  <FaCodeBranch className="text-green-400" /> {project.forks} Forks
                </span>
                <span className="ml-auto text-[10px] uppercase text-blue-500 font-semibold tracking-wider">
                  Active
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
