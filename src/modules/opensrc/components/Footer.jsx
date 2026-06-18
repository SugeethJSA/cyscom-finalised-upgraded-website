import { FaDiscord, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const socialLinks = [
  { href: "https://discord.gg/cRZ9gsC3", icon: <FaDiscord /> },
  { href: "https://www.instagram.com/cyscomvit/", icon: <FaInstagram /> },
  { href: "https://www.linkedin.com/company/cyscomvit/", icon: <FaLinkedin /> },
  { href: "https://github.com/cyscomvit", icon: <FaGithub /> },
];

const Footer = () => {
  return (
    <footer className="w-full py-8 text-white bg-black border-t border-blue-900/30 print:hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col items-center justify-between gap-6 md:flex-row">
        
        {/* Left Side Info */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <Link to="/" className="flex items-center gap-2 cursor-target">
            <img src="/img/logo.png" alt="CYSCOM Logo" className="w-6 h-6 rounded-full" />
            <span className="font-zentry text-lg tracking-wider">CYSCOM <span className="text-blue-400">OPENSRC</span></span>
          </Link>
          <p className="text-center text-xs font-mono text-blue-400/60 md:text-left">
            © {new Date().getFullYear()} CYSCOM VIT Chennai. All Rights Reserved.
          </p>
        </div>

        {/* Center Links */}
        <div className="flex flex-wrap justify-center gap-6 text-xs font-mono text-blue-300/80">
          <Link to="/leaderboard" className="hover:text-blue-400 hover:underline cursor-target">Leaderboard</Link>
          <Link to="/locker" className="hover:text-blue-400 hover:underline cursor-target">Certificates</Link>
          <Link to="/hall-of-fame" className="hover:text-blue-400 hover:underline cursor-target">Hall of Fame</Link>
          <Link to="/legacy" className="hover:text-blue-400 hover:underline cursor-target">Legacy</Link>
          <a href="/" className="hover:text-blue-400 hover:underline cursor-target">Main Site</a>
        </div>

        {/* Right Side Social Links */}
        <div className="flex justify-center gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-white transition-all duration-300 hover:scale-110 text-xl cursor-target p-2 border border-blue-900/40 rounded-full hover:border-blue-500/50 bg-blue-950/20"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
