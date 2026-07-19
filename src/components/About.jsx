import { AnimatedTitle, PhotoCarousel, EasedImage } from "@cyscomvit/cyscomui";
const carouselContent = [
  {
    title: "Team Moments",
    description: "United by passion for cybersecurity, diverse talents converging into one powerful community.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/team.jpeg`} alt="CYSCOM Team" className="w-full h-full object-cover" />,
  },
  {
    title: "Discover CYSCOM",
    description: "The Game of Defense begins—your life, now an epic CTF. VIT Chennai's only cybersecurity club.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/mid.webp`} alt="CYSCOM Discover" className="w-full h-full object-cover" />,
  },
  {
    title: "Community Spirit",
    description: "Where hackers, defenders, and learners unite. Building the next generation of cybersecurity professionals.",
          content: <EasedImage src={`${import.meta.env.BASE_URL}img/community.jpeg`} alt="CYSCOM Community" className="w-full h-full object-cover" />,
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
