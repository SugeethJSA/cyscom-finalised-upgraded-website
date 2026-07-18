"use client";
import { PhotoCarousel, EasedImage } from "@cyscomvit/cyscomui";

const content = [
  {
    title: "Final Trace",
    description:
      "A 2-day CTF event at TechnoVIT featuring an immersive storyline and a massive lineup of cyber challenges. Participants unravelled clues, cracked ciphers, and battled through intricate CTF rounds in an unforgettable experience.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/finaltrace.jpg`} alt="Final Trace event" className="w-full h-full object-cover" />,
  },
  {
    title: "Final Trace — Highlights",
    description:
      "Electric moments from the CTF floor — from frantic last-minute flag captures to victory celebrations. Every competition leaves memories that fuel the next challenge.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/finaltrace1.jpg`} alt="Final Trace highlights" className="w-full h-full object-cover" />,
  },
  {
    title: "Final Trace — Gallery",
    description:
      "Behind the scenes and on-stage moments from Final Trace. The event brought together the brightest minds in cybersecurity for an intense two-day journey.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/finaltrace2.jpg`} alt="Final Trace gallery" className="w-full h-full object-cover" />,
  },
  {
    title: "Cyber Converge",
    description:
      "A two-day deep dive for cyber enthusiasts — featuring expert-led workshops during the day and a gripping CTF competition at night. The perfect fusion of learning and competition.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/cyber-converge.jpg`} alt="Cyber Converge event" className="w-full h-full object-cover" />,
  },
  {
    title: "Cyber Converge — In Action",
    description:
      "Participants engrossed in hands-on sessions, networking with peers, and pushing their limits across hardware hacking, OSINT, and web exploitation tracks.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/cyber-converge1.jpg`} alt="Cyber Converge highlights" className="w-full h-full object-cover" />,
  },
  {
    title: "VMedithon",
    description:
      "A unique hackathon at the intersection of healthcare and technology. Teams built impactful solutions for real-world medical challenges under a 24-hour sprint.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/vmedithon.jpg`} alt="VMedithon event" className="w-full h-full object-cover" />,
  },
];

export function StickyScrollRevealDemo() {
  return (
    <div className="w-full py-16 animate-fade-in-up cyber-grid relative">
      <div className="section-divider absolute top-0" />
      <div className="container mx-auto px-5 md:px-10 mb-16">
        <div className="text-center animate-fade-in-up">
          <p className="font-general text-sm uppercase tracking-wider text-blue-300 mb-6 text-glow">
            Our Journey
          </p>
          <div className="overflow-hidden">
            <h2
              className="font-zentry text-4xl md:text-6xl font-black text-blue-50 text-glow mb-8 animate-slide-in-right"
              style={{ animationDelay: "0.2s" }}
            >
              <span
                className="inline-block animate-bounce-subtle"
                style={{ animationDelay: "0.5s" }}
              >
                Past
              </span>
              <span className="inline-block w-4" />
              <span
                className="inline-block animate-bounce-subtle"
                style={{ animationDelay: "0.7s" }}
              >
                Events
              </span>
            </h2>
          </div>
        </div>
      </div>
      <PhotoCarousel content={content} contentClassName="" gridCols={3} />
      <div className="section-divider absolute bottom-0" />
    </div>
  );
}
