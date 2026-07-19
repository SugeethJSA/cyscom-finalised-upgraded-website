import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Upload, Github, Globe } from 'lucide-react';

const MOCK_PROJECTS = [
  {
    id: 'p1',
    name: 'CYSCOM Cyber Scanner',
    author: 'Sugeeth JSA',
    description: 'An offline-first PWA QR scanner built for events registration in high-latency network scenarios.',
    tags: ['React', 'PWA', 'IndexedDB'],
    rating: 4.8,
    votes: 42,
    github: 'https://github.com/cyscomvit/scanner'
  },
  {
    id: 'p2',
    name: 'OpenSRC Portal',
    author: 'Anirudh CV',
    description: 'The centralized hub for certificates, achievements, and open-source leaderboards.',
    tags: ['Vite', 'Three.js', 'Tailwind'],
    rating: 4.9,
    votes: 56,
    github: 'https://github.com/cyscomvit/opensrc'
  }
];

export default function ProjectShowcase() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [userRatings, setUserRatings] = useState({});

  const handleRating = (projectId, rating) => {
    setUserRatings(prev => ({ ...prev, [projectId]: rating }));
    // In a real app, send rating to backend
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 relative z-10 select-none">
      <div className="flex flex-col items-center text-center mb-16">
        <div className="px-3 py-1 rounded-full border border-blue-500/20 bg-blue-950/20 text-[10px] font-mono text-blue-400 uppercase tracking-widest mb-3">
          Innovation Hub
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white font-zentry tracking-wider uppercase">
          PROJECT <span className="text-blue-400">SHOWCASE</span>
        </h1>
        <p className="mt-4 text-xs md:text-sm text-blue-200/50 font-mono max-w-2xl">
          Discover, rate, and get inspired by projects and CTF writeups developed by the CYSCOM community during our flagship events.
        </p>
        <button className="mt-6 px-6 py-2 border border-blue-500/50 text-blue-400 font-mono text-xs hover:bg-blue-950/30 transition-colors uppercase tracking-widest flex items-center gap-2 rounded cursor-target">
          <Upload size={14} /> Submit Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {projects.map((project) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 glow-effect relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{project.name}</h3>
                <p className="text-xs text-blue-400 font-mono">by {project.author}</p>
              </div>
              <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-full">
                <Star className="text-yellow-500" size={14} fill="currentColor" />
                <span className="text-xs text-white font-bold">{project.rating.toFixed(1)}</span>
                <span className="text-[10px] text-zinc-500">({project.votes})</span>
              </div>
            </div>

            <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2 mb-6">
              {project.tags.map(tag => (
                <span key={tag} className="px-2 py-1 text-[10px] font-mono text-blue-300 bg-blue-950/30 border border-blue-900/40 rounded uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-zinc-500 uppercase tracking-widest mr-2">Rate:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRating(project.id, star)}
                    className="cursor-target hover:scale-110 transition-transform"
                  >
                    <Star 
                      size={16} 
                      className={`${(userRatings[project.id] || 0) >= star ? 'text-yellow-500' : 'text-zinc-600'} hover:text-yellow-400 transition-colors`}
                      fill={(userRatings[project.id] || 0) >= star ? "currentColor" : "none"}
                    />
                  </button>
                ))}
              </div>

              <a 
                href={project.github}
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors cursor-target"
              >
                <Github size={14} /> Repository
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
