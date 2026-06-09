import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Card, CardBody } from '../../../components/ui/Card';
import { useAuth } from '../../../contexts/AuthContext';

export const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, forgotPassword, resendOTP } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const email = location.state?.email || sessionStorage.getItem('registrationEmail') || sessionStorage.getItem('resetEmail') || '';
  const isRegistration = location.state?.isRegistration || false;

  useEffect(() => {
    if (!email) {
      if (isRegistration) {
        navigate('/select-role');
      } else {
        navigate('/forgot-password');
      }
    }
  }, [email, navigate, isRegistration]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter a complete 6-digit OTP');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await verifyOTP({ email, otp: otpString, isRegistration });
      
      if (isRegistration) {
        // For registration, show success page
        navigate('/registration-success');
      } else {
        // For password reset, go to reset password page
        navigate('/reset-password', { state: { email, otp: otpString } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid OTP');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (isRegistration) {
        await resendOTP(email);
        setResendTimer(60);
        setError('');
      } else {
        await forgotPassword({ email });
        setResendTimer(60);
        setError('');
      }
    } catch (err) {
      setError('Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 w-full">
      <Card className="w-full max-w-md">
        <CardBody className="p-8">
          <Link 
            to={isRegistration ? "/select-role" : "/forgot-password"} 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>

          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {isRegistration ? 'Verify Your Email' : 'Verify OTP'}
            </h1>
            <p className="text-muted-foreground">
              {isRegistration 
                ? 'We\'ve sent a verification code to your email address'
                : 'We\'ve sent a 6-digit code to'
              }
            </p>
            <p className="text-primary font-medium mt-1 break-all">{email}</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-3 flex-wrap">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-border rounded-lg focus:border-primary focus:ring-2 focus:ring-primary focus:outline-none transition-all bg-background text-foreground"
                  autoFocus={index === 0}
                />
              ))}
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              {isRegistration ? 'Verify & Complete Registration' : 'Verify OTP'}
            </Button>

            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend OTP in <span className="font-medium text-primary">{resendTimer}s</span>
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm font-medium text-primary hover:text-primary/80"
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};