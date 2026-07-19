import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatedTitle } from "@cyscomvit/cyscomui";

gsap.registerPlugin(ScrollTrigger);

const SponsorCard = ({ name, description, image, website }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!cardRef.current) return;
    const { left, top, width, height } =
      cardRef.current.getBoundingClientRect();
    const relativeX = (event.clientX - left) / width;
    const relativeY = (event.clientY - top) / height;
    const tiltX = (relativeY - 0.5) * 8;
    const tiltY = (relativeX - 0.5) * -8;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "";
    setIsHovered(false);
  };

  const CardWrapper = ({ children }) =>
    website ? (
      <a href={website} target="_blank" rel="noopener noreferrer" className="block size-full">
        {children}
      </a>
    ) : (
      <>{children}</>
    );

  return (
    <div
      ref={cardRef}
      className="crypto-card group relative overflow-hidden rounded-xl shadow-lg transition-all duration-500 hover:scale-105"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-sponsor-card
      style={{
        transitionProperty: "transform, border-color",
        transitionDuration: "0.3s",
        transitionTimingFunction: "ease-out",
      }}
    >
      <CardWrapper>
        {/* Logo area */}
        <div className="relative flex items-center justify-center bg-white/5 h-36 md:h-44 overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-indigo-900/60 to-black/80" />

          {/* Sponsor logo with eased loading */}
          <img
            src={image}
            alt={`${name} logo`}
            loading="lazy"
            style={{
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.7s ease-in",
              maxHeight: "100%",
                          maxWidth: "100%",
              objectFit: "contain",
            }}
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              setImgLoaded(true);
            }}
                        className="relative z-10 p-4 w-full h-full object-contain"
          />

          {/* Placeholder while loading */}
          {!imgLoaded && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="w-12 h-12 rounded-full border-2 border-blue-400/30 border-t-blue-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Info area */}
        <div className="p-4 md:p-5 bg-black/80 backdrop-blur-sm relative z-10">
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.2) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
            }}
          />

          <h3 className="crypto-title text-base md:text-lg font-black uppercase text-blue-100 mb-2 relative z-10">
            {name}
          </h3>

          <p className="font-circular-web text-xs md:text-sm leading-relaxed text-blue-50/60 relative z-10">
            {description}
          </p>

          {/* Status dot */}
          <div className="flex items-center space-x-2 mt-3 font-general text-xs relative z-10">
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                isHovered ? "bg-blue-400 animate-pulse" : "bg-blue-400/60"
              }`}
            />
            <span className="text-blue-400/70">PARTNER</span>
          </div>
        </div>
      </CardWrapper>
    </div>
  );
};

const Sponsors = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray("[data-sponsor-card]");
    cards.forEach((card, index) => {
      gsap.fromTo(card, 
        { opacity: 0, y: 40, rotateX: -10 },
        {
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=50",
            end: "top center",
            toggleActions: "play none none none",
          },
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.6,
          ease: "power2.out",
          delay: (index % 4) * 0.15,
        }
      );
    });
  }, { scope: sectionRef });

  const sponsors = [
  {
    name: "AECC",
    description: "A global education consultancy helping students pursue higher education abroad through university admissions, visa assistance, and career guidance.",
    image: "/img/sponsors/aecc.webp",
    website: null
  },
  {
    name: "Tezos",
    description: "An energy-efficient, open-source blockchain platform supporting smart contracts, decentralized applications, and on-chain governance.",
    image: "/img/sponsors/tezos.webp",
    website: null
  },
  {
    name: "Polygon",
    description: "A leading blockchain scaling platform that enhances Ethereum with faster, lower-cost, and more scalable decentralized applications.",
    image: "/img/sponsors/polygon.webp",
    website: null
  },
  {
    name: "Code Asylums",
    description: "A technology community focused on software development, innovation, hackathons, and developer education.",
    image: "/img/sponsors/code-asylums.webp",
    website: null
  },
  {
    name: "IDP",
    description: "A global leader in international education services, assisting students with overseas admissions, English testing, and visas.",
    image: "/img/sponsors/idp.webp",
    website: null
  },
  {
    name: "Manya",
    description: "A premier test-preparation and study-abroad consultancy offering coaching for GRE, GMAT, SAT, IELTS, TOEFL, and admissions guidance.",
    image: "/img/sponsors/Manya.webp",
    website: null
  },
  {
    name: "Geeks for Geeks",
    description: "One of the world's largest computer science learning platforms, providing coding tutorials, interview preparation, and technical courses.",
    image: "/img/sponsors/geeks.webp",
    website: null
  },
  {
    name: "Tamil Nadu Police",
    description: "The state law enforcement agency responsible for maintaining public safety, enforcing laws, and ensuring security across Tamil Nadu.",
    image: "/img/sponsors/tnpolice.webp",
    website: null
  },
  {
    name: "Wanderlooms",
    description: "A lifestyle and travel brand focused on curated experiences, premium products, and creative exploration.",
    image: "/img/sponsors/wanderlooms.webp",
    website: null
  },
  {
    name: "Olive Consulting",
    description: "A consulting and technology solutions company delivering business transformation, IT services, and digital innovation.",
    image: "/img/sponsors/olive.webp",
    website: null
  },
  {
    name: "Greater Chennai Police",
    description: "The metropolitan police force responsible for law enforcement, public safety, and traffic management across Chennai.",
    image: "/img/sponsors/gcp.webp",
    website: null
  },
  {
    name: "Devfolio",
    description: "India's leading hackathon platform connecting developers with hackathons, grants, bounties, and startup opportunities.",
    image: "/img/sponsors/devfolio.webp",
    website: null
  },
  {
    name: "Portis",
    description: "A blockchain wallet that simplifies access to decentralized applications through an easy-to-use, password-based experience.",
    image: "/img/logo.webp",
    website: null
  },
  {
    name: "Wolfram Language",
    description: "A symbolic programming language powering computational mathematics, data science, AI, and scientific computing.",
    image: "/img/sponsors/wolfram.webp",
    website: null
  },
  {
    name: "Give My Certificate",
    description: "A digital credential platform that enables organizations to securely issue, verify, and manage certificates online.",
    image: "/img/sponsors/give.webp",
    website: null
  },
  {
    name: "Tetra Flip",
    description: "A technology company focused on innovative digital products, software solutions, and emerging technologies.",
    image: "/img/sponsors/tetra.webp",
    website: null
  },
  {
    name: "Altered Sec",
    description: "A cybersecurity company specializing in red teaming, penetration testing, Active Directory security, and professional training.",
    image: "/img/sponsors/alteredsecurity.webp",
    website: null
  },
  {
    name: "Okta",
    description: "A leading identity and access management platform providing secure authentication, authorization, and identity solutions for organizations.",
    image: "/img/sponsors/okta.webp",
    website: null
  }
  ];

  return (
    <section
      ref={sectionRef}
      id="sponsors"
      className="min-h-screen bg-black pb-12 md:pb-32 pt-8 md:pt-20 cyber-grid relative"
    >
      <div className="section-divider absolute top-0" />
      <div className="container mx-auto px-3 md:px-5 lg:px-10">

        {/* Section Header */}
        <div className="mb-8 md:mb-24 flex flex-col items-center gap-3 md:gap-8 text-center">
          <p className="font-general text-xs md:text-sm uppercase tracking-wider text-blue-300 animate-fade-in-up">
            Our Partners
          </p>

          <AnimatedTitle
            title="O<b>u</b>r Sp<b>o</b>nsors &<br /> Su<b>p</b>porters"
            containerClass="mt-5 !text-blue-100 text-center"
          />

          <p className="mt-5 max-w-2xl font-circular-web text-lg text-blue-50/70">
            We are grateful to the organisations who believed in our mission to
            cultivate a thriving cybersecurity community at VIT Chennai.
          </p>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {sponsors.map((sponsor, index) => (
            <SponsorCard
              key={index}
              name={sponsor.name}
              description={sponsor.description}
              image={sponsor.image}
              website={sponsor.website}
            />
          ))}
        </div>

        {/* Bottom Text */}
        <div className="mt-20 text-center">
          <p className="font-circular-web text-base text-blue-50/50">
            Interested in partnering with us? Reach out to the team.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Sponsors;
