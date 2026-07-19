import { motion } from 'framer-motion';
import { useIntersection } from 'react-use';
import { useRef } from 'react';

const Story = () => {
  const ref = useRef();
  const isInView = useIntersection(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                Our Story
              </span>
            </h2>
            <div className="space-y-6 text-gray-300">
              <p>
                CYSCOM VIT Chennai was founded in 2023 by a group of passionate cybersecurity enthusiasts who recognized the need for a dedicated platform where students could learn, share knowledge, and grow together in the field of cybersecurity.
              </p>
              <p>
                What started as a small study group has now evolved into a thriving community of over 200+ members, dedicated to empowering students with practical cybersecurity skills and knowledge.
              </p>
              <p>
                Our journey has been marked by continuous learning, innovation, and a commitment to excellence in cybersecurity education. We've organized numerous workshops, competitions, and knowledge-sharing sessions that have helped students build strong foundations in the field.
              </p>
              <p>
                Today, CYSCOM stands as one of the premier cybersecurity communities in VIT Chennai, known for our comprehensive CTF writeups, practical training programs, and vibrant community engagement.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            className="relative"
          >
            <div className="relative w-full h-96 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-2xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-6 p-8">
                  {[
                    { year: '2023', event: 'Community Founded' },
                    { year: '2024', event: '500+ Members' },
                    { year: '2024', event: '25+ Events' },
                    { year: '2025', event: '100+ Writeups' }
                  ].map((item, index) => (
                    <motion.div
                      key={item.year}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="bg-gradient-to-br from-white/10 to-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center"
                    >
                      <div className="text-3xl font-bold text-blue-400 mb-2">{item.year}</div>
                      <div className="text-sm text-gray-300">{item.event}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Story;
