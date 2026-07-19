import React, { useState, useEffect } from 'react';
import { FaExternalLinkAlt, FaLink } from 'react-icons/fa';
import { motion } from 'framer-motion';

const LinkPreview = ({ url, originalText }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const response = await fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`);
        const result = await response.json();
        
        if (result.status === 'success' && result.data) {
          setData(result.data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [url]);

  if (loading) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block max-w-2xl my-6">
        <div className="flex items-center justify-center p-6 rounded-xl border border-white/[0.05] bg-white/[0.01] animate-pulse">
          <div className="flex items-center gap-3 text-white/30 text-xs font-mono">
            <FaLink className="animate-bounce" /> Loading preview...
          </div>
        </div>
      </a>
    );
  }

  if (error || !data) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/30 hover:decoration-blue-400 transition-all my-1">
        {originalText || url} <FaExternalLinkAlt className="text-[10px] opacity-50" />
      </a>
    );
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block max-w-[500px] my-3 group relative !no-underline hover:!no-underline">
      <motion.div 
        whileHover={{ y: -2 }}
        className="flex flex-row overflow-hidden rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-md hover:border-blue-500/40 hover:bg-white/[0.04] transition-all duration-300 shadow-lg shadow-black/20 min-h-[5.5rem] sm:min-h-[6.5rem] items-stretch"
      >
        {/* Image Section (Left) */}
        {data.image && data.image.url ? (
          <div className="w-24 sm:w-28 shrink-0 bg-white/5 border-r border-white/[0.05] relative overflow-hidden flex items-center justify-center">
            <img 
              src={data.image.url} 
              alt={data.title || 'Link preview'} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out block"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-24 sm:w-28 shrink-0 bg-black/50 border-r border-white/[0.05] flex items-center justify-center">
             {data.logo && data.logo.url ? (
               <img src={data.logo.url} alt="Logo" className="w-7 h-7 rounded-md opacity-80" />
             ) : (
               <FaLink className="text-xl text-white/20" />
             )}
          </div>
        )}

        {/* Content Section (Right) */}
        <div className="p-2.5 sm:p-3.5 flex flex-col flex-grow min-w-0 justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-white/90 mb-1.5 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">
            {data.title || url}
          </h3>
          
          <p className="text-[10px] sm:text-xs text-white/40 line-clamp-2 leading-relaxed mb-2.5">
            {data.description || url}
          </p>

          <div className="mt-auto flex items-center gap-1.5 text-[9px] uppercase font-bold tracking-widest text-white/20 truncate">
            {data.logo && data.logo.url && !data.image?.url && (
              <img src={data.logo.url} alt="Site logo" className="w-3 h-3 rounded-sm opacity-50" />
            )}
            <span className="truncate">{data.publisher || new URL(url).hostname}</span>
          </div>
        </div>
      </motion.div>
    </a>
  );
};

export default LinkPreview;
