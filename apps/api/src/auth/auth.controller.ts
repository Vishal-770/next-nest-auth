import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { VerificationCodeDto } from './dto/verificationCode.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import type { Session } from './types/Session';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';

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
  login(@Request() req: Session) {
    return this.authService.login(req.user.id, req.user.name, req.user.email);
  }
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getAll() {
    return {
      message: 'Protected 123',
    };
  }
}
