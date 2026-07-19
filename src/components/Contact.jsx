import { AnimatedTitle, Button } from "@cyscomvit/cyscomui";

const ImageClipBox = ({ src, clipClass }) => (
  <div className={clipClass}>
        <img src={src} loading="lazy" decoding="async" alt="" className="w-full h-full object-cover" />
  </div>
);

const Contact = () => {
  return (
    <div id="contact" className="my-10 md:my-20 min-h-96 w-screen px-4 md:px-10 relative">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="relative rounded-xl bg-gradient-to-br from-blue-900/50 via-purple-900/50 to-black backdrop-blur-cyber py-12 md:py-32 lg:py-40 xl:py-48 text-blue-50 overflow-hidden">
        <div className="absolute -left-10 md:-left-20 top-0 h-full opacity-30 pointer-events-none md:pointer-events-auto z-0">
          <ImageClipBox
            src={`${import.meta.env.BASE_URL}img/contact/nihara.webp`}
            clipClass="contact-clip-path-1 absolute top-0 h-[75%] aspect-square lg:scale-110 lg:origin-top-left"
          />
          <ImageClipBox
            src={`${import.meta.env.BASE_URL}img/contact/shruti.jpg`}
            clipClass="contact-clip-path-2 absolute -bottom-10 md:bottom-0 h-[60%] aspect-square lg:scale-110 lg:origin-bottom-left"
          />
        </div>

        <div className="absolute right-2 md:right-10 top-0 h-full opacity-30 pointer-events-none md:pointer-events-auto z-0">
          <ImageClipBox
            src={`${import.meta.env.BASE_URL}img/contact/team.webp`}
            clipClass="sword-man-clip-path absolute top-0 md:top-[12.5%] right-0 h-[50%] aspect-[1/1] lg:aspect-[1.1/1] lg:origin-right"
          />
        </div>

        <div className="flex flex-col items-center text-center animate-fade-in-up px-4 relative z-10">
          <p className="mb-8 md:mb-12 font-general text-xs md:text-sm uppercase tracking-wider">
            Join CYSCOM
          </p>

          <AnimatedTitle
            title="let's b<b>u</b>ild the <br /> new era of <br /> ha<b>c</b>king t<b>o</b>gether."
            className="special-font !md:text-[6.2rem] w-full font-zentry !text-5xl !font-black !leading-[.9]"
          />

          <Button 
            title="contact us" 
            containerClass="mt-16 cursor-pointer"
            onClick={() => window.open("mailto:cyscom@vit.ac.in", "_blank")}
          />
        </div>
      </div>
    </div>
  );
};

export default Contact;
