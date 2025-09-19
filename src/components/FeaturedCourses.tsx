import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, AlertCircle, BookOpen, Star } from 'lucide-react';
import { Course, ApiResponse } from '@/types/api';
import { apiClient } from '@/lib/api';
import { CourseCard } from '@/components/CourseCard';

// Skeleton loader component for course cards
const CourseCardSkeleton: React.FC = () => (
  <div className="glass-card p-4 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
    <div className="bg-bg-secondary rounded-lg h-40 animate-pulse mb-4"></div>
    <div className="flex-1 flex flex-col">
      <div className="h-6 bg-bg-secondary rounded w-3/4 mb-2 animate-pulse"></div>
      <div className="h-4 bg-bg-secondary rounded w-1/2 mb-4 animate-pulse"></div>
      <div className="h-3 bg-bg-secondary rounded w-full mb-2 animate-pulse"></div>
      <div className="h-3 bg-bg-secondary rounded w-5/6 mb-2 animate-pulse"></div>
      <div className="mt-auto pt-4 flex justify-between items-center">
        <div className="h-4 bg-bg-secondary rounded w-1/4 animate-pulse"></div>
        <div className="h-4 bg-bg-secondary rounded w-1/4 animate-pulse"></div>
      </div>
    </div>
  </div>
);

export const FeaturedCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch published courses with a limit for featured section
        const response = await apiClient.getCourses({ 
          published: true, 
          limit: 4 // Show 4 featured courses for better mobile experience
        });
        
        // Handle the API response which is of type ApiResponse<Course[]>
        const apiResponse = response as unknown as ApiResponse<Course[]>;
        const coursesData = apiResponse?.data || [];
        
        if (!Array.isArray(coursesData)) {
          throw new Error('Invalid response format from server');
        }
        
        setCourses(coursesData);
      } catch (err: any) {
        console.error('Failed to fetch featured courses:', err);
        setError('Failed to load featured courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  return (
    <section className="py-16 bg-bg-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-caption font-medium text-primary mb-4">
            <Star size={16} className="animate-pulse-glow" />
            Featured Courses
          </div>
          <h2 className="text-display text-text-primary mb-4">
            Start Your Learning Journey
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto">
            Explore our handpicked selection of top-rated courses from industry experts
          </p>
        </motion.div>
        
        <AnimatePresence>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                >
                  <CourseCardSkeleton />
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">Something went wrong</h3>
              <p className="text-text-secondary mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Try again
              </button>
            </motion.div>
          ) : courses.length === 0 ? (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-secondary mb-4">
                <BookOpen className="h-8 w-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-medium text-text-primary mb-2">No courses available</h3>
              <p className="text-text-secondary">Check back later for new courses</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <a
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors"
          >
            View all courses
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="m12 5 7 7-7 7"></path>
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};