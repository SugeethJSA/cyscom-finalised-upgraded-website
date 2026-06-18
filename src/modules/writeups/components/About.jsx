import { motion } from 'framer-motion';
import { useIntersection } from 'react-use';
import { useRef } from 'react';

const About = () => {
  const ref = useRef();
  const isInView = useIntersection(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              About CYSCOM
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Cybersecurity Student Community of VIT Chennai - Empowering students through knowledge sharing and practical experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              title: 'CTF Writeups',
              description: 'Comprehensive Capture The Flag writeups and tutorials covering various cybersecurity challenges',
              icon: '🛡️'
            },
            {
              title: 'Learning Resources',
              description: 'Curated collection of cybersecurity tutorials, guides, and best practices',
              icon: '📚'
            },
            {
              title: 'Community Events',
              description: 'Regular workshops, competitions, and knowledge-sharing sessions',
              icon: '🤝'
            },
            {
              title: 'Skill Development',
              description: 'Hands-on practice with real-world cybersecurity scenarios',
              icon: '⚡'
            },
            {
              title: 'Industry Connections',
              description: 'Networking opportunities with cybersecurity professionals',
              icon: '🔗'
            },
            {
              title: 'Innovation Hub',
              description: 'Platform for developing cutting-edge security solutions',
              icon: '💡'
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
              <p className="text-gray-300 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;