import crypto from 'crypto';
import { OTP } from '../models/OTP';
import { config } from '../config/config';
import { OTPType } from '../types';

export class OTPUtils {
  /**
   * Generate a random OTP
   */
  static generateOTP(length: number = config.OTP_LENGTH): string {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return crypto.randomInt(min, max).toString();
  }

  /**
   * Create and save OTP
   */
  static async createOTP(
    email: string,
    type: OTPType,
    mobile?: string,
    expiresInMinutes: number = config.OTP_EXPIRE_MINUTES
  ): Promise<string> {
    try {
      // Remove any existing OTPs for this email and type
      await OTP.deleteMany({ email, type });
      
      const otp = this.generateOTP();
      const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);
      
      await OTP.create({
        email,
        mobile,
        otp,
        type,
        expiresAt
      });

      return otp;
    } catch (error) {
      console.error('Error creating OTP:', error);
      throw new Error('Failed to create OTP');
    }
  }

  /**
   * Verify OTP
   */
  static async verifyOTP(
    email: string,
    otp: string,
    type: OTPType
  ): Promise<boolean> {
    try {
      console.log(`🔍 Looking for OTP record: email=${email}, otp=${otp}, type=${type}`);
      
      const otpRecord = await OTP.findOne({
        email,
        otp,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      console.log(`📋 OTP record found:`, otpRecord ? 'YES' : 'NO');
      if (otpRecord) {
        console.log(`📋 OTP details:`, {
          email: otpRecord.email,
          type: otpRecord.type,
          isUsed: otpRecord.isUsed,
          attempts: otpRecord.attempts,
          expiresAt: otpRecord.expiresAt,
          currentTime: new Date()
        });
      } else {
        // Let's check what OTP records exist for this email and type
        const allRecords = await OTP.find({ email, type });
        console.log(`📋 All OTP records for ${email} (${type}):`, allRecords);
      }

      if (!otpRecord) {
        return false;
      }

      // Check attempts limit
      if (otpRecord.attempts >= 5) {
        throw new Error('Maximum attempts exceeded. Please request a new OTP.');
      }

      // Mark OTP as used
      otpRecord.isUsed = true;
      await otpRecord.save();

      return true;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw error;
    }
  }

  /**
   * Increment OTP attempts
   */
  static async incrementOTPAttempts(
    email: string,
    otp: string,
    type: OTPType
  ): Promise<void> {
    try {
      const otpRecord = await OTP.findOne({
        email,
        otp,
        type,
        isUsed: false
      });

      if (otpRecord) {
        otpRecord.attempts += 1;
        await otpRecord.save();
      }
    } catch (error) {
      console.error('Error incrementing OTP attempts:', error);
    }
  }

  /**
   * Check if OTP exists and is valid
   */
  static async isValidOTP(
    email: string,
    otp: string,
    type: OTPType
  ): Promise<boolean> {
    try {
      const otpRecord = await OTP.findOne({
        email,
        otp,
        type,
        isUsed: false,
        expiresAt: { $gt: new Date() }
      });

      return !!otpRecord;
    } catch (error) {
      console.error('Error checking OTP validity:', error);
      return false;
    }
  }

  /**
   * Clean expired OTPs
   */
  static async cleanExpiredOTPs(): Promise<void> {
    try {
      await OTP.deleteMany({
        $or: [
          { expiresAt: { $lt: new Date() } },
          { isUsed: true }
        ]
      });
      console.log('Expired OTPs cleaned up');
    } catch (error) {
      console.error('Error cleaning expired OTPs:', error);
    }
  }

  /**
   * Get OTP expiry time
   */
  static getOTPExpiryTime(minutes: number = config.OTP_EXPIRE_MINUTES): Date {
    return new Date(Date.now() + minutes * 60 * 1000);
  }

  /**
   * Format OTP expiry time for display
   */
  static formatExpiryTime(minutes: number = config.OTP_EXPIRE_MINUTES): string {
    if (minutes < 60) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (remainingMinutes === 0) {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    
    return `${hours} hour${hours > 1 ? 's' : ''} and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  }

  /**
   * Generate OTP hash for secure storage
   */
  static hashOTP(otp: string): string {
    return crypto.createHash('sha256').update(otp).digest('hex');
  }

  /**
   * Verify OTP hash
   */
  static verifyOTPHash(otp: string, hash: string): boolean {
    const otpHash = this.hashOTP(otp);
    return crypto.timingSafeEqual(Buffer.from(otpHash), Buffer.from(hash));
  }

  /**
   * Generate secure random OTP
   */
  static generateSecureOTP(length: number = config.OTP_LENGTH): string {
    const chars = '0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      result += chars[randomIndex];
    }
    
    return result;
  }

  /**
   * Check OTP rate limit
   */
  static async checkRateLimit(
    email: string,
    type: OTPType,
    maxAttempts: number = 5,
    timeWindow: number = 15 * 60 * 1000 // 15 minutes
  ): Promise<boolean> {
    try {
      const recentOTPs = await OTP.countDocuments({
        email,
        type,
        createdAt: { $gte: new Date(Date.now() - timeWindow) }
      });

      return recentOTPs < maxAttempts;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return false;
    }
  }
}
