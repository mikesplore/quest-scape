import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/axios';

interface Course {
  id: string;
  title: string;
  description: string;
  progress: number;
  lastAccessed?: string;
  thumbnail?: string;
}

interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  issuedAt: string;
  imageUrl?: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  // Fetch enrolled courses
  const { data: enrolledCourses = [] } = useQuery<Course[]>({
    queryKey: ['enrolledCourses'],
    queryFn: async () => {
      const { data } = await api.get('/api/courses/enrolled');
      return data;
    },
  });

  // Fetch certificates
  const { data: certificates = [] } = useQuery<Certificate[]>({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data } = await api.get(`/api/certificates?userId=${user?.id}`);
      return data;
    },
    enabled: !!user?.id,
  });

  // Calculate stats
  const stats = {
    enrolledCourses: enrolledCourses.length,
    completedCourses: enrolledCourses.filter(course => course.progress === 100).length,
    certificates: certificates.length,
    currentStreak: 3, // This would come from an API in a real app
  };

  // Get recently enrolled courses (last 3)
  const recentlyEnrolled = [...enrolledCourses]
    .sort((a, b) => new Date(b.lastAccessed || 0).getTime() - new Date(a.lastAccessed || 0).getTime())
    .slice(0, 3);

  // Get courses in progress (progress > 0 and < 100)
  const inProgressCourses = enrolledCourses.filter(
    course => course.progress > 0 && course.progress < 100
  );

  // Get recommended courses (in a real app, this would come from an API)
  const recommendedCourses = [
    {
      id: 'rec1',
      title: 'Advanced React Patterns',
      description: 'Master advanced React patterns and best practices',
      progress: 0,
    },
    {
      id: 'rec2',
      title: 'TypeScript Masterclass',
      description: 'Become a TypeScript expert',
      progress: 0,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || 'Student'}!</h1>
        <p className="text-muted-foreground">Here's your learning progress</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <StatsCard 
            title="Enrolled Courses" 
            value={stats.enrolledCourses} 
            icon="📚"
          />
          <StatsCard 
            title="Completed" 
            value={stats.completedCourses} 
            icon="✅"
          />
          <StatsCard 
            title="Certificates" 
            value={stats.certificates} 
            icon="🏆"
          />
          <StatsCard 
            title="Day Streak" 
            value={`${stats.currentStreak} days`} 
            icon="🔥"
          />
        </div>
      </div>

      {/* Continue Learning Section */}
      {inProgressCourses.length > 0 && (
        <Section 
          title="Continue Learning" 
          description="Pick up where you left off"
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inProgressCourses.map((course) => (
              <CourseCard key={course.id} course={course} showProgress />
            ))}
          </div>
        </Section>
      )}

      {/* Recently Enrolled Section */}
      {recentlyEnrolled.length > 0 && (
        <Section 
          title="Recently Enrolled" 
          description="Your newest courses"
          className="mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentlyEnrolled.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </Section>
      )}

      {/* Recommended Courses */}
      <Section 
        title="Recommended for You" 
        description="Based on your interests"
        className="mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </Section>

      {/* Achievements/Certificates */}
      {certificates.length > 0 && (
        <Section 
          title="Your Achievements" 
          description="Certificates you've earned"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.slice(0, 3).map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>
          {certificates.length > 3 && (
            <div className="mt-6 text-center">
              <Button variant="outline">View All Certificates</Button>
            </div>
          )}
        </Section>
      )}
    </div>
  );
};

// Helper Components
const Section = ({ 
  title, 
  description, 
  children, 
  className = '' 
}: { 
  title: string; 
  description: string; 
  children: React.ReactNode;
  className?: string;
}) => (
  <section className={className}>
    <div className="mb-6">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground">{description}</p>
    </div>
    {children}
  </section>
);

const StatsCard = ({ title, value, icon }: { title: string; value: string | number; icon: string }) => (
  <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-sm hover:shadow-md transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </CardContent>
  </Card>
);

const CourseCard = ({ 
  course, 
  showProgress = false 
}: { 
  course: Course; 
  showProgress?: boolean;
}) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-32 bg-muted/50 flex items-center justify-center">
      {course.thumbnail ? (
        <img 
          src={course.thumbnail} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="text-muted-foreground">Course Image</div>
      )}
    </div>
    <CardHeader>
      <CardTitle className="text-lg">{course.title}</CardTitle>
      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      {showProgress && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-medium">{Math.round(course.progress)}%</span>
          </div>
          <Progress value={course.progress} className="h-2" />
        </div>
      )}
      <Button className="w-full">
        {course.progress > 0 ? 'Continue' : 'Start Learning'}
      </Button>
    </CardContent>
  </Card>
);

const CertificateCard = ({ certificate }: { certificate: Certificate }) => (
  <Card className="overflow-hidden hover:shadow-md transition-shadow">
    <div className="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
      {certificate.imageUrl ? (
        <img 
          src={certificate.imageUrl} 
          alt={`Certificate for ${certificate.courseTitle}`} 
          className="w-full h-full object-contain p-4"
        />
      ) : (
        <div className="text-center p-4">
          <div className="text-4xl mb-2">🎓</div>
          <p className="font-medium">{certificate.courseTitle}</p>
          <p className="text-sm text-muted-foreground">
            Issued on {new Date(certificate.issuedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
    <CardContent className="p-4">
      <Button variant="outline" className="w-full">
        View Certificate
      </Button>
    </CardContent>
  </Card>
);

export default DashboardPage;
