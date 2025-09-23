import api from './api';

export interface EnrollResponse {
  success: boolean;
  message: string;
  data?: {
    enrollmentId: string;
    courseId: string;
    userId: string;
    status: 'active' | 'pending' | 'completed' | 'cancelled';
    enrolledAt: string;
  };
}

export const enrollmentApi = {
  /**
   * Enroll in a free course
   * @param courseId - The ID of the course to enroll in
   */
  enrollInCourse: async (courseId: string): Promise<EnrollResponse> => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);
      return {
        success: true,
        message: 'Successfully enrolled in the course',
        data: response.data.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to enroll in the course'
      };
    }
  },

  /**
   * Initialize payment for a paid course
   * @param courseId - The ID of the course to pay for
   */
  initializePayment: async (courseId: string): Promise<{ 
    success: boolean; 
    data?: { 
      authorizationUrl: string;
      accessCode: string;
      reference: string;
    }; 
    message: string;
    error?: any;
  }> => {
    try {
      const response = await api.post('/payments', { 
        courseId,
        paymentMethod: 'card', // Default to card, can be made dynamic if needed
        phoneNumber: '' // Add if required for mobile money
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error?.message || 'Failed to initialize payment');
      }
      
      return {
        success: true,
        data: {
          authorizationUrl: response.data.data.authorizationUrl || response.data.data.paymentUrl,
          accessCode: response.data.data.accessCode || '',
          reference: response.data.data.reference
        },
        message: 'Payment initialized successfully'
      };
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      return {
        success: false,
        message: error.response?.data?.error?.message || error.message || 'Failed to initialize payment',
        error: error.response?.data?.error || error
      };
    }
  },

  /**
   * Verify payment status
   * @param reference - Payment reference from Paystack
   */
  verifyPayment: async (reference: string): Promise<{ 
    success: boolean; 
    data?: { 
      status: 'success' | 'failed' | 'pending';
      enrollment?: any;
      reference?: string;
    }; 
    message: string;
    error?: any;
  }> => {
    try {
      const response = await api.get(`/payments/verify?reference=${reference}`);
      return {
        success: true,
        data: {
          status: response.data.data?.status || 'pending',
          enrollment: response.data.data?.enrollment,
          reference: response.data.data?.reference
        },
        message: response.data.message || 'Payment verification successful'
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to verify payment',
        error: error.response?.data?.error || error.message
      };
    }
  },

  /**
   * Check if user is enrolled in a course
   * @param courseId - The ID of the course to check
   */
  checkEnrollment: async (courseId: string): Promise<{
    isEnrolled: boolean;
    enrollment?: any;
  }> => {
    try {
      // Use the payment verification endpoint to check enrollment
      const response = await api.get(`/payments/verify?courseId=${courseId}`);
      
      return {
        isEnrolled: response.data.data?.status === 'success',
        enrollment: response.data.data?.enrollment || null
      };
    } catch (error) {
      console.error('Error checking enrollment status:', error);
      // If there's an error, assume not enrolled
      return { isEnrolled: false };
    }
  }
};

export default enrollmentApi;
