// TypeScript interfaces for LMS Backend API

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  instructorId: string;
  instructor?: User;
  category?: string;
  price: number;
  published: boolean;
  createdAt: string;
  lessons?: Lesson[];
  enrollments?: Enrollment[];
  studentCount?: number;
  duration?: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  order: number;
  createdAt: string;
  quizzes?: Quiz[];
}

export interface Quiz {
  id: string;
  lessonId: string;
  question: string;
  options: string[]; // JSON array
  correctAnswer: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  progress: number; // 0-100
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface QuizSubmission {
  selectedAnswer: string;
}

export interface QuizResult {
  isCorrect: boolean;
  correctAnswer: string;
}