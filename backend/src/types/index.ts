import { Request } from 'express';

export interface IUser {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  mobile: string;
  role: UserRole;
  password: string;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  isActive: boolean;
  lastLogin?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  age?: number;
  skinType?: string;
  allergies?: string[];
  medicalHistory?: string;
}

export type UserRole = 'doctor' | 'patient' | 'manager' | 'user'; 

export interface IOTP {
  _id?: string;
  email: string;
  mobile?: string;
  otp: string;
  type: OTPType;
  expiresAt: Date;
  isUsed: boolean;
  attempts: number;
  createdAt?: Date;
}

export type OTPType = 'email_verification' | 'password_reset' | 'mobile_verification' | 'login';

export interface IAuthRequest extends Request {
  user?: IUser;
}

export interface ILoginData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface IRegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  mobile: string;
  role: UserRole;
  acceptedTerms: boolean;
}

export interface IForgotPasswordData {
  email: string;
}

export interface IOTPVerificationData {
  email: string;
  otp: string;
  type?: OTPType;
}

export interface IResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUpdateProfileData {
  firstName?: string;
  lastName?: string;
  mobile?: string;
  age?: number;
  skinType?: string;
  allergies?: string[];
  medicalHistory?: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: Partial<IUser>;
    accessToken: string;
    refreshToken?: string;
  };
}

export interface IOTPResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
    expiresAt: Date;
  };
}

export interface IApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface IPaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface IUserQuery extends IPaginationQuery {
  role?: UserRole;
  isActive?: boolean;
  search?: string;
}

export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface IOTPEmailData {
  otp: string;
  expiresIn: string;
  type: string;
}

export interface IRateLimitConfig {
  windowMs: number;
  max: number;
  message: string;
  standardHeaders: boolean;
  legacyHeaders: boolean;
}

export interface IError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}
