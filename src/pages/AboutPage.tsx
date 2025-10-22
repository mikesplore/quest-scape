import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Target, Users, Award, BookOpen, TrendingUp } from 'lucide-react';

const AboutPage: React.FC = () => {
  const stats = [
    { icon: Users, label: 'Active Students', value: '10,000+' },
    { icon: BookOpen, label: 'Courses Available', value: '500+' },
    { icon: Award, label: 'Certificates Issued', value: '5,000+' },
    { icon: TrendingUp, label: 'Success Rate', value: '95%' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'To make quality education accessible to everyone, everywhere, empowering learners to achieve their goals and transform their careers.',
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building a supportive learning community where students and instructors collaborate and grow together.',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We maintain the highest standards in course quality, ensuring every learning experience is valuable and impactful.',
    },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    },
    {
      name: 'Michael Chen',
      role: 'CTO & Co-Founder',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Education',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    },
    {
      name: 'David Kim',
      role: 'Head of Product',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full">
              <GraduationCap size={48} className="text-primary" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-text-primary mb-6">
            About LearnHub
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            We're on a mission to democratize education and empower millions of learners worldwide 
            to unlock their potential through accessible, high-quality online courses.
          </p>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <stat.icon size={32} className="text-primary" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-text-primary mb-2">
                {stat.value}
              </h3>
              <p className="text-text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-text-primary mb-8 text-center">
            Our Story
          </h2>
          <div className="space-y-6 text-text-secondary leading-relaxed">
            <p>
              Founded in 2020, LearnHub began with a simple idea: quality education should be 
              accessible to everyone, regardless of their location or background. What started as 
              a small platform with just a handful of courses has grown into a thriving learning 
              community serving thousands of students worldwide.
            </p>
            <p>
              Today, we partner with industry experts and experienced educators to create courses 
              that are not only informative but also practical and engaging. Our platform has helped 
              thousands of learners advance their careers, start new ventures, and achieve their 
              personal development goals.
            </p>
            <p>
              We believe that education is the key to unlocking human potential, and we're committed 
              to making that key accessible to everyone. Join us on this journey to make learning 
              a lifelong adventure.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-text-primary mb-12 text-center">
          Our Values
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-bg-primary p-8 rounded-xl border border-border-primary hover:border-primary transition-all duration-300"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-full">
                  <value.icon size={32} className="text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-4 text-center">
                {value.title}
              </h3>
              <p className="text-text-secondary text-center leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-text-primary mb-12 text-center">
          Meet Our Team
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-4 overflow-hidden rounded-xl aspect-square">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                {member.name}
              </h3>
              <p className="text-text-secondary">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-12 text-center text-white"
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students already learning on our platform. 
            Start your journey today!
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/register"
              className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Started
            </a>
            <a
              href="/courses"
              className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Browse Courses
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
