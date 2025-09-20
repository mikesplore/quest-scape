import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useParams, useLocation } from "react-router-dom";
import { Toaster as HotToast } from 'react-hot-toast';

import { AuthProvider, useAuth, UserRole } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from '@/components/Header';

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CourseCatalog from "./pages/courses/CourseCatalog";
import CourseDetails from "./pages/courses/CourseDetails";
import { LoginPage, RegisterPage } from './pages/auth';
import { DashboardPage, MyCoursesPage } from './pages/student';

// Protected Route Component with Role-based Access Control
const ProtectedRoute = ({ 
  children, 
  allowedRoles = [],
  ownerOnly = false,
  userId = ''
}: { 
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  ownerOnly?: boolean;
  userId?: string;
}) => {
  const { isAuthenticated, isLoading, user, hasRole, isOwner } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check if route has role restrictions and if user has required role
  if (allowedRoles.length > 0 && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check if route is owner-only and if user is the owner
  if (ownerOnly && userId && !isOwner(userId)) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};

// Public Only Route Component
const PublicOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background">
              <Header />
              <main>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/courses" element={<CourseCatalog />} />
                  <Route path="/courses/:id" element={<CourseDetails />} />
                  
                  {/* Auth Routes */}
                  <Route path="/login" element={
                    <PublicOnlyRoute>
                      <LoginPage />
                    </PublicOnlyRoute>
                  } />
                  <Route path="/register" element={
                    <PublicOnlyRoute>
                      <RegisterPage />
                    </PublicOnlyRoute>
                  } />
                  
                  {/* Protected Routes */}
                  <Route path="/:userId/dashboard" element={
                    <ProtectedRoute 
                      allowedRoles={['student']}
                      ownerOnly={true}
                      userId={useParams().userId}
                    >
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="/:userId/my-courses" element={
                    <ProtectedRoute 
                      allowedRoles={['student']}
                      ownerOnly={true}
                      userId={useParams().userId}
                    >
                      <MyCoursesPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </BrowserRouter>
          
          {/* Toast notifications */}
          <Toaster />
          <Sonner />
          <HotToast 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
              },
            }}
          />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
