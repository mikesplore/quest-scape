import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Import environment variables with Vite's import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create an Axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds timeout
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
  price?: number;
}

// Course progress interface
export interface CourseProgress {
  progress: number;
  completedLessons: number;
  totalLessons: number;
  lastAccessed: string;
}

// Payment interface
export interface PaymentInitiationResponse {
  authorizationUrl: string;
  reference: string;
  accessCode: string;
}

// Flag to prevent multiple simultaneous token refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token || '');
    }
  });
  failedQueue = [];
};

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    // Skip for the refresh token request to prevent infinite loops
    if (config.url?.includes('/auth/refresh')) {
      return config;
    }
    
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;
    
    // If there's no response, network error, or the error is not 401, reject
    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // Define public routes that don't require authentication
    const publicRoutes = [
      '/courses',
      '/api/courses',
      '/auth/login',
      '/auth/register',
      '/auth/refresh',
      '/payments/verify',  // For public payment verification
      '/payments/initialize', // For payment initialization
      '/payments/webhook'  // For payment webhooks
    ];

    // Skip for public routes
    const isPublicRoute = publicRoutes.some(route => 
      originalRequest.url?.includes(route)
    );

    if (isPublicRoute) {
      return Promise.reject(error);
    }

    // If already refreshing, add the request to the queue
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ 
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          }, 
          reject: (err: any) => reject(err) 
        });
      });
    }

    // Mark that we're currently refreshing the token
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Try to refresh the token
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Make a direct axios call to avoid using the interceptor
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const { accessToken, refreshToken: newRefreshToken } = response.data.data || response.data;
      
      if (!accessToken) {
        throw new Error('No access token in refresh response');
      }
      
      // Update tokens in storage
      localStorage.setItem('accessToken', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      // Update the Authorization header
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;

      // Process the queue with the new token
      processQueue(null, accessToken);

      // Retry the original request
      return api(originalRequest);
    } catch (refreshError) {
      console.error('Token refresh failed:', refreshError);
      
      // If refresh fails, clear auth data and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Process the queue with error
      processQueue(refreshError, null);
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?returnUrl=${returnUrl}`;
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
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
