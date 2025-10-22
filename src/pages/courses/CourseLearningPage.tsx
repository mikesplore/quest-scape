import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  PlayCircle,
  FileText,
  Download,
  Menu,
  X,
  Clock,
  BookOpen,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'quiz';
  duration: string;
  isCompleted: boolean;
  content?: string;
  videoUrl?: string;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface CourseData {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  sections: Section[];
}

const CourseLearningPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [course, setCourse] = useState<CourseData | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      setIsLoading(true);
      try {
        // Simulate API call - replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock course data
        const mockCourse: CourseData = {
          id: courseId,
          title: 'Complete Web Development Bootcamp',
          instructor: 'Sarah Johnson',
          progress: 35,
          sections: [
            {
              id: 'section-1',
              title: 'Introduction to Web Development',
              lessons: [
                {
                  id: 'lesson-1',
                  title: 'Welcome to the Course',
                  type: 'video',
                  duration: '5:30',
                  isCompleted: true,
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                },
                {
                  id: 'lesson-2',
                  title: 'Setting Up Your Development Environment',
                  type: 'video',
                  duration: '12:45',
                  isCompleted: true,
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                },
                {
                  id: 'lesson-3',
                  title: 'Course Resources',
                  type: 'reading',
                  duration: '5 min read',
                  isCompleted: false,
                  content: `
                    <h2>Course Resources</h2>
                    <p>Welcome to the course! Here are some important resources you'll need:</p>
                    <ul>
                      <li>Code editor (VS Code recommended)</li>
                      <li>Modern web browser (Chrome/Firefox)</li>
                      <li>Git for version control</li>
                      <li>Node.js and npm</li>
                    </ul>
                  `,
                },
              ],
            },
            {
              id: 'section-2',
              title: 'HTML Fundamentals',
              lessons: [
                {
                  id: 'lesson-4',
                  title: 'HTML Basics',
                  type: 'video',
                  duration: '18:20',
                  isCompleted: false,
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                },
                {
                  id: 'lesson-5',
                  title: 'HTML Elements and Attributes',
                  type: 'video',
                  duration: '22:15',
                  isCompleted: false,
                  videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                },
              ],
            },
          ],
        };

        setCourse(mockCourse);
        
        // Set the first incomplete lesson as current, or first lesson if all complete
        const firstIncompleteLesson = mockCourse.sections
          .flatMap((s) => s.lessons)
          .find((l) => !l.isCompleted);
        
        setCurrentLesson(firstIncompleteLesson || mockCourse.sections[0].lessons[0]);
      } catch (error) {
        console.error('Failed to fetch course data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load course content',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCourseData();
    }
  }, [courseId, isAuthenticated, toast]);

  const handleLessonComplete = async () => {
    if (!currentLesson || !course) return;

    try {
      // Update lesson completion status
      const updatedSections = course.sections.map((section) => ({
        ...section,
        lessons: section.lessons.map((lesson) =>
          lesson.id === currentLesson.id
            ? { ...lesson, isCompleted: true }
            : lesson
        ),
      }));

      setCourse({
        ...course,
        sections: updatedSections,
      });

      // Move to next lesson
      const allLessons = updatedSections.flatMap((s) => s.lessons);
      const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
      if (currentIndex < allLessons.length - 1) {
        setCurrentLesson(allLessons[currentIndex + 1]);
      }

      toast({
        title: 'Lesson Completed!',
        description: 'Great job! Moving to the next lesson.',
      });
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error);
    }
  };

  const handlePreviousLesson = () => {
    if (!course || !currentLesson) return;

    const allLessons = course.sections.flatMap((s) => s.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
    
    if (currentIndex > 0) {
      setCurrentLesson(allLessons[currentIndex - 1]);
    }
  };

  const handleNextLesson = () => {
    if (!course || !currentLesson) return;

    const allLessons = course.sections.flatMap((s) => s.lessons);
    const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
    
    if (currentIndex < allLessons.length - 1) {
      setCurrentLesson(allLessons[currentIndex + 1]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-primary">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course || !currentLesson) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-bg-primary">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-text-primary mb-4">Course not found</h2>
          <Button onClick={() => navigate('/courses')}>Browse Courses</Button>
        </div>
      </div>
    );
  }

  const allLessons = course.sections.flatMap((s) => s.lessons);
  const currentLessonIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
  const totalLessons = allLessons.length;
  const completedLessons = allLessons.filter((l) => l.isCompleted).length;

  return (
    <div className="flex h-screen bg-bg-primary">
      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'tween' }}
            className="w-80 bg-bg-secondary border-r border-border-primary overflow-y-auto"
          >
            <div className="p-6">
              {/* Course Header */}
              <div className="mb-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/courses/${courseId}`)}
                  className="mb-4"
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Back to Course
                </Button>
                <h2 className="text-lg font-bold text-text-primary mb-2">{course.title}</h2>
                <p className="text-sm text-text-secondary mb-4">By {course.instructor}</p>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Progress</span>
                    <span className="font-semibold text-text-primary">
                      {completedLessons}/{totalLessons} lessons
                    </span>
                  </div>
                  <Progress value={(completedLessons / totalLessons) * 100} />
                </div>
              </div>

              {/* Course Content */}
              <div className="space-y-4">
                {course.sections.map((section) => (
                  <div key={section.id}>
                    <h3 className="font-semibold text-text-primary mb-2">{section.title}</h3>
                    <div className="space-y-1">
                      {section.lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                            currentLesson.id === lesson.id
                              ? 'bg-primary text-white'
                              : 'hover:bg-bg-tertiary text-text-secondary'
                          }`}
                        >
                          {lesson.isCompleted ? (
                            <CheckCircle size={18} className="flex-shrink-0" />
                          ) : lesson.type === 'video' ? (
                            <PlayCircle size={18} className="flex-shrink-0" />
                          ) : (
                            <FileText size={18} className="flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{lesson.title}</p>
                            <p className="text-xs opacity-75">{lesson.duration}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-bg-secondary border-b border-border-primary p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <div>
              <h1 className="text-lg font-bold text-text-primary">{currentLesson.title}</h1>
              <p className="text-sm text-text-secondary">
                Lesson {currentLessonIndex + 1} of {totalLessons}
              </p>
            </div>
          </div>
          
          {!currentLesson.isCompleted && (
            <Button onClick={handleLessonComplete} size="sm">
              <CheckCircle size={16} className="mr-2" />
              Mark as Complete
            </Button>
          )}
        </div>

        {/* Lesson Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentLesson.type === 'video' && (
            <div className="max-w-5xl mx-auto">
              <div className="aspect-video bg-black rounded-lg overflow-hidden mb-6">
                <iframe
                  src={currentLesson.videoUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title={currentLesson.title}
                />
              </div>
            </div>
          )}

          {currentLesson.type === 'reading' && (
            <div className="max-w-3xl mx-auto">
              <div
                className="prose prose-lg max-w-none text-text-primary"
                dangerouslySetInnerHTML={{ __html: currentLesson.content || '' }}
              />
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-bg-secondary border-t border-border-primary p-4 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePreviousLesson}
            disabled={currentLessonIndex === 0}
          >
            <ChevronLeft size={16} className="mr-2" />
            Previous
          </Button>
          <Button
            onClick={handleNextLesson}
            disabled={currentLessonIndex === totalLessons - 1}
          >
            Next
            <ChevronRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseLearningPage;
