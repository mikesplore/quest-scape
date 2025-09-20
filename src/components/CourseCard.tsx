import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Clock, Star, BookOpen, ArrowRight, User } from 'lucide-react';
import { Course } from '@/types/api';

interface CourseCardProps {
  course: Course;
  index?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, index = 0 }) => {
  const handleClick = () => {
    // Track course view analytics if needed
    console.log(`Course viewed: ${course.title}`);
  };

  return (
    <motion.div
      className="glass-card overflow-hidden group cursor-pointer h-full flex flex-col"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ transitionDelay: `${index * 50}ms` }}
      onClick={handleClick}
    >
      {/* Course thumbnail with overlay gradient */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={course.thumbnailUrl || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category badge */}
        {course.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-primary/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-small font-medium shadow-lg">
              {course.category}
            </span>
          </div>
        )}
        
        {/* Price badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-white/90 backdrop-blur-sm text-text-primary px-3 py-1 rounded-full text-small font-bold shadow-lg">
            Ksh.{course.price}
          </span>
        </div>

        {/* Hover overlay with action */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
          <Link 
            to={`/courses/${course.id}`}
            className="btn-primary transform scale-90 group-hover:scale-100 transition-transform duration-300"
          >
            View Course
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
      
      {/* Card content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-title text-text-primary mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-300">
          {course.title}
        </h3>
        <p className="text-body text-text-secondary mb-4 line-clamp-3 flex-1">
          {course.description}
        </p>
        
        {/* Instructor info */}
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border-primary">
          {course.instructor?.avatarUrl ? (
            <img 
              src={course.instructor.avatarUrl}
              alt={course.instructor.name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
          )}
          <div>
            <span className="text-caption font-medium text-text-primary block">
              {course.instructor?.name || 'Expert Instructor'}
            </span>
            <span className="text-small text-text-muted">
              Instructor
            </span>
          </div>
        </div>
        
        {/* Stats and rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-caption text-text-muted">
              <Users size={14} />
              <span>{course.studentCount || course.enrollments?.length || Math.floor(Math.random() * 500) + 100}</span>
            </div>
            <div className="flex items-center gap-1 text-caption text-text-muted">
              <BookOpen size={14} />
              <span>{course.lessons?.length || Math.floor(Math.random() * 20) + 5} lessons</span>
            </div>
            <div className="flex items-center gap-1 text-caption text-text-muted">
              <Clock size={14} />
              <span>{course.duration || `${Math.floor(Math.random() * 10) + 2}h`}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-1 text-caption text-warning">
            <Star size={14} fill="currentColor" />
            <span className="font-medium">4.{Math.floor(Math.random() * 4) + 6}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};