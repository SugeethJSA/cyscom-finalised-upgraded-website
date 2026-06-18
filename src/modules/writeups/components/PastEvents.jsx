import { motion } from 'framer-motion';
import { useIntersection } from 'react-use';
import { useRef } from 'react';

const Sponsors = () => {
  const ref = useRef();
  const isInView = useIntersection(ref, { once: true, margin: "-100px" });

  const events = [
    {
      title: 'CyberConverge 2025',
      date: 'August 28, 2025',
      description: 'The Premier Cybersecurity Event Where Innovation meets security',
      image: '/img/cyberconverge.jpg',
      participants: '500+ participants',
      challenges: '24 challenges'
    },
    {
      title: 'FinalTrace 2025',
      date: 'March 15, 2025',
      description: 'Advanced network forensics and incident response challenge',
      image: '/img/finaltrace.jpg',
      participants: '300+ participants',
      challenges: '18 challenges'
    },
    {
      title: 'Zypher 2023',
      date: 'November 10, 2023',
      description: 'Cryptography and steganography competition',
      image: '/img/zypher.jpg',
      participants: '200+ participants',
      challenges: '15 challenges'
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Past Events
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore our previous successful cybersecurity competitions and events
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2, ease: 'easeOut' }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-purple-600/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl font-bold text-white/10">{event.title.split(' ')[0]}</span>
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-600 transition-all">
                  {event.title}
                </h3>
                <p className="text-blue-400 text-sm mb-4">{event.date}</p>
                <p className="text-gray-300 mb-6">{event.description}</p>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{event.participants}</span>
                  <span>{event.challenges} challenges</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Sponsors;