import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { EmailModule } from 'src/email/email.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStratergy } from 'src/stratergies/local.stratergy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwt.config';
import { JwtStratergy } from 'src/stratergies/jwt.stratergies';
@Module({
  imports: [
    UserModule,
    EmailModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStratergy, JwtStratergy],
})
export class AuthModule {}
