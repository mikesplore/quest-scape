import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Learn',
      links: [
        { label: 'Browse Courses', href: '/courses' },
        { label: 'Programming', href: '/courses?category=programming' },
        { label: 'Data Science', href: '/courses?category=data-science' },
        { label: 'Design', href: '/courses?category=design' },
        { label: 'Marketing', href: '/courses?category=marketing' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Help Center', href: '/help' },
        { label: 'Contact Us', href: '/contact' },
        { label: 'Community', href: '/community' },
        { label: 'Course Refunds', href: '/refunds' },
        { label: 'Technical Support', href: '/support' },
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Press', href: '/press' },
        { label: 'Blog', href: '/blog' },
        { label: 'Partnerships', href: '/partnerships' },
      ]
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'Academic Integrity', href: '/integrity' },
        { label: 'Code of Conduct', href: '/conduct' },
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
    { icon: Github, href: '#', label: 'GitHub' },
  ];

  return (
    <footer className="bg-bg-secondary border-t border-border-primary">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Main footer content */}
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-12">
          {/* Brand section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <GraduationCap size={24} className="text-white" />
                </div>
                <span className="text-headline font-bold gradient-text">LearnHub</span>
              </Link>
              
              <p className="text-body text-text-secondary mb-6 leading-relaxed">
                Empowering learners worldwide with high-quality, accessible education. 
                Join thousands of students advancing their careers through expert-led courses.
              </p>
              
              {/* Contact info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-caption text-text-muted">
                  <Mail size={16} />
                  <span>hello@learnhub.com</span>
                </div>
                <div className="flex items-center gap-3 text-caption text-text-muted">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-caption text-text-muted">
                  <MapPin size={16} />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer sections */}
          {footerSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: sectionIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-title font-semibold text-text-primary mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-caption text-text-secondary hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter signup */}
        <motion.div
          className="mt-16 pt-12 border-t border-border-primary"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="max-w-2xl">
            <h3 className="text-title font-semibold text-text-primary mb-2">
              Stay Updated
            </h3>
            <p className="text-body text-text-secondary mb-6">
              Get the latest courses, tips, and learning resources delivered to your inbox.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-bg-primary border border-border-primary rounded-lg text-body text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              />
              <button className="btn-primary px-6 py-3">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom section */}
        <motion.div
          className="mt-12 pt-8 border-t border-border-primary flex flex-col md:flex-row justify-between items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-caption text-text-muted">
            © {currentYear} LearnHub. All rights reserved.
          </p>
          
          {/* Social links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="p-2 text-text-muted hover:text-primary hover:bg-bg-tertiary rounded-lg transition-all duration-200"
              >
                <social.icon size={20} />
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};