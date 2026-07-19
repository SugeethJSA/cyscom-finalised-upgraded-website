import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Footer from "./Footer";

gsap.registerPlugin(ScrollTrigger);

const boardMembers = [
  { name: "Vijval Shah", role: "Chapter Leader", img: "/img/leads/chapter-lead.webp", quote: "In a world of UDP, be TCP." },
  { name: "Bharghav", role: "Chapter Manager", img: "/img/leads/chapter-manager.webp", quote: "I don't play the odds, I play the man" },
  { name: "Harsh Singh", role: "General Secretary (Tech)", img: "/img/leads/gen_sec_tech.webp", quote: "Antivirus can't fix dumb decisions" },
  { name: "Joshitha G", role: "General Secretary (Management)", img: "/img/leads/gen_sec_management.webp", quote: "Professional overthinker" },
  { name: "Goutham", role: "Treasurer", img: "/img/leads/treasurer.webp", quote: "Encryption is free, but security has a price." },
];

const cabinetMembers = [
  { name: "Aakansh Gupta", department: "Technical Lead", img: "/img/leads/technical-lead-1.webp", quote: "There's no place like 127.0.0.1" },
  { name: "Om Mishra", department: "Technical Lead", img: "/img/leads/technical-lead-2.webp", quote: "Control what you can, Endure what you must." },
  { name: "Mohnish", department: "Dev Lead", img: "/img/leads/dev-lead-1.webp", quote: "Just enjoy the work better than yesterday" },
  { name: "Krish Patel", department: "Dev Lead", img: "/img/leads/dev-lead-2.webp", quote: "Powered by coffee and code" },
  { name: "Akshitha M", department: "Design Lead", img: "/img/leads/design-lead-1.webp", quote: "Having no regrets is all that she really wants " },
  { name: "Advika", department: "Design Lead", img: "/img/leads/design-lead-2.webp", quote: "The horrors persist but so do I" },
  { name: "Sreenidhi K", department: "Content Lead", img: "/img/leads/content-lead-1.webp", quote: "Can I interest you in a sarcastic comment?" },
  { name: "M. Shruthi", department: "Content Lead", img: "/img/leads/content-lead-2.webp", quote: "Wit beyond measure is man's greatest treasure." },
  { name: "Nihara", department: "Event Management Lead", img: "/img/leads/management-lead-1.webp", quote: "I bring the chaos to the table" },
  { name: "Ramakrishnan P H", department: "Event Management Lead", img: "/img/leads/management-lead-2.webp", quote: "trying to make it make sense..." },
  { name: "Kanika Rathore", department: "Social Media Lead", img: "/img/leads/social-media-lead-1.webp", quote: "If I look calm, just know the semester is screaming internally." },
  { name: "Shagun Gupta", department: "Social Media Lead", img: "/img/leads/social-media-lead-2.webp", quote: "Be whoever you want as long as you are outrageous !" },
];

const cabinetGroupPhoto = "/img/team018.webp";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const Avatar = ({ name, size = "w-20 h-20 text-xl" }) => (
  <div className={`${size} rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border border-cyan-500/20 flex items-center justify-center font-zentry text-white select-none`}>
    {getInitials(name)}
  </div>
);

const OurTeam = () => {
  const containerRef = useRef(null);
  const [hoveredCabinetMember, setHoveredCabinetMember] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title Animation - use containerRef instead of .hero-section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      });

      tl.fromTo(".main-title",
        { y: 50, opacity: 0, filter: "blur(10px)" },
        { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out" }
      ).fromTo(".subtitle",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.8"
      );

      // Hero Image Reveal
      gsap.fromTo(
        ".team-hero-image",
        { clipPath: "inset(0 100% 0 0)", scale: 1.1 },
        {
          clipPath: "inset(0 0% 0 0)",
          scale: 1,
          duration: 1.5,
          ease: "power4.out",
          scrollTrigger: {
            trigger: ".team-image-wrapper",
            start: "top 75%",
          },
        }
      );
      
      // Section Titles
      gsap.utils.toArray(".section-title").forEach(title => {
        gsap.fromTo(title,
          { opacity: 0, x: -30 },
          {
            opacity: 1, x: 0, duration: 1, ease: "power3.out",
            scrollTrigger: {
              trigger: title,
              start: "top 85%"
            }
          }
        );
      });

      // Team Cards stagger
      gsap.utils.toArray(".team-grid").forEach(grid => {
        const cards = grid.querySelectorAll(".team-card");
        gsap.fromTo(cards,
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            stagger: 0.1,
            duration: 0.8,
            ease: "back.out(1.2)",
            scrollTrigger: {
              trigger: grid,
              start: "top 85%",
            },
          }
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#050505] min-h-screen text-blue-50 pt-24 md:pt-32 px-4 md:px-8 lg:px-24 font-general">
      {/* Background glow effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-cyan-600/20 blur-[120px]"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-900/20 blur-[150px]"></div>
      </div>

      {/* Hero Section */}
      <div className="hero-section flex flex-col md:flex-row gap-8 md:gap-16 mb-16 md:mb-32 items-center">
        <div className="title-wrapper md:w-1/2 flex flex-col justify-center order-2 md:order-1 relative z-10">
          <p className="subtitle text-cyan-400 font-mono tracking-[0.2em] text-sm md:text-base mb-4 uppercase">Meet the Minds Behind</p>
          <h1 className="main-title font-zentry text-6xl md:text-8xl lg:text-[9rem] uppercase leading-[0.85] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-cyan-500 drop-shadow-2xl">
            Our<br />Team
          </h1>
          <p className="subtitle mt-6 text-gray-400 max-w-md text-lg leading-relaxed">
            A passionate group of innovators, creators, and problem solvers working together to build the future of cybersecurity.
          </p>
        </div>
        
        <div className="team-image-wrapper md:w-1/2 relative order-1 md:order-2 w-full aspect-[4/3] md:aspect-[3/2] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(34,211,238,0.1)] border border-white/10 z-10">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent z-10 mix-blend-overlay pointer-events-none"></div>
          <img
            src={`${import.meta.env.BASE_URL}img/team.webp`} 
            alt="Team"
            className="team-hero-image w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Decorative Divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mb-16 md:mb-24"></div>

      {/* Board Section */}
      <div className="mb-20 md:mb-32 relative z-10">
        <h2 className="section-title font-zentry text-4xl md:text-6xl mb-8 md:mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500 uppercase tracking-wide flex items-center gap-4">
          <span className="w-8 h-[2px] bg-cyan-500 inline-block"></span>
          Board
        </h2>
        <div className="team-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {boardMembers.map((member, index) => (
            <TeamCard key={index} member={member} />
          ))}
        </div>
      </div>

      {/* Cabinet Section */}
      <div className="mb-20 md:mb-32 relative z-10">
        <h2 className="section-title font-zentry text-4xl md:text-6xl mb-12 md:mb-16 text-center text-white uppercase tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] flex items-center justify-center gap-4">
          <span className="w-8 h-[2px] bg-gradient-to-r from-cyan-500 to-purple-500 inline-block"></span>
          Cabinet
          <span className="w-8 h-[2px] bg-gradient-to-r from-purple-500 to-cyan-500 inline-block"></span>
        </h2>
        
        <div className="relative">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 rounded-3xl blur-3xl -z-10"></div>
          
          <div className="flex flex-col lg:flex-row gap-12 md:gap-16 items-start">
            {/* Group Photo / Active Member Preview */}
            <div className="lg:sticky lg:top-24 relative w-full lg:w-[350px] xl:w-[450px] flex-shrink-0 aspect-[4/5] lg:aspect-[3/4] lg:max-h-[calc(100vh-120px)] rounded-2xl overflow-hidden shadow-[0_20px_60px_-20px_rgba(6,182,212,0.3)] border border-white/10 group">
              {/* Group Photo Layer */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-purple-500/10 z-10 mix-blend-overlay pointer-events-none transition-opacity duration-500 group-hover:opacity-0"></div>
                <img
                  src={cabinetGroupPhoto}
                  alt="Cabinet"
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 filter grayscale-[15%] group-hover:grayscale-0"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-20">
                  <p className="font-mono text-xs md:text-sm text-cyan-300/80 tracking-[0.2em] uppercase text-center">
                    The Cabinet — Architecting the Future
                  </p>
                </div>
              </div>

              {/* Active Member Overlay Layer (expands like a card on hover) */}
              <div 
                className={`absolute inset-0 bg-[#0a0a0a] transition-all duration-500 ease-out z-30 ${
                  hoveredCabinetMember ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                {hoveredCabinetMember && (
                  <>
                    <div className="absolute inset-0 bg-cyan-500/20 mix-blend-overlay z-10 pointer-events-none"></div>
                    <img
                      src={hoveredCabinetMember.img}
                      alt={hoveredCabinetMember.name}
                      className="w-full h-full object-cover filter grayscale-[15%] transition-transform duration-700 hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
                      <div className="transform translate-y-0 transition-transform duration-500">
                        <h3 className="font-zentry text-3xl md:text-4xl uppercase text-white mb-1 drop-shadow-md">
                          {hoveredCabinetMember.name}
                        </h3>
                        <p className="font-mono text-xs md:text-sm text-cyan-400 tracking-[0.15em] uppercase">
                          {hoveredCabinetMember.department}
                        </p>
                        {hoveredCabinetMember.quote && (
                          <p className="text-xs text-gray-300 italic mt-2 line-clamp-2">
                            "{hoveredCabinetMember.quote}"
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Members List */}
            <div className="flex-1 space-y-6 md:space-y-8 pt-4 lg:pt-0 w-full">
              {(() => {
                const grouped = cabinetMembers.reduce((acc, member) => {
                  if (!acc[member.department]) acc[member.department] = [];
                  acc[member.department].push(member);
                  return acc;
                }, {});
                return Object.entries(grouped).map(([dept, members]) => (
                  <div key={dept} className="space-y-4">
                    <div className="flex items-center gap-3 pb-2 border-b border-white/10">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-purple-400"></div>
                      <h3 className="font-zentry text-lg md:text-xl uppercase tracking-wider text-cyan-200">
                        {dept}
                      </h3>
                      <div className="flex-1 h-px bg-gradient-to-r from-cyan-500/30 to-transparent"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-5">
                      {members.map((member, idx) => (
                        <div
                          key={`${dept}-${idx}`}
                          onMouseEnter={() => setHoveredCabinetMember(member)}
                          onMouseLeave={() => setHoveredCabinetMember(null)}
                          className="group flex items-center gap-4 p-3 md:p-4 rounded-xl bg-[#0a0a0a]/50 border border-white/5 hover:border-cyan-500/20 hover:bg-[#0a0a0a]/80 transition-all duration-300 cursor-pointer"
                        >
                          {member.img ? (
                            <img
                              src={member.img}
                              alt={member.name}
                              className="w-14 h-14 rounded-full object-cover border border-cyan-500/20 transition-transform duration-500 group-hover:scale-110 flex-shrink-0"
                            />
                          ) : (
                            <Avatar name={member.name} size="w-14 h-14 text-sm md:text-base flex-shrink-0" />
                          )}
                          <div className="min-w-0 flex-1">
                            <h4 className="font-zentry text-base md:text-lg uppercase text-white group-hover:text-cyan-300 transition-colors truncate">
                              {member.name}
                            </h4>
                            <p className="font-mono text-xs text-cyan-400/70 tracking-[0.1em] uppercase mt-1 truncate">
                              {member.department}
                            </p>
                            {member.quote && (
                              <p className="text-[10px] text-gray-400 italic mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-1">
                                "{member.quote}"
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
};

// Reusable Team Card Component
const TeamCard = ({ member, department }) => {
  return (
    <div className="team-card group relative overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/5 transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_10px_40px_-10px_rgba(34,211,238,0.2)] hover:-translate-y-2 cursor-pointer">
      <div className="aspect-[3/4] overflow-hidden relative">
        {/* Glow effect that follows hover */}
        <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay z-10 pointer-events-none"></div>
        <img 
          src={member.img} 
          alt={member.name} 
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter grayscale-[20%] group-hover:grayscale-0"
        />
      </div>
      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent z-20">
        <div className="transform transition-transform duration-500 group-hover:-translate-y-2">
          <h3 className="font-zentry text-2xl md:text-3xl uppercase text-white mb-1 drop-shadow-md">{member.name}</h3>
          <p className="font-mono text-xs md:text-sm text-cyan-400 tracking-[0.15em] uppercase">
            {member.role || department}
          </p>
          {member.quote && (
            <p className="text-xs text-gray-400 italic mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
              "{member.quote}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OurTeam;
