import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import { IUser, UserRole } from '../types';

export interface ITokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JWTUtils {
  /**
   * Generate access token
   */
  static generateAccessToken(user: any): string {
    const payload: ITokenPayload = {
      userId: user._id!,
      email: user.email!,
      role: user.role!
    };

    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: config.JWT_EXPIRE,
      issuer: 'auth-app',
      audience: 'auth-app-users'
    } as jwt.SignOptions);
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(user: any): string {
    const payload: ITokenPayload = {
      userId: user._id!,
      email: user.email!,
      role: user.role!
    };

    return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRE,
      issuer: 'auth-app',
      audience: 'auth-app-users'
    } as jwt.SignOptions);
  }

  /**
   * Generate token pair (access + refresh)
   */
  static generateTokenPair(user: any): ITokenPair {
    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user)
    };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, config.JWT_SECRET, {
        issuer: 'auth-app',
        audience: 'auth-app-users'
      }) as ITokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): ITokenPayload {
    try {
      return jwt.verify(token, config.JWT_REFRESH_SECRET, {
        issuer: 'auth-app',
        audience: 'auth-app-users'
      }) as ITokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Decode token without verification (for debugging)
   */
  static decodeToken(token: string): any {
    return jwt.decode(token);
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as any;
      if (!decoded || !decoded.exp) return true;
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }

  /**
   * Generate password reset token
   */
  static generatePasswordResetToken(user: Partial<IUser>): string {
    const payload = {
      userId: user._id,
      email: user.email,
      type: 'password_reset'
    };

    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: '1h', // Password reset tokens expire in 1 hour
      issuer: 'auth-app',
      audience: 'auth-app-users'
    });
  }

  /**
   * Verify password reset token
   */
  static verifyPasswordResetToken(token: string): any {
    try {
      return jwt.verify(token, config.JWT_SECRET, {
        issuer: 'auth-app',
        audience: 'auth-app-users'
      });
    } catch (error) {
      throw new Error('Invalid or expired password reset token');
    }
  }
}
