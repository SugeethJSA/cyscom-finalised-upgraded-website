import { motion } from 'framer-motion';
import { useIntersection } from 'react-use';
import { useRef } from 'react';
import { FaGithub, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: FaGithub,
      link: 'https://github.com/cyscomvit',
      label: 'GitHub'
    },
    {
      icon: FaTwitter,
      link: 'https://twitter.com/CyscomVit',
      label: 'Twitter'
    },
    {
      icon: FaInstagram,
      link: 'https://www.instagram.com/cyscomvit/',
      label: 'Instagram'
    },
    {
      icon: FaLinkedin,
      link: 'https://www.linkedin.com/company/cyscomvit/',
      label: 'LinkedIn'
    },
    {
      icon: FaEnvelope,
      link: 'mailto:cyscom@vit.ac.in',
      label: 'Email'
    }
  ];

  const footerLinks = [
    {
      title: 'Community',
      links: [
        { name: 'Home', path: '/' },
        { name: 'Our Team', path: '/our-team' },
        { name: 'Events', path: '#' },
        { name: 'Blog', path: '#' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'CTF Writeups', path: '#' },
        { name: 'Tutorials', path: '#' },
        { name: 'Documentation', path: '#' },
        { name: 'FAQ', path: '#' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', path: '#' },
        { name: 'Terms of Service', path: '#' },
        { name: 'Code of Conduct', path: '#' },
        { name: 'Contributing', path: '#' }
      ]
    }
  ];

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {footerLinks.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.a
                      href={link.path}
                      whileHover={{ x: 5, color: '#6366f1' }}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-4 md:mb-0"
          >
            <p className="text-gray-300">
              © {currentYear} CYSCOM VIT CHENNAI. All rights reserved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex space-x-6"
          >
            {socialLinks.map((social) => (
              <motion.a
                key={social.label}
                href={social.link}
                whileHover={{ scale: 1.2, y: -5 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon size={20} />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;