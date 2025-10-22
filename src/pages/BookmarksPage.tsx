import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, BookmarkCheck, Search, Filter, Star, Clock, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BookmarkedCourse {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  category: string;
  rating: number;
  duration: string;
  level: string;
  bookmarkedAt: Date;
  price: number;
  isFree: boolean;
}

const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkedCourse[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkedCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch bookmarks (simulated data for now)
  useEffect(() => {
    const fetchBookmarks = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Mock data
        const mockBookmarks: BookmarkedCourse[] = [
          {
            id: '1',
            title: 'Complete Web Development Bootcamp',
            instructor: 'Sarah Johnson',
            thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
            category: 'Programming',
            rating: 4.8,
            duration: '40 hours',
            level: 'Beginner',
            bookmarkedAt: new Date('2024-01-15'),
            price: 89.99,
            isFree: false,
          },
          {
            id: '2',
            title: 'Advanced React Patterns',
            instructor: 'Michael Chen',
            thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
            category: 'Programming',
            rating: 4.9,
            duration: '25 hours',
            level: 'Advanced',
            bookmarkedAt: new Date('2024-02-20'),
            price: 0,
            isFree: true,
          },
          {
            id: '3',
            title: 'Data Science Fundamentals',
            instructor: 'Dr. Emily Rodriguez',
            thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
            category: 'Data Science',
            rating: 4.7,
            duration: '35 hours',
            level: 'Intermediate',
            bookmarkedAt: new Date('2024-03-10'),
            price: 79.99,
            isFree: false,
          },
        ];
        
        setBookmarks(mockBookmarks);
        setFilteredBookmarks(mockBookmarks);
      } catch (error) {
        console.error('Failed to fetch bookmarks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchBookmarks();
    }
  }, [isAuthenticated]);

  // Filter bookmarks
  useEffect(() => {
    let filtered = bookmarks;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(
        (course) => course.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredBookmarks(filtered);
  }, [searchQuery, selectedCategory, bookmarks]);

  const handleRemoveBookmark = (courseId: string) => {
    setBookmarks((prev) => prev.filter((course) => course.id !== courseId));
  };

  const categories = ['all', ...Array.from(new Set(bookmarks.map((c) => c.category)))];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-primary to-bg-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <BookmarkCheck size={32} className="text-primary" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-text-primary">My Bookmarks</h1>
              <p className="text-text-secondary">
                {bookmarks.length} {bookmarks.length === 1 ? 'course' : 'courses'} saved
              </p>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
              <Input
                type="text"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredBookmarks.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-bg-secondary rounded-full">
                <Bookmark size={48} className="text-text-muted" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'No bookmarks found'
                : 'No bookmarks yet'}
            </h2>
            <p className="text-text-secondary mb-6">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Start bookmarking courses to save them for later'}
            </p>
            <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
          </motion.div>
        )}

        {/* Bookmarks Grid */}
        {!isLoading && filteredBookmarks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredBookmarks.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => handleRemoveBookmark(course.id)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-colors"
                      title="Remove bookmark"
                    >
                      <BookmarkCheck size={20} className="text-primary" />
                    </button>
                    <Badge
                      className="absolute top-3 left-3"
                      variant={course.isFree ? 'secondary' : 'default'}
                    >
                      {course.isFree ? 'Free' : `$${course.price}`}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="mb-3">
                      <Badge variant="outline" className="mb-2">
                        {course.category}
                      </Badge>
                      <h3 className="text-xl font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-text-secondary mb-3">{course.instructor}</p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
                      <div className="flex items-center gap-1">
                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                        <span>{course.rating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={16} />
                        <span>{course.duration}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {course.level}
                      </Badge>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => navigate(`/courses/${course.id}`)}
                      >
                        View Course
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BookmarksPage;
