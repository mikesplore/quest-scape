import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, AuthResponse, LoginCredentials, RegisterData, Course, User, Lesson, Quiz, QuizSubmission, QuizResult, Enrollment } from '@/types/api';
import toast from 'react-hot-toast';

// Base URL for the LMS backend API
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling and token refresh
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              const response = await this.client.post('/auth/refresh', { refreshToken });
              const { accessToken } = response.data.data;
              
              localStorage.setItem('accessToken', accessToken);
              originalRequest.headers.Authorization = `Bearer ${accessToken}`;
              
              return this.client(originalRequest);
            }
          } catch (refreshError) {
            // Refresh failed, redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Show error toast for non-auth errors
        if (error.response?.status !== 401) {
          const message = error.response?.data?.error || error.message || 'An error occurred';
          toast.error(message);
        }

        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data.data;
  }

  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post<ApiResponse<AuthResponse>>('/auth/register', userData);
    return response.data.data;
  }

  async getMe(): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const response = await this.client.post<ApiResponse<{ accessToken: string }>>('/auth/refresh', { refreshToken });
    return response.data.data;
  }

  // Course endpoints
  async getCourses(params?: { 
    published?: boolean; 
    category?: string; 
    instructorId?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Course[]; total: number; page: number; totalPages: number }> {
    const response = await this.client.get<ApiResponse<{
      data: Course[];
      total: number;
      page: number;
      totalPages: number;
    }>>('/courses', { params });
    
    return response.data.data;
  }

  async getCourse(id: string): Promise<Course> {
    const response = await this.client.get<ApiResponse<Course>>(`/courses/${id}`);
    return response.data.data;
  }

  async enrollInCourse(courseId: string): Promise<{ enrollmentId: string; progress: number }> {
    const response = await this.client.post<ApiResponse<{ enrollmentId: string; progress: number }>>(`/courses/${courseId}/enroll`);
    return response.data.data;
  }

  async getEnrolledCourses(): Promise<Course[]> {
    const response = await this.client.get<ApiResponse<Course[]>>('/courses/enrolled');
    return response.data.data;
  }

  // Lesson endpoints
  async getCourseLessons(courseId: string): Promise<Lesson[]> {
    const response = await this.client.get<ApiResponse<Lesson[]>>(`/courses/${courseId}/lessons`);
    return response.data.data;
  }

  async getLesson(id: string): Promise<Lesson> {
    const response = await this.client.get<ApiResponse<Lesson>>(`/lessons/${id}`);
    return response.data.data;
  }

  async getLessonQuizzes(lessonId: string): Promise<Quiz[]> {
    const response = await this.client.get<ApiResponse<Quiz[]>>(`/lessons/${lessonId}/quizzes`);
    return response.data.data;
  }

  // Quiz endpoints
  async submitQuiz(quizId: string, submission: QuizSubmission): Promise<QuizResult> {
    const response = await this.client.post<ApiResponse<QuizResult>>(`/quizzes/${quizId}/submit`, submission);
    return response.data.data;
  }

  // User endpoints
  async getUser(id: string): Promise<User> {
    const response = await this.client.get<ApiResponse<User>>(`/users/${id}`);
    return response.data.data;
  }

  // Admin endpoints
  async getAllUsers(): Promise<User[]> {
    const response = await this.client.get<ApiResponse<User[]>>('/admin/users');
    return response.data.data;
  }

  async updateUserRole(userId: string, role: 'student' | 'instructor' | 'admin'): Promise<User> {
    const response = await this.client.patch<ApiResponse<User>>(`/admin/users/${userId}/role`, { role });
    return response.data.data;
  }
}

// Export singleton instance
export const apiClient = new ApiClient();