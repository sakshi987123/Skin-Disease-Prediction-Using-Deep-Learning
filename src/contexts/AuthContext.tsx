import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User, 
  LoginData, 
  RegisterData, 
  AuthContextType,
  ForgotPasswordData,
  OTPVerificationData,
  ResetPasswordData
} from '../types/auth.types';
import { apiService } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Must be called at top level - cannot be inside try/catch (Rules of Hooks)
  const { showSuccess, showError, showWarning } = useToast();

  useEffect(() => {
    // Check if user is authenticated and restore user data
    const checkAuth = async () => {
      try {
        // First, try to get user from localStorage
        const storedUser = apiService.getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
          setIsLoading(false);
          return;
        }

        // If no stored user but we have tokens, try to get profile
        if (apiService.isAuthenticated()) {
          try {
            const profileData = await apiService.getProfile();
            setUser(profileData.user);
            apiService.setCurrentUser(profileData.user);
          } catch (error) {
            // If profile fetch fails, try to refresh token
            try {
              await apiService.refreshToken();
              const profileData = await apiService.getProfile();
              setUser(profileData.user);
              apiService.setCurrentUser(profileData.user);
            } catch (refreshError) {
              // If refresh also fails, clear everything
              throw refreshError;
            }
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Clear invalid tokens and user data
        apiService.clearCurrentUser();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (data: LoginData): Promise<void> => {
    try {
      const response = await apiService.login(data.email, data.password);
      
      setUser(response.user);
      apiService.setCurrentUser(response.user);
      
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }
      
      showSuccess('Login Successful', `Welcome back, ${response.user.firstName}!`);
    } catch (error: any) {
      showError('Login Failed', error.message || 'Please check your credentials and try again.');
      throw new Error(error.message || 'Login failed. Please check your credentials.');
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      if (data.password !== data.confirmPassword) {
        showError('Registration Failed', 'Passwords do not match');
        throw new Error('Passwords do not match');
      }

      if (!data.acceptedTerms) {
        showError('Registration Failed', 'You must accept the terms and conditions');
        throw new Error('You must accept the terms and conditions');
      }

      const response = await apiService.register({
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        mobile: data.mobile,
        role: data.role,
        acceptedTerms: data.acceptedTerms,
      });
      
      // Don't set user as logged in - they need to verify OTP first
      // Store email for OTP verification
      sessionStorage.setItem('registrationEmail', data.email);
      sessionStorage.setItem('userData', JSON.stringify(response.user));
      
      showSuccess('Registration Successful', 'Please check your email for verification code');
    } catch (error: any) {
      showError('Registration Failed', error.message || 'Please try again.');
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
      showSuccess('Logged Out', 'You have been successfully logged out');
    } catch (error) {
      console.error('Logout error:', error);
      showWarning('Logout Warning', 'There was an issue logging out, but you have been signed out locally');
    } finally {
      setUser(null);
      apiService.clearCurrentUser();
      localStorage.removeItem('rememberMe');
    }
  };

  const forgotPassword = async (data: ForgotPasswordData): Promise<void> => {
    try {
      await apiService.forgotPassword(data.email);
      
      // Store email temporarily for OTP verification
      sessionStorage.setItem('resetEmail', data.email);
      showSuccess('OTP Sent', 'Password reset code has been sent to your email');
    } catch (error: any) {
      showError('Failed to Send OTP', error.message || 'Please try again.');
      throw new Error(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const resendOTP = async (email: string): Promise<void> => {
    try {
      const response = await apiService.resendOTP(email);
      const devHint = response.devOtp ? ` (Dev OTP: ${response.devOtp})` : '';
      showSuccess('OTP Sent', `A new verification code has been sent.${devHint}`);
    } catch (error: any) {
      showError('Failed to Send OTP', error.message || 'Please try again.');
      throw new Error(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const verifyOTP = async (data: OTPVerificationData): Promise<boolean> => {
    try {
      // Determine OTP type based on context
      const type = data.isRegistration ? 'email_verification' : 'password_reset';
      const responseData = await apiService.verifyOTP(data.email, data.otp, type);
      
      if (data.isRegistration && responseData && responseData.user) {
        setUser(responseData.user);
      }
      
      if (data.isRegistration) {
        showSuccess('Email Verified', 'Your email has been successfully verified');
      } else {
        showSuccess('OTP Verified', 'You can now reset your password');
      }
      return true;
    } catch (error: any) {
      showError('Invalid OTP', error.message || 'Please check the code and try again.');
      throw new Error(error.message || 'Invalid OTP. Please try again.');
    }
  };

  const resetPassword = async (data: ResetPasswordData): Promise<void> => {
    try {
      if (data.newPassword !== data.confirmPassword) {
        showError('Password Mismatch', 'Passwords do not match');
        throw new Error('Passwords do not match');
      }

      await apiService.resetPassword(data.email, data.otp, data.newPassword, data.confirmPassword);
      
      // Clear the stored email
      sessionStorage.removeItem('resetEmail');
      showSuccess('Password Reset', 'Your password has been successfully reset');
    } catch (error: any) {
      showError('Password Reset Failed', error.message || 'Please try again.');
      throw new Error(error.message || 'Password reset failed. Please try again.');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    forgotPassword,
    resendOTP,
    verifyOTP,
    resetPassword,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
