import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import {
  validateLogin,
  validateRegister,
  validateForgotPassword,
  validateOTPVerification,
  validateResetPassword,
  validateChangePassword,
  validateUpdateProfile
} from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);
router.post('/forgot-password', validateForgotPassword, AuthController.forgotPassword);
router.post('/resend-otp', validateForgotPassword, AuthController.resendOTP);
router.post('/verify-otp', validateOTPVerification, AuthController.verifyOTP);
router.post('/reset-password', validateResetPassword, AuthController.resetPassword);
router.post('/refresh-token', AuthController.refreshToken);

// Protected routes
router.get('/profile', authenticate, AuthController.getProfile);
router.put('/profile', authenticate, validateUpdateProfile, AuthController.updateProfile);
router.put('/change-password', authenticate, validateChangePassword, AuthController.changePassword);
router.post('/logout', authenticate, AuthController.logout);

export default router;
