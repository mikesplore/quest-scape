import React from 'react';
import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedCourses } from '@/components/FeaturedCourses';
import { Footer } from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturedCourses />
      
      {/* Stats Section */}
      <section className="py-20 bg-bg-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-display text-text-primary mb-4">
              Trusted by Students Worldwide
            </h2>
            <p className="text-body text-text-secondary max-w-2xl mx-auto">
              Join a global community of learners and take your skills to the next level
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: "10K+", label: "Active Students", color: "text-primary" },
              { number: "500+", label: "Expert Courses", color: "text-secondary" },
              { number: "100+", label: "Industry Experts", color: "text-success" },
              { number: "95%", label: "Success Rate", color: "text-warning" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center glass-card p-6 group hover:scale-105 transition-transform duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`text-display font-bold ${stat.color} mb-2 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-body text-text-secondary">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
