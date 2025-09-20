import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardMedia, 
  CircularProgress, 
  Container, 
  Grid, 
  LinearProgress, 
  Tab, 
  Tabs, 
  Typography, 
  useTheme,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  Divider,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  FilterList as FilterListIcon, 
  Sort as SortIcon, 
  PlayArrow as PlayArrowIcon,
  CheckCircle as CheckCircleIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { coursesApi, Course } from '@/services/api';

// Course interface is now imported from the API service

const MyCoursesPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  
  // Initialize filteredCourses when courses change
  useEffect(() => {
    if (Array.isArray(courses)) {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses([]);
    }
  }, [courses]);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  // Check if the current user is authorized to view this page
  useEffect(() => {
    if (user && userId !== user.id) {
      navigate('/unauthorized', { replace: true });
    }
  }, [userId, user, navigate]);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch enrolled courses from the API
        const response = await coursesApi.getEnrolledCourses(userId);
        
        // The API response is already in the correct format
        setCourses(response.data);
        setFilteredCourses(response.data);
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setError('Failed to load your courses. Please try again later.');
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, [userId]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setActiveTab(newValue);
  };

  const handleSortClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  const handleSortSelect = (value: string) => {
    setSortBy(value);
    handleSortClose();
  };

  const handleCourseClick = (courseId: string) => {
    navigate(`/${userId}/courses/${courseId}/learn`);
  };

  const handleDownloadCertificate = async (courseId: string, courseTitle: string) => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const blob = await coursesApi.downloadCertificate(userId, courseId);
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Certificate-${courseTitle.replace(/\s+/g, '-')}.pdf`);
      
      // Append to the document, trigger download, and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Revoke the blob URL
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error downloading certificate:', error);
      setError('Failed to download certificate. Please try again later.');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort courses based on active tab and sort criteria
  useEffect(() => {
    if (!Array.isArray(courses) || !courses.length) {
      setFilteredCourses([]);
      return;
    }
    
    try {
      let filtered = [...courses];
      
      // Filter by tab
      if (activeTab === 'in-progress') {
        filtered = filtered.filter(course => course.progress > 0 && course.progress < 100);
      } else if (activeTab === 'completed') {
        filtered = filtered.filter(course => course.progress === 100);
      } else if (activeTab === 'not-started') {
        filtered = filtered.filter(course => course.progress === 0);
      }
      
      // Sort courses
      filtered.sort((a, b) => {
        if (sortBy === 'recent') {
          return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
        } else if (sortBy === 'progress-desc') {
          return b.progress - a.progress;
        } else if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        } else if (sortBy === 'enrollment-date') {
          return new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime();
        }
        return 0;
      });
      
      setFilteredCourses(filtered);
    } catch (error) {
      console.error('Error filtering/sorting courses:', error);
      setFilteredCourses([]);
    }
  }, [activeTab, sortBy, courses]);

  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'error';
    if (progress < 70) return 'warning';
    return 'success';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleCertificateClick = (e: React.MouseEvent, courseId: string, courseTitle: string) => {
    e.stopPropagation();
    handleDownloadCertificate(courseId, courseTitle);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, color: 'text.primary' }}>
      {/* Error Snackbar */}
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="error" 
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: 'text.primary' }}>
          My Courses
        </Typography>
        <Box>
          <Button 
            variant="outlined"
            onClick={handleSortClick}
            color="primary"
            aria-label="sort courses"
            startIcon={<SortIcon />}
            sx={{ 
              mr: 1,
              color: 'text.primary',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              '&:hover': {
                backgroundColor: 'action.hover',
                borderColor: 'primary.main'
              }
            }}
          >
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
              {sortBy === 'recent' && 'Recently Accessed'}
              {sortBy === 'progress-desc' && 'Progress (High to Low)'}
              {sortBy === 'alphabetical' && 'Alphabetical'}
              {sortBy === 'enrollment-date' && 'Enrollment Date'}
            </Typography>
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleSortClose}
          >
            <MenuItem onClick={() => handleSortSelect('recent')}>
              Recently Accessed
            </MenuItem>
            <MenuItem onClick={() => handleSortSelect('progress-desc')}>
              Progress (High to Low)
            </MenuItem>
            <MenuItem onClick={() => handleSortSelect('alphabetical')}>
              Alphabetical
            </MenuItem>
            <MenuItem onClick={() => handleSortSelect('enrollment-date')}>
              Enrollment Date
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ 
          mb: 4, 
          borderBottom: 1, 
          borderColor: 'divider',
          '& .MuiTab-root': {
            color: 'text.secondary',
            opacity: 0.8,
            transition: 'all 0.2s',
            '&:hover': {
              opacity: 1,
              color: 'primary.main'
            },
            '&.Mui-selected': {
              color: 'primary.main',
              opacity: 1,
              fontWeight: 500
            }
          }
        }}
      >
        <Tab 
          label="All Courses" 
          value="all" 
          sx={{ textTransform: 'none', minWidth: 'auto', px: 2 }}
        />
        <Tab 
          label="In Progress" 
          value="in-progress" 
          sx={{ textTransform: 'none', minWidth: 'auto', px: 2 }}
        />
        <Tab 
          label="Completed" 
          value="completed" 
          sx={{ textTransform: 'none', minWidth: 'auto', px: 2 }}
        />
        <Tab 
          label="Not Started" 
          value="not-started" 
          sx={{ textTransform: 'none', minWidth: 'auto', px: 2 }}
        />
      </Tabs>

      {!Array.isArray(filteredCourses) || filteredCourses.length === 0 ? (
        <Box 
          display="flex" 
          flexDirection="column" 
          alignItems="center" 
          justifyContent="center" 
          minHeight="40vh"
          textAlign="center"
          p={3}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {activeTab === 'all' 
              ? 'You are not enrolled in any courses yet.'
              : `No ${activeTab.replace('-', ' ')} courses found.`}
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => navigate('/courses')}
            sx={{ 
              mt: 2,
              color: 'primary.contrastText',
              '&:hover': {
                backgroundColor: 'primary.dark'
              }
            }}
          >
            Browse Courses
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredCourses.map((course) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
              <Card 
                key={course.id}
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  backgroundColor: 'background.paper',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6
                  },
                  '& .MuiCardContent-root': {
                    color: 'text.primary',
                    '& .MuiTypography-root': {
                      color: 'text.primary'
                    }
                  }
                }}
                onClick={() => handleCourseClick(course.id)}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={course.thumbnail}
                  alt={course.title}
                />
                <CardContent sx={{ flexGrow: 1, p: 2, color: 'text.primary' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                    <Typography 
                      variant="h6" 
                      component="h3"
                      sx={{
                        fontWeight: 600,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        minHeight: '64px',
                        mb: 1.5,
                        color: 'text.primary'
                      }}
                    >
                      {course.title}
                    </Typography>
                    {course.progress === 100 && (
                      <CheckCircleIcon color="success" />
                    )}
                  </Box>
                  
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    gutterBottom
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '40px',
                      mb: 1.5
                    }}
                  >
                    {course.instructor.name}
                  </Typography>
                  
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" color="text.secondary" component="p">
                        {course.instructor.name}
                      </Typography>
                      <Typography variant="caption" fontWeight={500}>
                        {course.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={course.progress} 
                      color={getProgressColor(course.progress)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                      {course.completedLessons} of {course.totalLessons} lessons completed
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt="auto">
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'text.primary'
                        }
                      }}
                    >
                      Last accessed: {formatDate(course.lastAccessed)}
                    </Typography>
                    {course.progress === 100 ? (
                      <Button 
                        size="small" 
                        color="primary"
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownloadCertificate(course.id, course.title);
                        }}
                        sx={{ 
                          ml: 1,
                          color: 'primary.main',
                          borderColor: 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.dark',
                            backgroundColor: 'action.hover'
                          }
                        }}
                      >
                        Certificate
                      </Button>
                    ) : (
                      <Button 
                        size="small" 
                        variant="contained" 
                        color="primary"
                        startIcon={<PlayArrowIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCourseClick(course.id);
                        }}
                      >
                        {course.progress > 0 ? 'Continue' : 'Start'}
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default MyCoursesPage;
