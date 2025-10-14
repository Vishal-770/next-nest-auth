import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { VerificationCodeDto } from '../user/dto/verificationCode.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  @Post('verify')
  verify(@Body() verificationCodeDto: VerificationCodeDto) {
    return this.authService.verifyEmail(verificationCodeDto.code);
  }
}
