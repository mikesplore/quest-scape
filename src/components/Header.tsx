import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut, 
  BookOpen, 
  ChevronDown,
  LayoutDashboard,
  Bookmark,
  Award
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;
  
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };
  
  const navLinkClasses = (path: string) => 
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive(path) ? 'text-primary' : 'text-foreground/80'
    }`;
    
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

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
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/courses" 
              className={navLinkClasses('/courses')}
              onClick={closeMobileMenu}
            >
              Courses
            </Link>
            <Link 
              to="/about" 
              className={navLinkClasses('/about')}
              onClick={closeMobileMenu}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className={navLinkClasses('/contact')}
              onClick={closeMobileMenu}
            >
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-auto px-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getUserInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.name}</span>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem asChild>
                        <Link to={`/${user?.id}/dashboard`} className="w-full cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/${user?.id}/my-courses`} className="w-full cursor-pointer">
                          <BookOpen className="mr-2 h-4 w-4" />
                          <span>My Courses</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/bookmarks" className="w-full cursor-pointer">
                          <Bookmark className="mr-2 h-4 w-4" />
                          <span>Bookmarks</span>
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="w-full cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer text-destructive focus:text-destructive"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-3">
                  <Button variant="ghost" asChild>
                    <Link to="/login">Sign in</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/register">Sign up</Link>
                  </Button>
                </div>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
                  className={navLinkClasses('/courses')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Courses
                </Link>
                <Link 
                  to="/about" 
                  className={navLinkClasses('/about')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  to="/contact" 
                  className={navLinkClasses('/contact')}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LayoutDashboard size={16} />
                      Dashboard
                    </Link>
                    <Link 
                      to="/my-courses" 
                      className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <BookOpen size={16} />
                      My Courses
                    </Link>
                    <Link 
                      to="/settings" 
                      className="flex items-center gap-2 px-4 py-2 text-sm rounded-md hover:bg-accent"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm rounded-md text-destructive hover:bg-destructive/10"
                    >
                      <LogOut size={16} />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
                    <Button variant="outline" asChild>
                      <Link 
                        to="/login" 
                        className="w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link 
                        to="/register" 
                        className="w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </Button>
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