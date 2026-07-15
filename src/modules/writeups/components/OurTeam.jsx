import { motion } from 'framer-motion';
import { useIntersection } from 'react-use';
import { useRef } from 'react';
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa';

const OurTeam = () => {
  const ref = useRef();
  const isInView = useIntersection(ref, { once: true, margin: "-100px" });

  const teamMembers = [
    {
      name: 'Sugeeth J S',
      role: 'Founder & Lead Developer',
      bio: 'Passionate about cybersecurity and web development',
      social: { github: 'https://github.com/sugeethjsa', twitter: 'https://twitter.com/sugeethjsa', linkedin: 'https://linkedin.com/in/sugeethjs' }
    },
    {
      name: 'Alex Chen',
      role: 'CTF Coordinator',
      bio: 'Expert in network security and cryptography',
      social: { github: 'https://github.com/alexchen', twitter: 'https://twitter.com/alexchen', linkedin: 'https://linkedin.com/in/alexchen' }
    },
    {
      name: 'Maria Rodriguez',
      role: 'Content Creator',
      bio: 'Specializes in writing comprehensive CTF writeups',
      social: { github: 'https://github.com/mariarodriguez', twitter: 'https://twitter.com/mariarodriguez', linkedin: 'https://linkedin.com/in/mariarodriguez' }
    },
    {
      name: 'David Kim',
      role: 'Event Organizer',
      bio: 'Organizes community workshops and competitions',
      social: { github: 'https://github.com/davidkim', twitter: 'https://twitter.com/davidkim', linkedin: 'https://linkedin.com/in/davidkim' }
    },
    {
      name: 'Sarah Johnson',
      role: 'Community Manager',
      bio: 'Fosters community engagement and growth',
      social: { github: 'https://github.com/sarahjohnson', twitter: 'https://twitter.com/sarahjohnson', linkedin: 'https://linkedin.com/in/sarahjohnson' }
    },
    {
      name: 'Mike Wilson',
      role: 'Security Researcher',
      bio: 'Conducts research on emerging cybersecurity threats',
      social: { github: 'https://github.com/mikewilson', twitter: 'https://twitter.com/mikewilson', linkedin: 'https://linkedin.com/in/mikewilson' }
    }
  ];

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <p className="text-[10px] text-white/15 font-bold uppercase tracking-[0.4em] mb-3 font-general">// Team</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
            Meet Our Team
          </h2>
          <p className="text-lg text-white/30 max-w-3xl mx-auto">
            The passionate individuals behind CYSCOM VIT Chennai
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              whileHover={{ y: -6 }}
              className="group relative crypto-card rounded-2xl overflow-hidden transition-all"
            >
              <div className="relative h-48 overflow-hidden bg-white/[0.02]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                    <span className="text-xl font-black text-white/30">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-base font-bold mb-1 text-white group-hover:text-white/80 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-white/25 font-semibold text-sm mb-3">{member.role}</p>
                <p className="text-white/20 text-sm mb-5">{member.bio}</p>
                <div className="flex space-x-4">
                  {[
                    { href: member.social.github, Icon: FaGithub },
                    { href: member.social.twitter, Icon: FaTwitter },
                    { href: member.social.linkedin, Icon: FaLinkedin },
                  ].map(({ href, Icon }, i) => (
                    <motion.a
                      key={i}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.15, y: -2 }}
                      className="text-white/15 hover:text-white/50 transition-colors"
                    >
                      <Icon size={16} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;