import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { AnimatedTitle } from "@cyscomvit/cyscomui";

gsap.registerPlugin(ScrollTrigger);

const SponsorCard = ({ name, description, image, website }) => {
  const [transformStyle, setTransformStyle] = useState("");
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
    const newTransform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    setTransformStyle(newTransform);
  };

  const handleMouseLeave = () => {
    setTransformStyle("");
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
        transform: transformStyle,
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
              maxWidth: "80%",
              objectFit: "contain",
            }}
            onLoad={() => setImgLoaded(true)}
            className="relative z-10 p-4"
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
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: "top bottom-=50",
          end: "top center",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 40,
        rotateX: -10,
        duration: 0.6,
        ease: "power2.out",
        delay: (index % 4) * 0.15,
      });
    });
  }, { scope: sectionRef });

  const sponsors = [
    {
      name: "Tech Giants",
      description:
        "Leading the way in innovation and technology. Industry leaders who have supported our mission to foster a community of developers and creators.",
      image: "/img/logo.png",
      website: null,
    },
    {
      name: "Innovation Labs",
      description:
        "Pioneering the future of software development. Partnered with us to push the boundaries of what is possible in cybersecurity education.",
      image: "/img/logo.png",
      website: null,
    },
    {
      name: "Creative Studios",
      description:
        "Empowering designers and artists worldwide. Their collaboration enabled us to bring unique and visually stunning experiences to our events.",
      image: "/img/logo.png",
      website: null,
    },
    {
      name: "Global Networks",
      description:
        "Connecting people and ideas across the globe. Their support helps us reach a wider, diverse and inclusive cybersecurity community.",
      image: "/img/logo.png",
      website: null,
    },
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
