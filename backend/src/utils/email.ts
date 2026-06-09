import nodemailer from 'nodemailer';
import { config } from '../config/config';
import { IEmailOptions, IOTPEmailData } from '../types';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.EMAIL_HOST,
      port: config.EMAIL_PORT,
      secure: config.EMAIL_SECURE,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
      }
    });
  }

  /**
   * Send email
   */
  async sendEmail(options: IEmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: config.EMAIL_FROM,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error('Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }

  /**
   * Send OTP email
   */
  async sendOTPEmail(email: string, otpData: IOTPEmailData): Promise<void> {
    const subject = this.getOTPEmailSubject(otpData.type);
    const html = this.generateOTPEmailHTML(otpData);
    const text = this.generateOTPEmailText(otpData);

    await this.sendEmail({
      to: email,
      subject,
      html,
      text
    });
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const subject = 'Welcome to DermaCure AI!';
    const html = this.generateWelcomeEmailHTML(firstName);
    const text = this.generateWelcomeEmailText(firstName);

    await this.sendEmail({
      to: email,
      subject,
      html,
      text
    });
  }

  /** Notify doctor(s) that a new patient consultation was submitted */
  async sendNewConsultationAlert(doctorEmail: string, doctorName: string, patientName: string): Promise<void> {
    await this.sendEmail({
      to: doctorEmail,
      subject: `New Consultation Request — ${patientName}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#1d4ed8;color:#fff;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="margin:0;font-size:22px;">DermaCure AI — New Consultation</h1>
          </div>
          <div style="background:#f8fafc;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;border-top:none;">
            <p style="font-size:16px;color:#1e293b;">Hello Dr. <strong>${doctorName}</strong>,</p>
            <p style="color:#475569;">A new patient consultation has been submitted and is awaiting your review.</p>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:20px 0;">
              <p style="margin:0;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Patient</p>
              <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#1e293b;">${patientName}</p>
            </div>
            <p style="color:#475569;">Please log in to the <strong>DermaCure AI Doctor Portal</strong> to review the case, run AI diagnostics, and provide your professional assessment.</p>
            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:14px;margin-top:20px;">
              <p style="margin:0;font-size:12px;color:#92400e;"><strong>Reminder:</strong> Timely review improves patient outcomes.</p>
            </div>
          </div>
          <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:16px;">&copy; 2025 DermaCure AI. All rights reserved.</p>
        </div>`,
      text: `Hello Dr. ${doctorName},\n\nA new consultation from ${patientName} is awaiting your review.\n\nPlease log in to DermaCure AI to review the case.\n\n— DermaCure AI`,
    });
  }

  /** Notify patient that their report has been finalized and is ready to view */
  async sendReportReadyAlert(patientEmail: string, patientName: string, doctorName: string, disease: string): Promise<void> {
    await this.sendEmail({
      to: patientEmail,
      subject: 'Your DermaCure AI Report is Ready',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
          <div style="background:#0e7490;color:#fff;padding:24px;border-radius:8px 8px 0 0;text-align:center;">
            <h1 style="margin:0;font-size:22px;">DermaCure AI — Report Ready</h1>
          </div>
          <div style="background:#f8fafc;padding:28px;border-radius:0 0 8px 8px;border:1px solid #e2e8f0;border-top:none;">
            <p style="font-size:16px;color:#1e293b;">Hello <strong>${patientName}</strong>,</p>
            <p style="color:#475569;">Your doctor has reviewed your consultation and your report is now available.</p>
            <div style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:20px 0;">
              <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
                <div>
                  <p style="margin:0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">Reviewed By</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#1e293b;">Dr. ${doctorName}</p>
                </div>
                <div>
                  <p style="margin:0;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.05em;font-weight:700;">AI Finding</p>
                  <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#0e7490;">${disease}</p>
                </div>
              </div>
            </div>
            <p style="color:#475569;">Log in to <strong>DermaCure AI</strong> and visit <strong>Doctor Reports</strong> to view the full report, doctor's notes, and treatment recommendations. You can also download a PDF copy.</p>
            <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:14px;margin-top:20px;">
              <p style="margin:0;font-size:12px;color:#166534;"><strong>Important:</strong> This AI-assisted report is for preliminary screening only. Follow your doctor's recommendations and schedule an in-person appointment if advised.</p>
            </div>
          </div>
          <p style="text-align:center;font-size:11px;color:#94a3b8;margin-top:16px;">&copy; 2025 DermaCure AI. All rights reserved.</p>
        </div>`,
      text: `Hello ${patientName},\n\nYour report from Dr. ${doctorName} is ready.\n\nFinding: ${disease}\n\nLog in to DermaCure AI to view the full report and download your PDF.\n\n— DermaCure AI`,
    });
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
    const subject = 'Password Reset Request';
    const html = this.generatePasswordResetEmailHTML(resetLink);
    const text = this.generatePasswordResetEmailText(resetLink);

    await this.sendEmail({
      to: email,
      subject,
      html,
      text
    });
  }

  /**
   * Get OTP email subject based on type
   */
  private getOTPEmailSubject(type: string): string {
    switch (type) {
      case 'email_verification':
        return 'Verify Your Email Address';
      case 'password_reset':
        return 'Password Reset OTP';
      case 'mobile_verification':
        return 'Mobile Verification OTP';
      case 'login':
        return 'Login OTP';
      default:
        return 'Your OTP Code';
    }
  }

  /**
   * Generate OTP email HTML
   */
  private generateOTPEmailHTML(otpData: IOTPEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>DermaCure AI - OTP Verification</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .otp-code { background: #1f2937; color: white; font-size: 32px; font-weight: bold; text-align: center; padding: 20px; border-radius: 8px; letter-spacing: 4px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>DermaCure AI - OTP Verification</h1>
          </div>
          <div class="content">
            <h2>Your Verification Code</h2>
            <p>Please use the following code to complete your ${otpData.type.replace('_', ' ')}:</p>
            
            <div class="otp-code">${otpData.otp}</div>
            
            <div class="warning">
              <strong>Important:</strong> This code will expire in ${otpData.expiresIn}. Do not share this code with anyone.
            </div>
            
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2025 DermaCure AI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate OTP email text
   */
  private generateOTPEmailText(otpData: IOTPEmailData): string {
    return `
OTP Verification

Your verification code is: ${otpData.otp}

This code will expire in ${otpData.expiresIn}.

If you didn't request this code, please ignore this email.

---
Auth App
    `;
  }

  /**
   * Generate welcome email HTML
   */
  private generateWelcomeEmailHTML(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to DermaCure AI</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to DermaCure AI!</h1>
          </div>
          <div class="content">
            <h2>Hello ${firstName}!</h2>
            <p>Welcome to DermaCure AI! Your account has been successfully created.</p>
            <p>You can now access AI-powered skin disease detection and personalized care recommendations.</p>
            <p>Get started by uploading a skin image for analysis or entering your symptoms for comprehensive diagnosis.</p>
            <p>If you have any questions, feel free to contact our support team.</p>
            <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <strong>Medical Disclaimer:</strong> AI predictions are preliminary. Always consult a certified dermatologist for accurate diagnosis and treatment.
            </div>
          </div>
          <div class="footer">
            <p>&copy; 2025 DermaCure AI. All rights reserved.</p>
            <p style="font-size: 12px; color: #9ca3af; margin-top: 10px;">
              Empowering early detection through AI technology
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate welcome email text
   */
  private generateWelcomeEmailText(firstName: string): string {
    return `
Welcome to DermaCure AI!

Hello ${firstName}!

Welcome to DermaCure AI! Your account has been successfully created.

You can now access AI-powered skin disease detection and personalized care recommendations.

Get started by uploading a skin image for analysis or entering your symptoms for comprehensive diagnosis.

If you have any questions, feel free to contact our support team.

Medical Disclaimer: AI predictions are preliminary. Always consult a certified dermatologist for accurate diagnosis and treatment.

---
DermaCure AI
Empowering early detection through AI technology
    `;
  }

  /**
   * Generate password reset email HTML
   */
  private generatePasswordResetEmailHTML(resetLink: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .button { background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            
            <a href="${resetLink}" class="button">Reset Password</a>
            
            <div class="warning">
              <strong>Important:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
            </div>
            
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #4f46e5;">${resetLink}</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>&copy; 2025 DermaCure AI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate password reset email text
   */
  private generatePasswordResetEmailText(resetLink: string): string {
    return `
Password Reset Request

You requested to reset your password. Click the link below to reset it:

${resetLink}

This link will expire in 1 hour. If you didn't request this reset, please ignore this email.

---
Auth App
    `;
  }
}

export const emailService = new EmailService();
