import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { VerificationCodeDto } from '../user/dto/verificationCode.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';

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
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  login(@Request() req) {
    return req.user;
  }
}
