"use client";
import { PhotoCarousel, EasedImage } from "@cyscomvit/cyscomui";

const content = [
  {
    title: "Final Trace",
    description:
      "A 2-day CTF event at TechnoVIT featuring an immersive storyline and a massive lineup of cyber challenges. The event featured an immersive storyline inspired by Expedition 33, designed in a CTF format. Hidden flags were woven into plot twists and challenges, unlocking new narrative branches as teams progressed. Each solved task revealed a different path toward the ending. The blend of storytelling and strategy made every team’s journey distinct and engaging. ",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/finaltrace.webp`} alt="Final Trace event" className="w-full h-full object-cover" />,
  },
  {
    title: "Cyberconverge",
    description:
      "This event brought together students, professionals, and cybersecurity experts for a hands-on learning experience. It featured technical workshops, expert keynotes, and strong networking opportunities focused on real-world cyber threats and defense techniques. Sessions were conducted by SOC analysts, penetration testers, and bug bounty hunters, offering valuable insights into careers, ethical hacking, and modern security practices. ",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/cyber-converge1.webp`} alt="Cyber Converge highlights" className="w-full h-full object-cover" />,
  },
  {
    title: "V-Medithon",
    description:
      "The hackathon, ‘V-Medithon,’ hosted by the School of Computer Science and Engineering (SCOPE) at VIT Chennai, in collaboration with another club and Yenepoya Medical University, took place on the 29th and 30th of September 2024 at the MG Auditorium. Participants utilized cutting-edge technologies such as AI, blockchain, IoT, and cybersecurity to develop innovative solutions aimed at transforming healthcare delivery. The event sparked remarkable enthusiasm, resulting in groundbreaking ideas and projects that demonstrated the immense potential of technology to enhance patient care and health outcomes.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/vmedithon.webp`} alt="V-Medithon event" className="w-full h-full object-cover" />,
  },
  {
    title: "Code n Conquer",
    description:
      "Held in collaboration with another club, this two-day event focused on advanced web development and cybersecurity, providing participants with a comprehensive learning experience. The event featured a series of hands-on projects and interactive challenges, designed to enhance practical skills and foster collaboration among attendees. Participants had the opportunity to engage in real-world scenarios, gain insights from industry experts, and apply their knowledge in a competitive and stimulating environment.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/cyber-converge.webp`} alt="Cyber Converge event" className="w-full h-full object-cover" />,
  },
  {
    title: "Zypher",
    description:
      "Zypher, which unfolded on November 6th, 2023, delivered an extraordinary voyage into the realm of cybersecurity and code-breaking, transcending the conventional Capture The Flag (CTF) competition. This exceptional event provided a platform to put participants' digital detective skills to the test. They engaged in piecing together intricate clues, decrypting enigmatic codes, and revealing the concealed truths within the expansive domain of cyberspace. Zypher offered a dynamic and intellectually stimulating challenge, where individuals explored the depths of cybersecurity with a sense of intrigue and excitement.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/cyber-converge1.webp`} alt="Cyber Converge highlights" className="w-full h-full object-cover" />,
  },
  {
    title: "Echoes of the Source",
    description:
      "Echoes of the Source, conducted on August 6th, 2025, was an engaging mentorship and career guidance session that connected students with CYSCOM alumni from diverse professional domains. The event provided participants with valuable insights into academics, internships, placements, higher studies, and career opportunities in cybersecurity and technology. Alumni shared their personal experiences, industry knowledge, and practical guidance on building technical skills, participating in CTFs, and preparing for future roles in the tech industry. The session created an interactive learning environment that inspired students to explore opportunities confidently while strengthening connections across the CYSCOM community.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/vmedithon.webp`} alt="VMedithon event" className="w-full h-full object-cover" />,
  },
  {
    title: "LocalHost",
    description:
      "Local Host was a hands-on cybersecurity workshop conducted on 13 February 2026, focused on real-world web security threats and defense techniques. The session covered key topics including SQL Injection, XSS, CSRF, Supply Chain attacks, CSP, and Authentication & Authorization practices. Through live demonstrations and practical exercises, participants explored common vulnerabilities and learned secure coding, input validation, and attack prevention techniques, strengthening their cybersecurity and problem solving skills.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/events/vmedithon.webp`} alt="VMedithon event" className="w-full h-full object-cover" />,
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
