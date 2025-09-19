import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Menu, X, User, Settings, LogOut, BookOpen, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.header 
      className="sticky top-0 left-0 right-0 z-50 w-full backdrop-blur-xl bg-bg-primary/80 border-b border-border-primary"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        WebkitBackdropFilter: 'blur(12px)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 w-full">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse-glow" />
            </div>
            <span className="text-headline font-bold gradient-text">LearnHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              to="/courses" 
              className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
            >
              Courses
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
            >
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-bg-secondary transition-colors"
                  >
                    {user.avatarUrl ? (
                      <img 
                        src={user.avatarUrl} 
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                    <span className="text-caption font-medium text-text-primary">
                      {user.name}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-12 w-56 glass-card py-2 shadow-xl z-50"
                      >
                        <div className="px-4 py-3 border-b border-border-primary">
                          <p className="text-caption font-medium text-text-primary">{user.name}</p>
                          <p className="text-small text-text-muted">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-md capitalize">
                            {user.role}
                          </span>
                        </div>
                        
                        <div className="py-1">
                          <Link 
                            to="/dashboard" 
                            className="flex items-center gap-3 px-4 py-2 text-caption text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <BarChart3 size={16} />
                            Dashboard
                          </Link>
                          <Link 
                            to="/my-courses" 
                            className="flex items-center gap-3 px-4 py-2 text-caption text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <BookOpen size={16} />
                            My Courses
                          </Link>
                          <Link 
                            to="/settings" 
                            className="flex items-center gap-3 px-4 py-2 text-caption text-text-secondary hover:text-text-primary hover:bg-bg-secondary transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings size={16} />
                            Settings
                          </Link>
                        </div>
                        
                        <div className="border-t border-border-primary pt-1">
                          <button 
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-caption text-error hover:bg-bg-secondary transition-colors"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost hidden sm:inline-flex">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary hidden sm:inline-flex">
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button - Always visible on mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-text-secondary hover:text-text-primary hover:bg-bg-secondary rounded-lg transition-colors relative z-50"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
              animate={{ 
                opacity: 1, 
                height: 'auto',
                transitionEnd: { overflow: 'visible' }
              }}
              exit={{ 
                opacity: 0, 
                height: 0,
                overflow: 'hidden'
              }}
              transition={{ duration: 0.3 }}
              className="md:hidden py-4 border-t border-border-primary w-full"
            >
              <div className="flex flex-col gap-2">
                <Link 
                  to="/courses" 
                  className={`nav-link ${isActive('/courses') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link 
                  to="/about" 
                  className={`nav-link ${isActive('/about') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className={`nav-link ${isActive('/contact') ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border-primary">
                    <Link 
                      to="/login" 
                      className="btn-ghost w-full text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link 
                      to="/register" 
                      className="btn-primary w-full text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};