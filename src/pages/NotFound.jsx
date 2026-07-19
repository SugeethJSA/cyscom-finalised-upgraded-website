import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ParticleBackground } from "@cyscomvit/cyscomui";
import { FaHome, FaTerminal } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center overflow-hidden">
      {/* CYSCOMUI Particle Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <ParticleBackground />
      </div>

      {/* Atmospheric Blue Hues */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/15 rounded-full blur-[150px] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl mx-auto text-center px-6"
      >
        <motion.div 
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="absolute -inset-4 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-black/50 border border-blue-500/30 text-blue-400 backdrop-blur-xl relative shadow-[0_0_40px_rgba(59,130,246,0.3)]">
              <FaTerminal className="text-4xl" />
            </div>
          </div>
        </motion.div>

        <h1 className="text-8xl md:text-[10rem] font-black tracking-tighter mb-2 text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-blue-900/50 select-none drop-shadow-2xl">
          404
        </h1>
        
        <h2 className="text-2xl md:text-4xl font-bold tracking-widest uppercase mb-6 text-white/90 font-mono">
          System Override <span className="text-blue-500">Failed</span>
        </h2>

        <p className="text-lg md:text-xl text-white/50 mb-12 max-w-lg mx-auto leading-relaxed font-light">
          The requested trajectory is invalid. The coordinates you are trying to reach do not exist within the mainframe.
        </p>

        <div className="flex justify-center">
          <button 
            onClick={() => navigate('/')}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent overflow-hidden rounded-xl border border-blue-500/30 hover:border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all duration-300 backdrop-blur-md"
          >
            <div className="absolute inset-0 w-0 bg-blue-600/20 transition-all duration-300 ease-out group-hover:w-full" />
            <FaHome className="text-blue-400 group-hover:scale-110 transition-transform relative z-10" />
            <span className="text-blue-50 font-bold tracking-[0.2em] text-sm relative z-10 uppercase">
              Return to Base
            </span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
