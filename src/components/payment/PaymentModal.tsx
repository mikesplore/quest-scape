import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle: string;
  price: number;
  onPaymentSuccess: (enrollment: any) => void;
  onPaymentError: (error: string) => void;
  initializePayment: () => Promise<{ 
    data: { 
      authorization_url: string;
      reference: string;
      paymentId?: string;
    } | null 
  } | null>;
  verifyPayment: (reference: string) => Promise<{ 
    status: string; 
    enrollment: any;
    message?: string;
  } | null>;
}

type PaymentStatus = 'idle' | 'processing' | 'redirecting' | 'verifying' | 'success' | 'error';

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  courseTitle,
  price,
  onPaymentSuccess,
  onPaymentError,
  initializePayment,
  verifyPayment,
}) => {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [paymentWindow, setPaymentWindow] = useState<Window | null>(null);
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Reset modal state
  const resetModal = useCallback(() => {
    setStatus('idle');
    setErrorMessage('');
    setPaymentReference('');
    setRetryCount(0);
    
    // Close payment window if still open
    if (paymentWindow && !paymentWindow.closed) {
      try {
        paymentWindow.close();
      } catch (error) {
        console.warn('Error closing payment window:', error);
      }
    }
    
    onClose();
  }, [paymentWindow, onClose]);

  // Verify payment status with retry logic
  const verifyPaymentStatus = useCallback(async (reference = paymentReference) => {
    if (!reference) {
      console.error('No payment reference provided');
      return;
    }
    
    setStatus('verifying');
    
    try {
      const result = await verifyPayment(reference);
      
      if (result?.status === 'success') {
        setStatus('success');
        toast.success('Payment successful!', {
          description: `You've successfully enrolled in ${courseTitle}`,
        });
        
        // Wait a moment before closing to show success state
        setTimeout(() => {
          onPaymentSuccess(result.enrollment || {});
          resetModal();
        }, 2000);
      } else if (result?.status === 'pending') {
        // If payment is still pending, retry after a delay
        if (retryCount < MAX_RETRIES) {
          setRetryCount(prev => prev + 1);
          setTimeout(() => verifyPaymentStatus(reference), 3000); // Retry after 3 seconds
        } else {
          throw new Error('Payment is still processing. Please check back later.');
        }
      } else {
        throw new Error(result?.message || 'Payment verification failed');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setStatus('error');
      
      // More specific error handling
      let errorMsg = 'Failed to verify payment. ';
      
      if (error.response?.status === 401) {
        errorMsg += 'Session expired. Please log in again.';
        // Clear auth data and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?returnUrl=${returnUrl}`;
        return;
      } else if (error.response?.status === 404) {
        errorMsg = 'Payment reference not found. Please contact support with your reference number.';
      } else if (error.message) {
        errorMsg = error.message;
      } else {
        errorMsg += 'Please check your payment status or contact support.';
      }
      
      setErrorMessage(errorMsg);
      onPaymentError(errorMsg);
      
      toast.error('Payment Verification Failed', {
        description: errorMsg,
      });
    }
  }, [paymentReference, retryCount, verifyPayment, onPaymentSuccess, resetModal, courseTitle, onPaymentError]);

  // Clean up payment window on unmount
  useEffect(() => {
    return () => {
      if (paymentWindow && !paymentWindow.closed) {
        try {
          paymentWindow.close();
        } catch (error) {
          console.warn('Error closing payment window:', error);
        }
      }
    };
  }, [paymentWindow]);

  // Handle payment initialization
  const handlePayment = async () => {
    setStatus('processing');
    setErrorMessage('');
    setRetryCount(0);

    try {
      // Check if user is authenticated by checking for token
      const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!token || !refreshToken) {
        // If not authenticated, redirect to login with return URL
        const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
        window.location.href = `/login?returnUrl=${returnUrl}`;
        return;
      }

      const result = await initializePayment();
      if (!result?.data?.authorization_url) {
        throw new Error('Failed to initialize payment. Please try again.');
      }

      setPaymentReference(result.data.reference);
      setStatus('redirecting');
      
      // Open payment page in a new window
      const width = 600;
      const height = 700;
      const left = Math.floor((window.screen.width - width) / 2);
      const top = Math.floor((window.screen.height - height) / 2);
      
      const newPaymentWindow = window.open(
        result.data.authorization_url,
        'paymentWindow',
        `width=${width},height=${height},top=${top},left=${left}`
      );
      
      if (!newPaymentWindow) {
        throw new Error('Please allow popups for this website to proceed with payment');
      }
      
      setPaymentWindow(newPaymentWindow);
      
      // Check payment status periodically
      const checkPaymentStatus = setInterval(async () => {
        try {
          if (newPaymentWindow.closed) {
            clearInterval(checkPaymentStatus);
            await verifyPaymentStatus(result.data.reference);
          }
        } catch (error) {
          console.error('Error checking payment status:', error);
          clearInterval(checkPaymentStatus);
          setStatus('error');
          const errorMsg = error instanceof Error ? error.message : 'Failed to verify payment';
          setErrorMessage(`Payment verification failed: ${errorMsg}`);
          toast.error('Payment verification failed', {
            description: errorMsg,
          });
        }
      }, 2000); // Check every 2 seconds
      
      // Auto-close the check after 10 minutes (600,000 ms)
      const timeoutId = setTimeout(() => {
        clearInterval(checkPaymentStatus);
        if (status === 'redirecting') {
          setStatus('error');
          setErrorMessage('Payment verification timed out. Please check your payment status or contact support.');
          toast.warning('Payment verification timed out', {
            description: 'Please check your payment status or contact support if you have any issues.',
          });
        }
      }, 600000);
      
      return () => {
        clearInterval(checkPaymentStatus);
        clearTimeout(timeoutId);
        clearTimeout(timeoutId);
      };
    } catch (error: any) {
      console.error('Payment error:', error);
      setStatus('error');
      const errorMessage = error.response?.data?.error?.message || 
                         error.response?.data?.message || 
                         error.message || 
                         'Failed to process payment';
      setErrorMessage(errorMessage);
      onPaymentError(errorMessage);
    }
  };


  // Close payment window when component unmounts or when modal is closed
  useEffect(() => {
    if (!isOpen && paymentWindow && !paymentWindow.closed) {
      try {
        paymentWindow.close();
      } catch (error) {
        console.warn('Error closing payment window on unmount:', error);
      }
    }
    
    return () => {
      if (paymentWindow && !paymentWindow.closed) {
        try {
          paymentWindow.close();
        } catch (error) {
          console.warn('Error closing payment window on cleanup:', error);
        }
      }
    };
  }, [paymentWindow, isOpen]);
  
  // Handle payment verification when reference changes
  useEffect(() => {
    if (paymentReference && isOpen) {
      verifyPaymentStatus();
    }
  }, [paymentReference, isOpen, verifyPaymentStatus]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && resetModal()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">
            {status === 'success' ? 'Payment Successful!' : 'Complete Your Enrollment'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {status === 'success' 
              ? `You've successfully enrolled in ${courseTitle}`
              : status === 'error'
                ? 'There was an issue with your payment'
                : `You're about to enroll in ${courseTitle} for Ksh.${price.toFixed(2)}`}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {(status === 'idle' || status === 'processing') && (
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">Course:</span>
                  <span>{courseTitle}</span>
                </div>
                <div className="flex justify-between items-center font-bold">
                  <span>Total:</span>
                  <span className="text-lg">Ksh.{price.toFixed(2)}</span>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground space-y-2">
                {status === 'error' && errorMessage && (
                  <div className="bg-destructive/10 text-destructive dark:text-red-400 p-3 rounded-md flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                
                {status === 'verifying' && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 p-3 rounded-md flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Verifying your payment, please wait...</span>
                  </div>
                )}
                
                <p>You'll be redirected to a secure payment page to complete your purchase.</p>
                <p className="text-xs opacity-75">By completing your purchase, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
              
              <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={resetModal} disabled={status !== 'idle'}>
                  Cancel
                </Button>
                <Button 
                  onClick={handlePayment} 
                  disabled={status === 'processing' || status === 'verifying' || status === 'redirecting'}
                  className="min-w-[150px]"
                >
                  {status === 'processing' || status === 'verifying' ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {status === 'processing' ? 'Processing...' : 'Verifying...'}
                    </>
                  ) : status === 'error' ? (
                    'Try Again'
                  ) : (
                    <>
                      Pay Ksh.{price.toFixed(2)}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {status === 'redirecting' && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Redirecting to Payment</h3>
              <p className="text-muted-foreground">Please complete your payment in the new window.</p>
              <p className="text-sm text-muted-foreground mt-2">
                If you're not redirected automatically, please check for a popup or allow popups for this site.
              </p>
            </div>
          )}

          {status === 'verifying' && (
            <div className="text-center py-8">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Verifying Payment</h3>
              <p className="text-muted-foreground">Please wait while we verify your payment.</p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Payment Successful!</h3>
              <p className="text-muted-foreground mb-6">You've successfully enrolled in {courseTitle}.</p>
              <Button onClick={resetModal}>
                Start Learning
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-red-600 mb-2">Payment Failed</h3>
              <p className="text-muted-foreground mb-2">{errorMessage || 'An error occurred during payment.'}</p>
              <p className="text-sm text-muted-foreground mb-6">
                Please try again or contact support if the problem persists.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={resetModal}>
                  Close
                </Button>
                <Button onClick={handlePayment}>
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
