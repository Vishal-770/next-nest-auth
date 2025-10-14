import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { EmailModule } from 'src/email/email.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStratergy } from 'src/stratergies/local.stratergy';

@Module({
  imports: [UserModule, EmailModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStratergy],
})
export class AuthModule {}
