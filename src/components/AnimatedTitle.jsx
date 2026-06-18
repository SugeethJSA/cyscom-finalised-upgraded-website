import { gsap } from "gsap";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import clsx from "clsx";

gsap.registerPlugin(ScrollTrigger);

const parseTitle = (title) => {
  return title.split("<br />").map((line) => {
    const words = [];
    let currentWord = "";
    let currentWordIsBold = false;
    let isBold = false;
    let i = 0;
    
    while (i < line.length) {
      if (line.startsWith("<b>", i)) {
        isBold = true;
        i += 3;
      } else if (line.startsWith("</b>", i)) {
        isBold = false;
        i += 4;
      } else if (line[i] === " ") {
        if (currentWord) {
          words.push({ text: currentWord, isBold: currentWordIsBold });
          currentWord = "";
        }
        i++;
      } else {
        if (currentWord === "") {
          currentWordIsBold = isBold;
        }
        currentWord += line[i];
        i++;
      }
    }
    
    if (currentWord) {
      words.push({ text: currentWord, isBold: currentWordIsBold });
    }
    
    return words;
  });
};

const AnimatedTitle = ({ title, containerClass }) => {
  const containerRef = useRef(null);
  const parsedTitle = parseTitle(title);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const titleAnimation = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "100 bottom",
          end: "center bottom",
          toggleActions: "play none none reverse",
        },
      });

      titleAnimation.to(
        ".animated-word",
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) rotateY(0deg) rotateX(0deg)",
          ease: "power2.inOut",
          stagger: 0.02,
        },
        0
      );
    }, containerRef);

    return () => ctx.revert(); 
  }, []);

  return (
    <div ref={containerRef} className={clsx("animated-title", containerClass)}>
      {parsedTitle.map((line, lineIndex) => (
        <div
          key={lineIndex}
          className="flex-center max-w-full flex-wrap gap-1 md:gap-2 px-4 md:px-10 lg:gap-3"
        >
          {line.map((word, wordIndex) => (
            <span
              key={wordIndex}
              className="animated-word"
            >
              {word.isBold ? <b>{word.text}</b> : word.text}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AnimatedTitle;
