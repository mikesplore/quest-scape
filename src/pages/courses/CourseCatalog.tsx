import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Loader2, AlertCircle, BookOpen, ArrowDown, ArrowUp, Check } from 'lucide-react';
import { CourseCard } from '@/components/CourseCard';
import { apiClient } from '@/lib/api';
import { Course } from '@/types/api';

// Mock categories - in a real app, these would come from the API
const CATEGORIES = [
  'All Categories',
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Data Science',
  'Language',
  'Personal Development'
];

const PRICE_RANGES = [
  { label: 'All Prices', value: 'all' },
  { label: 'Free', value: 'free' },
  { label: 'Paid', value: 'paid' },
  { label: '$0 - $50', value: '0-50' },
  { label: '$50 - $100', value: '50-100' },
  { label: '$100+', value: '100+' },
];

const LEVELS = [
  { label: 'All Levels', value: 'all' },
  { label: 'Beginner', value: 'beginner' },
  { label: 'Intermediate', value: 'intermediate' },
  { label: 'Advanced', value: 'advanced' },
];

const SORT_OPTIONS = [
  { label: 'Most Popular', value: 'popular' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
];

const CourseCatalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCourses, setTotalCourses] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || 'all',
    price: searchParams.get('price') || 'all',
    level: searchParams.get('level') || 'all',
    sort: searchParams.get('sort') || 'popular',
  });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch courses when filters change
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query params according to the API spec
        const params: {
          published?: boolean;
          category?: string;
          page?: number;
          limit?: number;
        } = {
          published: true,
          page: page,
          limit: 12,
        };

        if (filters.category && filters.category !== 'all') {
          params.category = filters.category;
        }

        // Update URL with current filters
        const newSearchParams = new URLSearchParams();
        if (filters.category && filters.category !== 'all') {
          newSearchParams.set('category', filters.category);
        }
        if (filters.search) {
          newSearchParams.set('search', filters.search);
        }
        window.history.replaceState({}, '', `?${newSearchParams.toString()}`);

        // Fetch courses from API
        const response = await apiClient.getCourses(params);
        
        // Update state with the response data
        if (page === 1) {
          setCourses(response.data);
        } else {
          setCourses(prev => [...prev, ...response.data]);
        }
        
        // Update pagination info
        setTotalCourses(response.total);
        setHasMore(page < response.totalPages);
      } catch (err: any) {
        console.error('Failed to fetch courses:', err);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [filters, page]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1); // Reset to first page when filters change
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form.elements.namedItem('search') as HTMLInputElement;
    handleFilterChange('search', searchInput.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: 'all',
      price: 'all',
      level: 'all',
      sort: 'popular',
    });
    setPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = 
    filters.search || 
    filters.category !== 'all' || 
    filters.price !== 'all' || 
    filters.level !== 'all';

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-text-primary mb-4">Explore Our Courses</h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Discover the perfect course to advance your skills and career
            </p>
            
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  name="search"
                  placeholder="Search for courses..."
                  defaultValue={filters.search}
                  className="w-full px-6 py-4 pr-12 rounded-full border border-border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-text-primary bg-bg-secondary"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-bg-secondary rounded-xl p-6 sticky top-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <X size={14} /> Clear all
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-text-primary mb-3">Category</h4>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => handleFilterChange('category', category === 'All Categories' ? 'all' : category)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        (category === 'All Categories' && filters.category === 'all') || 
                        category === filters.category
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-text-secondary hover:bg-bg-primary'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-text-primary mb-3">Price</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map(range => (
                    <button
                      key={range.value}
                      onClick={() => handleFilterChange('price', range.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        filters.price === range.value
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-text-secondary hover:bg-bg-primary'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-text-primary mb-3">Level</h4>
                <div className="space-y-2">
                  {LEVELS.map(level => (
                    <button
                      key={level.value}
                      onClick={() => handleFilterChange('level', level.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        filters.level === level.value
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-text-secondary hover:bg-bg-primary'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters Button */}
            <div className="lg:hidden flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {filters.search ? `Search: "${filters.search}"` : 'All Courses'}
                {totalCourses > 0 && <span className="text-text-secondary text-lg font-normal ml-2">({totalCourses})</span>}
              </h2>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-4 py-2 bg-bg-secondary rounded-lg text-text-primary hover:bg-bg-primary transition-colors"
              >
                <Filter size={18} />
                <span>Filters</span>
              </button>
            </div>

            {/* Sort Options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-text-secondary">
                Showing {courses.length} of {totalCourses} courses
              </p>
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="appearance-none bg-bg-secondary border border-border-primary rounded-lg pl-4 pr-10 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ArrowDown size={16} className="text-text-secondary" />
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.search && (
                  <div className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    {filters.search}
                    <button 
                      onClick={() => handleFilterChange('search', '')}
                      className="text-primary/70 hover:text-primary"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {filters.category !== 'all' && (
                  <div className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    {filters.category}
                    <button 
                      onClick={() => handleFilterChange('category', 'all')}
                      className="text-primary/70 hover:text-primary"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {filters.price !== 'all' && (
                  <div className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    {PRICE_RANGES.find(p => p.value === filters.price)?.label}
                    <button 
                      onClick={() => handleFilterChange('price', 'all')}
                      className="text-primary/70 hover:text-primary"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {filters.level !== 'all' && (
                  <div className="bg-primary/10 text-primary text-sm px-3 py-1 rounded-full flex items-center gap-1">
                    {LEVELS.find(l => l.value === filters.level)?.label}
                    <button 
                      onClick={() => handleFilterChange('level', 'all')}
                      className="text-primary/70 hover:text-primary"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-text-secondary hover:text-primary flex items-center gap-1"
                  >
                    <X size={14} /> Clear all
                  </button>
                )}
              </div>
            )}

            {/* Loading State */}
            {loading && courses.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-bg-secondary rounded-xl overflow-hidden animate-pulse h-80">
                    <div className="h-40 bg-bg-primary/30"></div>
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-bg-primary/30 rounded w-3/4"></div>
                      <div className="h-4 bg-bg-primary/30 rounded w-1/2"></div>
                      <div className="h-3 bg-bg-primary/30 rounded w-full"></div>
                      <div className="h-3 bg-bg-primary/30 rounded w-5/6"></div>
                      <div className="h-3 bg-bg-primary/30 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-16">
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
              </div>
            )}

            {/* Empty State */}
            {!loading && courses.length === 0 && !error && (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg-secondary mb-4">
                  <BookOpen className="h-8 w-8 text-text-muted" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">No courses found</h3>
                <p className="text-text-secondary mb-6">
                  {filters.search || hasActiveFilters 
                    ? 'Try adjusting your search or filters' 
                    : 'Check back later for new courses'}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            )}

            {/* Courses Grid */}
            {!loading && courses.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <CourseCard course={course} index={index} />
                    </motion.div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && !loading && (
                  <div className="mt-10 text-center">
                    <button
                      onClick={() => setPage(prev => prev + 1)}
                      disabled={loading}
                      className="px-6 py-2 bg-bg-secondary text-text-primary rounded-lg hover:bg-bg-primary transition-colors flex items-center gap-2 mx-auto"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="animate-spin h-5 w-5" />
                          Loading...
                        </>
                      ) : (
                        'Load More'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Overlay */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween' }}
              className="fixed inset-y-0 right-0 w-80 bg-bg-primary shadow-xl z-50 p-6 overflow-y-auto lg:hidden"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-text-primary">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="text-text-secondary hover:text-text-primary"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-text-primary mb-3">Category</h4>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <button
                      key={category}
                      onClick={() => {
                        handleFilterChange('category', category === 'All Categories' ? 'all' : category);
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        (category === 'All Categories' && filters.category === 'all') || 
                        category === filters.category
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-text-secondary hover:bg-bg-secondary'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-text-primary mb-3">Price</h4>
                <div className="space-y-2">
                  {PRICE_RANGES.map(range => (
                    <button
                      key={range.value}
                      onClick={() => {
                        handleFilterChange('price', range.value);
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        filters.price === range.value
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-text-secondary hover:bg-bg-secondary'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Level Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-text-primary mb-3">Level</h4>
                <div className="space-y-2">
                  {LEVELS.map(level => (
                    <button
                      key={level.value}
                      onClick={() => {
                        handleFilterChange('level', level.value);
                        setShowMobileFilters(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        filters.level === level.value
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-text-secondary hover:bg-bg-secondary'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="sticky bottom-0 bg-bg-primary pt-4 pb-6">
                <button
                  onClick={() => {
                    clearFilters();
                    setShowMobileFilters(false);
                  }}
                  className="w-full py-3 px-4 border border-border-primary rounded-lg text-text-primary hover:bg-bg-secondary transition-colors mb-3"
                >
                  Clear all filters
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Show results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CourseCatalog;
