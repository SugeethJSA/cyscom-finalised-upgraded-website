import { useEffect, useState, useRef } from "react";
import gsap from "gsap";

const Preloader = ({ assets = [], onComplete }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [loadedFiles, setLoadedFiles] = useState([]);
  const [terminalGibberish, setTerminalGibberish] = useState('');
  const gibberishIntervalRef = useRef(null);
  const particlesRef = useRef([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef(null);

  // Generate random terminal-style loading messages
  const generateGibberish = () => {
    const cyberFiles = [
      'main.jsx', 'App.jsx', 'Home.jsx', 'PostDetail.jsx', 'posts.json',
      'TargetCursor.jsx', 'Preloader.jsx', 'Navbar.jsx', 'Hero.jsx', 'PostCard.jsx',
      'tailwind.config.js', 'index.css', 'gsap.min.js', 'framer-motion.js',
      'zentry-font.woff2', 'robert-medium.woff2', 'circular-web.woff2',
      'logo.png', 'cyber-grid.css', 'matrix-particles.js', 'security-hash.dll'
    ];
    
    const prefixes = ['Loading', 'Initializing', 'Decrypting', 'Securing', 'Mounting', 'Verifying'];
    const statuses = ['OK', 'DONE', 'READY', 'LOADED', 'SECURE'];
    
    const file = cyberFiles[Math.floor(Math.random() * cyberFiles.length)];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    return `${prefix} ${file}... [${status}]`;
  };

  // Start terminal logs animation
  useEffect(() => {
    gibberishIntervalRef.current = setInterval(() => {
      setTerminalGibberish(generateGibberish());
    }, 120);

    return () => {
      if (gibberishIntervalRef.current) {
        clearInterval(gibberishIntervalRef.current);
      }
    };
  }, []);

  // Spatial-hash-based particle network on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const cellSize = 100;
    const grid = new Map();
    
    const getCellKey = (x, y) => {
      const cx = Math.floor(x / cellSize);
      const cy = Math.floor(y / cellSize);
      return `${cx},${cy}`;
    };

    const getNeighbors = (x, y, radius) => {
      const neighbors = [];
      const cellX = Math.floor(x / cellSize);
      const cellY = Math.floor(y / cellSize);
      const cellRadius = Math.ceil(radius / cellSize);
      
      for (let dx = -cellRadius; dx <= cellRadius; dx++) {
        for (let dy = -cellRadius; dy <= cellRadius; dy++) {
          const key = `${cellX + dx},${cellY + dy}`;
          const cell = grid.get(key);
          if (cell) neighbors.push(...cell);
        }
      }
      return neighbors;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.cellKey = getCellKey(this.x, this.y);
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
        
        this.cellKey = getCellKey(this.x, this.y);
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(59, 130, 246, ${this.opacity})`;
        ctx.fill();
      }
    }

    const particleCount = 40;
    particlesRef.current = Array.from({ length: particleCount }, () => new Particle());

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      grid.clear();
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw();
        
        const cell = grid.get(particle.cellKey);
        if (cell) cell.push(particle);
        else grid.set(particle.cellKey, [particle]);
      });

      const mouse = mouseRef.current;
      const connectionDistance = 160;
      const mouseNeighbors = getNeighbors(mouse.x, mouse.y, connectionDistance);
      
      mouseNeighbors.forEach(particle => {
        const dx = mouse.x - particle.x;
        const dy = mouse.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < connectionDistance) {
          const opacity = (1 - distance / connectionDistance) * 0.4;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          const particleNeighbors = getNeighbors(particle.x, particle.y, 90);
          particleNeighbors.forEach(otherParticle => {
            if (otherParticle === particle) return;
            const dx2 = particle.x - otherParticle.x;
            const dy2 = particle.y - otherParticle.y;
            const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (distance2 < 90) {
              const opacity2 = (1 - distance2 / 90) * 0.2;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.strokeStyle = `rgba(96, 165, 250, ${opacity2})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          });
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Preloading simulation / actual load logic
  useEffect(() => {
    let active = true;

    if (!assets || assets.length === 0) {
      // Simulated loading sequence
      let currentProgress = 0;
      const interval = setInterval(() => {
        if (!active) return;
        
        // Random step increases for realistic loading simulation
        const increment = Math.floor(Math.random() * 15) + 5;
        currentProgress = Math.min(100, currentProgress + increment);
        setProgress(currentProgress);
        
        // Track mock file loads
        const mockFiles = ['posts.json', 'zentry-font.woff2', 'logo.png', 'Navbar.jsx', 'Home.jsx', 'App.css'];
        const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
        setLoadedFiles(prev => {
          if (prev.includes(randomFile)) return prev;
          return [...prev, randomFile];
        });

        if (currentProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (!active) return;
            gsap.to(containerRef.current, {
              opacity: 0,
              duration: 0.6,
              ease: "power2.inOut",
              onComplete: () => {
                onComplete?.();
              }
            });
          }, 600);
        }
      }, 200);

      return () => {
        active = false;
        clearInterval(interval);
      };
    } else {
      // Actual asset preloading logic
      let loaded = 0;
      const totalAssets = assets.length;
      
      const updateProgress = (filename) => {
        if (!active) return;
        loaded++;
        setProgress(Math.min(100, Math.round((loaded / totalAssets) * 100)));
        setLoadedFiles(prev => [...prev, filename]);
      };

      assets.forEach(asset => {
        if (asset.type === 'font') {
          const font = new FontFace(asset.fontFamily, `url(${asset.src})`);
          font.load().then(() => {
            document.fonts.add(font);
            updateProgress(asset.src.split('/').pop());
          }).catch(() => {
            updateProgress(asset.src.split('/').pop());
          });
        } else if (asset.type === 'image') {
          const img = new Image();
          img.onload = () => updateProgress(asset.src.split('/').pop());
          img.onerror = () => updateProgress(asset.src.split('/').pop());
          img.src = asset.src;
        } else {
          updateProgress('Asset');
        }
      });
    }

    return () => {
      active = false;
    };
  }, [assets, onComplete]);

  // Complete preloader fadeout when actual assets finish loading
  useEffect(() => {
    if (assets.length > 0 && progress >= 100) {
      const timer = setTimeout(() => {
        gsap.to(containerRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.inOut",
          onComplete: () => {
            onComplete?.();
          }
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [progress, assets, onComplete]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black overflow-hidden select-none">
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />

      {/* Cyber Grid Background */}
      <div className="absolute inset-0 pointer-events-none cyber-grid opacity-20" style={{ zIndex: 0 }} />

      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-sm">
        
        {/* Glowing Headings */}
        <div className="flex flex-col items-center gap-1 mb-8">
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 font-zentry tracking-wider" style={{ filter: 'drop-shadow(0 0 8px rgba(6,182,212,0.4))' }}>
            CYSCOM
          </h1>
          <p className="text-blue-300/80 font-mono text-[10px] tracking-[0.25em] uppercase">
            Initializing Secure Node
          </p>
        </div>

        {/* Circular Progress Meter */}
        <div className="relative flex items-center justify-center mb-8">
          <svg className="w-40 h-40 -rotate-90 transform" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="65"
              stroke="rgba(30, 41, 59, 0.5)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="65"
              stroke="url(#preloader-grad)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 65}
              strokeDashoffset={2 * Math.PI * 65 * (1 - progress / 100)}
              className="transition-all duration-300 ease-out"
              style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))' }}
            />
            <defs>
              <linearGradient id="preloader-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center text with loading numbers */}
          <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-white">
            <span className="text-3xl font-bold tracking-tight">
              {progress}<span className="text-xs text-blue-400">%</span>
            </span>
          </div>
        </div>

        {/* Process Info logs */}
        <div className="w-64 bg-black/40 border border-blue-900/30 rounded p-3 backdrop-blur-sm mb-4">
          <div className="flex items-center gap-1.5 mb-1.5 justify-center">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-mono text-blue-300 uppercase tracking-widest">Process uplink</span>
          </div>
          <div className="text-green-400 text-xs font-mono truncate">
            {terminalGibberish || 'Booting kernels...'}
          </div>
        </div>

        {/* Loaded Files Log */}
        <div className="h-10 overflow-hidden text-left w-64">
          {loadedFiles.slice(-2).reverse().map((file, idx) => (
            <div key={idx} className="text-[9px] font-mono text-blue-400/50 truncate flex items-center gap-1">
              <span className="text-green-400">✓</span> {file}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Preloader;
