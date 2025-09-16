import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Clock, BookOpen, Star } from 'lucide-react';
import heroImage from '@/assets/hero-learning.jpg';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img 
          src={heroImage}
          alt="Students learning together"
          className="w-full h-full object-cover opacity-20"
        />
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--secondary) / 0.05))',
          }}
        />
      </div>
      
      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl"
          animate={{ 
            y: [0, -20, 0],
            x: [0, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-16 h-16 bg-secondary/30 rounded-full blur-lg"
          animate={{ 
            y: [0, 15, 0],
            x: [0, -8, 0]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-20 right-40 w-32 h-32 bg-secondary/15 rounded-full blur-2xl"
          animate={{ 
            y: [0, 25, 0],
            x: [0, -15, 0]
          }}
          transition={{ 
            duration: 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-24 h-24 bg-primary/15 rounded-full blur-xl"
          animate={{ 
            y: [0, -18, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-caption font-medium text-primary mb-8"
          >
            <Star size={16} className="animate-pulse-glow" />
            Join 10,000+ students worldwide
          </motion.div>
          
          <h1 className="text-hero text-text-primary mb-8 leading-tight">
            Learn From The{" "}
            <span className="gradient-text">
              Best Instructors
            </span>
            <br />
            <span className="text-display text-text-secondary">
              At Your Own Pace
            </span>
          </h1>
        </motion.div>
        
        <motion.p
          className="text-body text-text-secondary mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Master new skills with our comprehensive courses designed by industry experts. 
          Learn at your own pace with interactive content, hands-on projects, and personalized feedback.
          Transform your career with cutting-edge knowledge and practical experience.
        </motion.p>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link to="/courses" className="btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl">
            Explore Courses
            <ArrowRight size={20} />
          </Link>
          <button className="flex items-center gap-3 text-text-secondary hover:text-text-primary transition-colors group">
            <div className="w-12 h-12 bg-bg-secondary/80 backdrop-blur-sm border border-border-primary rounded-full flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-300">
              <Play size={16} />
            </div>
            <span className="text-body font-medium">Watch Demo</span>
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { icon: Users, number: "10K+", label: "Students" },
            { icon: BookOpen, number: "500+", label: "Courses" },
            { icon: Clock, number: "100K+", label: "Hours Learned" },
            { icon: Star, number: "4.9", label: "Average Rating" }
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="text-center group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-bg-secondary/80 backdrop-blur-sm border border-border-primary rounded-xl mb-3 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <stat.icon size={20} />
              </div>
              <div className="text-title font-bold text-text-primary mb-1">
                {stat.number}
              </div>
              <div className="text-caption text-text-muted">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};