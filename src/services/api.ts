import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Import environment variables with Vite's import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Create an Axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Enable sending/receiving cookies with CORS
});

// Define response data structure
interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: AxiosRequestConfig;
}

// Course interface
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

// Course progress interface
export interface CourseProgress {
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: string;
}

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config: AxiosRequestConfig): any => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (e.g., redirect to login)
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY || 'auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Helper function to handle API responses
const handleResponse = <T>(response: AxiosResponse<T>): ApiResponse<T> => ({
  data: response.data,
  status: response.status,
  statusText: response.statusText,
  headers: response.headers,
  config: response.config,
});

// Course-related API calls
export const coursesApi = {
  /**
   * Get all enrolled courses for a student
   * @param userId - The ID of the student
   * @returns Promise with the list of enrolled courses
   */
  getEnrolledCourses: async (userId: string): Promise<ApiResponse<Course[]>> => {
    try {
      const response = await api.get<Course[]>(`/users/${userId}/enrolled-courses`);
      return handleResponse(response);
    } catch (error) {
      console.error('Error fetching enrolled courses:', error);
      throw error;
    }
  },
  
  /**
   * Get progress for a specific course
   * @param userId - The ID of the student
   * @param courseId - The ID of the course
   * @returns Promise with the course progress data
   */
  getCourseProgress: async (userId: string, courseId: string): Promise<ApiResponse<CourseProgress>> => {
    try {
      const response = await api.get<CourseProgress>(`/users/${userId}/courses/${courseId}/progress`);
      return handleResponse(response);
    } catch (error) {
      console.error(`Error fetching progress for course ${courseId}:`, error);
      throw error;
    }
  },
  
  /**
   * Download certificate for a completed course
   * @param userId - The ID of the student
   * @param courseId - The ID of the course
   * @returns Promise with the certificate blob
   */
  downloadCertificate: async (userId: string, courseId: string): Promise<Blob> => {
    try {
      const response = await api.get<Blob>(
        `/users/${userId}/courses/${courseId}/certificate`,
        { responseType: 'blob' }
      );
      return response.data;
    } catch (error) {
      console.error(`Error downloading certificate for course ${courseId}:`, error);
      throw error;
    }
  },
};

// Export the configured axios instance
export default api;
