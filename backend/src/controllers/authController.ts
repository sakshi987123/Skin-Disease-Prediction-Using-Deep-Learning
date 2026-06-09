import { Request, Response } from 'express';
import { User } from '../models/User';
import { OTP } from '../models/OTP';
import { JWTUtils } from '../utils/jwt';
import { OTPUtils } from '../utils/otp';
import { emailService } from '../utils/email';
import { IAuthRequest, ILoginData, IRegisterData, IForgotPasswordData, IOTPVerificationData, IResetPasswordData, IChangePasswordData, IUpdateProfileData } from '../types';
import { config } from '../config/config';

export class AuthController {
  /**
   * Register a new user
   */
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        mobile,
        role,
        acceptedTerms
      }: IRegisterData = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User already exists with this email'
        });
        return;
      }

      // Create new user
      const user = await User.create({
        email,
        password,
        firstName,
        lastName,
        mobile,
        role,
        isEmailVerified: false,
        isMobileVerified: false,
        isActive: true
      });

      // Generate OTP for email verification
      const otp = await OTPUtils.createOTP(email, 'email_verification');
      console.log(`🔐 Generated OTP for ${email}: ${otp}`);

      // Send verification email
      try {
        await emailService.sendOTPEmail(email, {
          otp,
          expiresIn: OTPUtils.formatExpiryTime(),
          type: 'email_verification'
        });
        console.log(`📧 OTP email sent to ${email}`);
      } catch (emailError) {
        console.error('📧 Email sending failed:', emailError);
        // Don't fail registration if email fails, just log it
      }

      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please verify your email.',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          ...(config.NODE_ENV === 'development' && { devOtp: otp })
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed'
      });
    }
  }

  /**
   * Login user
   */
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, rememberMe }: ILoginData = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select('+password');
      
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Check if account is active
      if (!user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Account is deactivated'
        });
        return;
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate tokens
      const tokens = JWTUtils.generateTokenPair(user);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isMobileVerified: user.isMobileVerified
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }

  /**
   * Forgot password
   */
  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email }: IForgotPasswordData = req.body;

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Check rate limit
      const canSendOTP = await OTPUtils.checkRateLimit(email, 'password_reset');
      if (!canSendOTP) {
        res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.'
        });
        return;
      }

      // Generate OTP
      const otp = await OTPUtils.createOTP(email, 'password_reset');

      // Send OTP email
      await emailService.sendOTPEmail(email, {
        otp,
        expiresIn: OTPUtils.formatExpiryTime(),
        type: 'password_reset'
      });

      res.json({
        success: true,
        message: 'OTP sent to your email address',
        data: {
          email,
          expiresAt: OTPUtils.getOTPExpiryTime()
        }
      });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }
  }

  /**
   * Resend email verification OTP (registration)
   */
  static async resendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      if (user.isEmailVerified) {
        res.status(400).json({
          success: false,
          message: 'Email is already verified'
        });
        return;
      }

      const canSendOTP = await OTPUtils.checkRateLimit(email, 'email_verification');
      if (!canSendOTP) {
        res.status(429).json({
          success: false,
          message: 'Too many requests. Please try again later.'
        });
        return;
      }

      const otp = await OTPUtils.createOTP(email, 'email_verification');
      console.log(`🔐 Resent OTP for ${email}: ${otp}`);

      try {
        await emailService.sendOTPEmail(email, {
          otp,
          expiresIn: OTPUtils.formatExpiryTime(),
          type: 'email_verification'
        });
      } catch (emailError) {
        console.error('📧 Email sending failed:', emailError);
      }

      res.json({
        success: true,
        message: 'OTP sent to your email address',
        data: {
          email,
          expiresAt: OTPUtils.getOTPExpiryTime(),
          ...(config.NODE_ENV === 'development' && { devOtp: otp })
        }
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP'
      });
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, type = 'email_verification' }: IOTPVerificationData = req.body;
      console.log(`🔍 Verifying OTP for ${email}: ${otp} (type: ${type})`);

      // Verify OTP
      const isValid = await OTPUtils.verifyOTP(email, otp, type);
      console.log(`✅ OTP verification result: ${isValid}`);
      
      if (!isValid) {
        res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP'
        });
        return;
      }

      // Update user email verification status
      const user = await User.findOneAndUpdate(
        { email },
        { isEmailVerified: true },
        { new: true }
      );

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Generate tokens if registration verification
      let data: any = {};
      if (type === 'email_verification') {
        const tokens = JWTUtils.generateTokenPair(user);
        data = {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            isMobileVerified: user.isMobileVerified
          },
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        };
      }

      res.json({
        success: true,
        message: 'Email verified successfully',
        data
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({
        success: false,
        message: 'OTP verification failed'
      });
    }
  }

  /**
   * Reset password
   */
  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, newPassword, confirmPassword }: IResetPasswordData = req.body;

      // First, check if this OTP was recently verified
      // We'll look for an OTP record that was marked as used recently (within the last 15 minutes)
      const recentlyUsedOTP = await OTP.findOne({
        email,
        otp,
        type: 'password_reset',
        isUsed: true,
        updatedAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) } // Within last 15 minutes
      });

      // If not recently used, verify it now
      if (!recentlyUsedOTP) {
        const isValid = await OTPUtils.verifyOTP(email, otp, 'password_reset');
        
        if (!isValid) {
          res.status(400).json({
            success: false,
            message: 'Invalid or expired OTP'
          });
          return;
        }
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password reset successfully'
      });
    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({
        success: false,
        message: 'Password reset failed'
      });
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: IAuthRequest, res: Response): Promise<void> {
    try {
      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: {
          user: req.user
        }
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve profile'
      });
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { firstName, lastName, mobile, age, skinType, allergies, medicalHistory } = req.body as unknown as IUpdateProfileData;
      const userId = req.user!._id;

      const updateData: any = {};
      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (mobile) updateData.mobile = mobile;
      if (age !== undefined) updateData.age = age;
      if (skinType !== undefined) updateData.skinType = skinType;
      if (allergies !== undefined) updateData.allergies = allergies;
      if (medicalHistory !== undefined) updateData.medicalHistory = medicalHistory;

      const user = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user
        }
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Profile update failed'
      });
    }
  }

  /**
   * Change password
   */
  static async changePassword(req: IAuthRequest, res: Response): Promise<void> {
    try {
      const { currentPassword, newPassword } = req.body as unknown as IChangePasswordData;
      const userId = req.user!._id;

      // Find user with password
      const user = await User.findById(userId).select('+password');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(currentPassword);
      if (!isCurrentPasswordValid) {
        res.status(400).json({
          success: false,
          message: 'Current password is incorrect'
        });
        return;
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Password change failed'
      });
    }
  }

  /**
   * Logout user
   */
  static async logout(req: IAuthRequest, res: Response): Promise<void> {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return a success message
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
  }

  /**
   * Refresh token
   */
  static async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
        return;
      }

      // Verify refresh token
      const decoded = JWTUtils.verifyRefreshToken(refreshToken);

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Invalid refresh token'
        });
        return;
      }

      // Generate new tokens
      const tokens = JWTUtils.generateTokenPair(user);

      res.json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken
        }
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }
  }
}
