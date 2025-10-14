import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'supbasetest@gmail.com',
        pass: this.configService.get<string>('GMAIL_AUTH'),
      },
    });
  }

  async sendVerificationEmail(
    email: string,
    name: string,
    verificationCode: string,
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const verificationLink = `${frontendUrl}/auth/verify?code=${verificationCode}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
          }
          .email-container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }
          .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            padding: 40px 20px;
            text-align: center;
          }
          .email-header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 600;
          }
          .email-body {
            padding: 40px 30px;
            color: #333333;
            line-height: 1.6;
          }
          .email-body h2 {
            color: #667eea;
            font-size: 24px;
            margin-bottom: 20px;
          }
          .email-body p {
            margin: 15px 0;
            font-size: 16px;
          }
          .verify-button {
            display: inline-block;
            margin: 30px 0;
            padding: 15px 40px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            text-align: center;
            transition: transform 0.2s;
          }
          .verify-button:hover {
            transform: translateY(-2px);
          }
          .button-container {
            text-align: center;
          }
          .footer {
            background-color: #f9f9f9;
            padding: 20px;
            text-align: center;
            font-size: 14px;
            color: #666666;
            border-top: 1px solid #eeeeee;
          }
          .code-box {
            background-color: #f5f5f5;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            word-break: break-all;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>🎉 Welcome to Our Platform!</h1>
          </div>
          <div class="email-body">
            <h2>Hi ${name},</h2>
            <p>Thank you for registering with us! We're excited to have you on board.</p>
            <p>To complete your registration and activate your account, please verify your email address by clicking the button below:</p>
            
            <div class="button-container">
              <a href="${verificationLink}" class="verify-button">Verify Your Account</a>
            </div>
            
            <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
            <div class="code-box">
              ${verificationLink}
            </div>
            
            <p><strong>Note:</strong> This verification link will expire in 24 hours for security reasons.</p>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <p>Best regards,<br><strong>The Team</strong></p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
            <p>This is an automated email, please do not reply to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: '"Your App" <supbasetest@gmail.com>',
      to: email,
      subject: 'Verify Your Email Address',
      html: htmlContent,
    };

    try {
      const info = (await this.transporter.sendMail(mailOptions)) as {
        messageId: string;
      };

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send verification email');
    }
  }
}
