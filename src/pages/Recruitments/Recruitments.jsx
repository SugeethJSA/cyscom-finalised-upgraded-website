import React from 'react';
import { motion } from 'framer-motion';
import { FaUserAstronaut, FaRocket } from 'react-icons/fa';

const Recruitments = () => {
  return (
    <div className="min-h-screen bg-black text-white pt-24 px-6 md:px-12 pb-20 relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background decorations matching blog aesthetics */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl mx-auto text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-[0_0_30px_rgba(59,130,246,0.15)] relative">
            <FaUserAstronaut className="text-4xl" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 border border-dashed border-blue-500/20 rounded-3xl"
            />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-blue-400">
          Recruitments
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 mb-10 max-w-xl mx-auto leading-relaxed">
          The next generation of cybersecurity enthusiasts is loading. Are you ready to join the elite ranks?
        </p>

        <div className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-blue-600/10 border border-blue-500/20 shadow-xl backdrop-blur-md">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
          </span>
          <span className="text-blue-100 font-semibold tracking-wider uppercase text-sm">Coming Soon</span>
          <FaRocket className="text-blue-400 ml-2 animate-bounce" />
        </div>
      </motion.div>

      {/* Cyber grid floor */}
      <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none border-t border-blue-900/20" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
    </div>
  );
};

export default Recruitments;
