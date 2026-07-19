import { AnimatedTitle, PhotoCarousel, EasedImage } from "@cyscomvit/cyscomui";
const carouselContent = [
  {
    title: "Discover CYSCOM",
    description: "CYSCOM VIT Chennai was founded in 2023 by a group of passionate cybersecurity enthusiasts who recognized the need for a dedicated platform where students could learn, share knowledge, and grow together in the field of cybersecurity. What started as a small study group has now evolved into a thriving community of over 200+ members, dedicated to empowering students with practical cybersecurity skills and knowledge. Our journey has been marked by continuous learning, innovation, and a commitment to excellence in cybersecurity education. We've organized numerous workshops, competitions, and knowledge-sharing sessions that have helped students build strong foundations in the field. Today, CYSCOM stands as one of the premier cybersecurity communities in VIT Chennai, known for our comprehensive CTF writeups, practical training programs, and vibrant community engagement.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/mid.webp`} alt="CYSCOM Discover" className="w-full h-full object-cover" />,
  },
  {
    title: "Team Moments",
    description: "United by passion for cybersecurity, diverse talents converging into one powerful community. ",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/team.webp`} alt="CYSCOM Team" className="w-full h-full object-cover" />,
  },
  {
    title: "Community Spirit",
    description: "Where hackers, defenders, and learners unite. Building the next generation of cybersecurity professionals.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/community.webp`} alt="CYSCOM Community" className="w-full h-full object-cover" />,
  },
];

const About = () => {

  return (
    <div id="about" className="min-h-screen bg-black">
      <div className="relative mb-8 mt-12 md:mt-36 flex flex-col items-center gap-3 md:gap-5 px-4">
        <p className="font-general text-xs md:text-sm text-white uppercase">
          Welcome to CYSCOM!
        </p>

        <AnimatedTitle
          title="<b>Discover the VIT Chennai'S ONLY CYBERSECURITY CLUB</b>"
          containerClass="mt-5 !text-white text-center"
        />


      </div>

      <PhotoCarousel content={carouselContent} contentClassName="" gridCols={3} />
    </div>
  );
};

export default About;
