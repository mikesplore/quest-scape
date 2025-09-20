// Type definitions for the API module

declare module '@/services/api' {
  export interface Course {
    id: string;
    title: string;
    description: string;
    instructor: {
      id: string;
      name: string;
      avatar?: string;
    };
    thumbnail: string;
    progress: number;
    lastAccessed: string;
    totalLessons: number;
    completedLessons: number;
    enrollmentDate: string;
  }

  export interface ApiResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
    config: any;
  }

  export interface CourseProgress {
    progress: number;
    completedLessons: number;
    totalLessons: number;
    lastAccessed: string;
  }

  export const coursesApi: {
    getEnrolledCourses: (userId: string) => Promise<ApiResponse<Course[]>>;
    getCourseProgress: (userId: string, courseId: string) => Promise<ApiResponse<CourseProgress>>;
    downloadCertificate: (userId: string, courseId: string) => Promise<Blob>;
  };

  const api: {
    get: <T = any>(url: string, config?: any) => Promise<ApiResponse<T>>;
    post: <T = any>(url: string, data?: any, config?: any) => Promise<ApiResponse<T>>;
    put: <T = any>(url: string, data?: any, config?: any) => Promise<ApiResponse<T>>;
    delete: <T = any>(url: string, config?: any) => Promise<ApiResponse<T>>;
  };

  export default api;
}
