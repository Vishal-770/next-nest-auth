import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findUserByEmail(createUserDto.email);
    if (user) {
      throw new ConflictException('User Already Exists');
    }

    // Create the user with verification code
    const newUser = await this.userService.create(createUserDto);

    // Send verification email
    try {
      await this.emailService.sendVerificationEmail(
        newUser.email,
        newUser.name,
        newUser.verificationCode,
      );
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // You can decide whether to throw an error or just log it
      // For now, we'll continue even if email fails
    }

    // Return user without sensitive data
    return {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      verified: newUser.verified,
      message:
        'Registration successful! Please check your email to verify your account.',
    };
  }
}
