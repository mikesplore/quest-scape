import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, BookOpen, Star, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  thumbnail: string;
  price: number;
  isFree: boolean;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  duration: number; // in minutes
  studentsEnrolled: number;
  averageRating: number;
  totalLessons: number;
  instructor: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
  };
  learningObjectives: string[];
  requirements: string[];
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  isPreview: boolean;
}

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [instructor, setInstructor] = useState<{
    id: string;
    name: string;
    avatar: string;
    bio: string;
    coursesCount?: number;
    studentsCount?: number;
    averageRating?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch course details and lessons in parallel
        const [courseRes, lessonsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/courses/${id}`),
          fetch(`${API_BASE_URL}/lessons/course/${id}`)
        ]);

        if (!courseRes.ok) {
          throw new Error('Failed to fetch course details');
        }
        
        if (!lessonsRes.ok) {
          throw new Error('Failed to fetch course lessons');
        }

        const courseData = await courseRes.json();
        const lessonsData = await lessonsRes.json();
        
        console.log('Course API Response:', courseData); // Debug log

        // Transform and set the data
        // The API returns the course data inside a `data` property
        const courseDetails = courseData.data || courseData;
        
        // Use instructor data from course response
        const instructorData = courseDetails.instructor;
        
        setCourse({
          id: courseDetails.id,
          title: courseDetails.title,
          subtitle: courseDetails.subtitle || '',
          description: courseDetails.description,
          thumbnail: courseDetails.thumbnail || 'https://via.placeholder.com/800x400',
          price: courseDetails.price || 0,
          isFree: courseDetails.isFree || false,
          level: courseDetails.level || 'beginner',
          category: courseDetails.category || 'Uncategorized',
          duration: courseDetails.duration || 0,
          studentsEnrolled: courseDetails.enrollmentCount || courseDetails.studentsEnrolled || 0,
          averageRating: courseDetails.averageRating || 0,
          totalLessons: courseDetails.lessonCount || courseDetails.totalLessons || 0,
          instructor: {
            id: instructorData.id,
            name: instructorData.name,
            avatar: instructorData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorData.name)}`,
            bio: instructorData.bio || 'No bio available'
          },
          learningObjectives: courseDetails.learningObjectives || [],
          requirements: courseDetails.requirements || []
        });

        // Transform and set lessons
        setLessons(lessonsData.data.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          duration: 30, // Default duration in minutes, adjust as needed
          isPreview: lesson.order === 1 // Make first lesson a preview
        })));

        // Set instructor data for the instructor tab
        setInstructor({
          id: instructorData.id,
          name: instructorData.name,
          email: instructorData.email,
          avatar: instructorData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructorData.name)}`,
          bio: instructorData.bio || 'No bio available',
          coursesCount: instructorData._count?.courses || 0,
          studentsCount: instructorData._count?.students || 0,
          averageRating: instructorData.averageRating || 0
        });

      } catch (error) {
        console.error('Error fetching course details:', error);
        setError('Failed to load course details. Please try again later.');
        toast.error('Failed to load course details');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCourseDetails();
    } else {
      setError('No course ID provided');
      setIsLoading(false);
    }
  }, [id]);

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/courses/${id}` } });
      return;
    }
    // TODO: Implement enrollment logic
    toast.success('Enrollment successful!');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-muted w-1/4 rounded"></div>
          <div className="h-96 bg-muted rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-6 bg-muted w-3/4 rounded"></div>
            <div className="h-4 bg-muted w-1/2 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Error Loading Course</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button asChild>
          <Link to="/courses">Browse All Courses</Link>
        </Button>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <p className="text-muted-foreground mb-6">The course you're looking for doesn't exist or has been removed.</p>
        <Button asChild>
          <Link to="/courses">Browse Courses</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-background">
      {/* Course Hero Section */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Courses
          </Button>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm">{course.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{course.title}</h1>
                <p className="text-xl text-muted-foreground">{course.subtitle}</p>
                
                <div className="flex items-center space-x-4 text-sm">
                  {course.averageRating > 0 && (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                      <span>{course.averageRating.toFixed(1)}</span>
                      {course.studentsEnrolled > 0 && (
                        <span className="text-muted-foreground ml-1">
                          ({Math.ceil(course.studentsEnrolled * 0.2)} reviews)
                        </span>
                      )}
                    </div>
                  )}
                  {course.studentsEnrolled > 0 && (
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span>{course.studentsEnrolled.toLocaleString()} students</span>
                    </div>
                  )}
                  {course.duration > 0 && (
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                      <span>{Math.ceil(course.duration / 60)} hours</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center pt-2">
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={course.instructor.avatar} alt={course.instructor.name} />
                    <AvatarFallback>{course.instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Created by {course.instructor.name}</p>
                    <p className="text-sm text-muted-foreground">Senior Instructor</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {course.isFree ? 'Free' : `Ksh.${course.price.toFixed(2)}`}
                  </CardTitle>
                  <CardDescription>One-time payment, lifetime access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{course.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{Math.floor(course.duration / 60)} hours of content</span>
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleEnrollClick}
                  >
                    {isAuthenticated ? 'Enroll Now' : 'Sign Up to Enroll'}
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    30-day money-back guarantee
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      {/* Course Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Tabs defaultValue="overview" onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="instructor">Instructor</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-4">About This Course</h3>
                  <p className="text-muted-foreground leading-relaxed">{course.description}</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.learningObjectives.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-muted-foreground">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                  <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                    {course.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="curriculum">
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-6 py-4 border-b">
                    <h3 className="font-medium">Course Content</h3>
                    <p className="text-sm text-muted-foreground">{lessons.length} lessons • {Math.floor(course.duration / 60)} hours</p>
                  </div>
                  
                  <div className="divide-y">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id} className="p-4 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center mr-3">
                              <span className="text-sm font-medium">{index + 1}</span>
                            </div>
                            <span className={!isAuthenticated && !lesson.isPreview ? 'text-muted-foreground' : ''}>
                              {lesson.title}
                            </span>
                            {lesson.isPreview && (
                              <Badge variant="outline" className="ml-2">Preview</Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {!isAuthenticated && (
                  <div className="mt-6 text-center">
                    <p className="text-muted-foreground mb-4">Sign up to access all lessons and materials</p>
                    <Button onClick={handleEnrollClick}>Sign Up to Enroll</Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="instructor" className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-6">
                  <div className="flex-shrink-0">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={instructor?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor?.name || '')}`} alt={instructor?.name} />
                      <AvatarFallback>{(instructor?.name || 'U').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{instructor?.name || 'Instructor'}</h3>
                    {instructor?.coursesCount && (
                      <p className="text-muted-foreground mb-2">
                        {instructor.coursesCount} {instructor.coursesCount === 1 ? 'Course' : 'Courses'} • {instructor.studentsCount?.toLocaleString() || '0'} Students
                      </p>
                    )}
                    <p className="text-muted-foreground">
                      {instructor?.bio || 'No biography available'}
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">15+</p>
                    <p className="text-sm text-muted-foreground">Courses</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">50K+</p>
                    <p className="text-sm text-muted-foreground">Students</p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>This course includes:</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Access on mobile and TV</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Downloadable resources</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Share this course</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-3">
                  <Button variant="outline" size="icon">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </Button>
                  <Button variant="outline" size="icon">
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
