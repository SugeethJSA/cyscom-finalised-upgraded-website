import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

export const StickyScrollRevealDemo = () => {
  const ref = useRef();
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const features = [
    {
      title: 'Interactive Learning',
      description: 'Engage with hands-on CTF challenges and real-world scenarios',
      icon: '🎮',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Expert Guidance',
      description: 'Learn from experienced cybersecurity professionals',
      icon: '👨‍🏫',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Community Support',
      description: 'Collaborate with peers and get help when needed',
      icon: '🤝',
      color: 'from-green-500 to-teal-500'
    },
    {
      title: 'Career Advancement',
      description: 'Build skills that are valued in the industry',
      icon: '🚀',
      color: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Why Choose CYSCOM?
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We provide everything you need to excel in the cybersecurity field
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              whileHover={{ scale: 1.05, y: -10 }}
              className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-blue-500/50 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl`} />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}
                >
                  <span className="text-2xl">{feature.icon}</span>
                </motion.div>
                <h3 className="text-xl font-semibold mb-4 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-600 transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StickyScrollRevealDemo;