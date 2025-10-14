import {
  ConflictException,
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    try {
      const user = await this.userService.findUserByEmail(createUserDto.email);
      if (user?.verified) {
        throw new ConflictException('User Already Exists');
      }

      // Create or update user with verification code (for unverified users)
      const newUser =
        await this.userService.upsertUserWithVerification(createUserDto);

      if (!newUser) {
        throw new ConflictException('User Already Exists and is Verified');
      }

      // Send verification email
      try {
        await this.emailService.sendVerificationEmail(
          newUser.email,
          newUser.name,
          newUser.verificationCode,
        );
      } catch (error) {
        console.error('Failed to send verification email:', error);
        // Continue even if email fails - user is created
      }

      return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        verified: newUser.verified,
        message:
          'Registration successful! Please check your email to verify your account.',
      };
    } catch (error) {
      // If it's already a NestJS exception, re-throw it
      if (error instanceof ConflictException) {
        throw error;
      }

      // Log unexpected errors
      console.error('Error during user registration:', error);
      throw new InternalServerErrorException(
        'An error occurred during registration. Please try again later.',
      );
    }
  }

  async verifyEmail(verificationCode: string) {
    // Validate verification code format
    if (!verificationCode || verificationCode.trim() === '') {
      throw new BadRequestException('Verification code is required');
    }

    if (verificationCode.length !== 64) {
      throw new BadRequestException('Invalid verification code format');
    }

    try {
      const result = await this.userService.verifyUser(verificationCode);

      if (!result) {
        throw new NotFoundException(
          'Invalid or expired verification code. Please request a new verification email.',
        );
      }

      if (result.alreadyVerified) {
        return {
          success: true,
          message: 'Email already verified. You can now log in.',
          user: {
            id: result.user._id,
            name: result.user.name,
            email: result.user.email,
            verified: result.user.verified,
          },
        };
      }

      return {
        success: true,
        message: 'Email verified successfully! You can now log in.',
        user: {
          id: result.user._id,
          name: result.user.name,
          email: result.user.email,
          verified: result.user.verified,
        },
      };
    } catch (error) {
      // If it's already a NestJS exception, re-throw it
      if (
        error instanceof BadRequestException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      // Log unexpected errors
      console.error('Error during email verification:', error);
      throw new InternalServerErrorException(
        'An error occurred during email verification. Please try again later.',
      );
    }
  }

  async validateLocalUser(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);

    if (!user) throw new UnauthorizedException('Invalid Credentials');

    // Check if user's email is verified
    if (!user.verified) {
      throw new UnauthorizedException(
        'Email not verified. Please check your email and verify your account before logging in.',
      );
    }

    const isPasswordMatched = await verify(user.password, password);

    if (!isPasswordMatched)
      throw new UnauthorizedException('Invalid Credentials');

    return { id: user.id, name: user.name, email: user.email };
  }
}
