export type UserRole = 'user' | 'manager' | 'doctor' | 'patient';

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  role: UserRole;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  mobile: string;
  role: UserRole;
  acceptedTerms: boolean;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface OTPVerificationData {
  email: string;
  otp: string;
  isRegistration?: boolean;
}

export interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (data: ForgotPasswordData) => Promise<void>;
  resendOTP: (email: string) => Promise<void>;
  verifyOTP: (data: OTPVerificationData) => Promise<boolean>;
  resetPassword: (data: ResetPasswordData) => Promise<void>;
  setUser: (user: User | null) => void;
}
