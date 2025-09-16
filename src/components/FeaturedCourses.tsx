import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import { Course } from '@/types/api';
import { apiClient } from '@/lib/api';
import { CourseCard } from '@/components/CourseCard';

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
        const coursesData = await apiClient.getCourses({ 
          published: true, 
          limit: 8 
        });
        
        setCourses(coursesData);
      } catch (err: any) {
        console.error('Failed to fetch featured courses:', err);
        setError('Failed to load courses. Please try again later.');
        
        // Fallback mock data for demo purposes
        setCourses([
          {
            id: '1',
            title: 'Complete Web Development Bootcamp',
            description: 'Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
            instructorId: '1',
            instructor: { 
              id: '1', 
              name: 'John Smith', 
              email: 'john@example.com', 
              role: 'instructor' as const, 
              createdAt: '2024-01-01' 
            },
            category: 'Programming',
            price: 89.99,
            published: true,
            createdAt: '2024-01-01',
            studentCount: 1250,
            duration: '12h'
          },
          {
            id: '2',
            title: 'Data Science with Python',
            description: 'Master data analysis, visualization, and machine learning with Python and popular libraries.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
            instructorId: '2',
            instructor: { 
              id: '2', 
              name: 'Sarah Johnson', 
              email: 'sarah@example.com', 
              role: 'instructor' as const, 
              createdAt: '2024-01-01' 
            },
            category: 'Data Science',
            price: 129.99,
            published: true,
            createdAt: '2024-01-01',
            studentCount: 890,
            duration: '15h'
          },
          {
            id: '3',
            title: 'UX/UI Design Fundamentals',
            description: 'Learn user experience and user interface design principles, tools, and best practices.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400&h=300&fit=crop',
            instructorId: '3',
            instructor: { 
              id: '3', 
              name: 'Mike Chen', 
              email: 'mike@example.com', 
              role: 'instructor' as const, 
              createdAt: '2024-01-01' 
            },
            category: 'Design',
            price: 79.99,
            published: true,
            createdAt: '2024-01-01',
            studentCount: 645,
            duration: '8h'
          },
          {
            id: '4',
            title: 'Digital Marketing Mastery',
            description: 'Comprehensive guide to SEO, social media, content marketing, and paid advertising.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
            instructorId: '4',
            instructor: { 
              id: '4', 
              name: 'Emma Wilson', 
              email: 'emma@example.com', 
              role: 'instructor' as const, 
              createdAt: '2024-01-01' 
            },
            category: 'Marketing',
            price: 99.99,
            published: true,
            createdAt: '2024-01-01',
            studentCount: 1100,
            duration: '10h'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-text-secondary">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-body">Loading featured courses...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="text-error mx-auto mb-4" />
          <h3 className="text-title text-text-primary mb-2">Unable to Load Courses</h3>
          <p className="text-body text-text-secondary mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-display text-text-primary mb-4">
            Featured Courses
          </h2>
          <p className="text-body text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Discover our most popular courses taught by industry experts. Start your learning journey 
            with hands-on projects and real-world applications.
          </p>
        </motion.div>
        
        {courses.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {courses.map((course, index) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-body text-text-muted">No courses available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
};