import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class VerificationCodeDto {
  @IsString({ message: 'Verification code must be a string' })
  @IsNotEmpty({ message: 'Verification code is required' })
  @MinLength(64, { message: 'Invalid verification code format' })
  @MaxLength(64, { message: 'Invalid verification code format' })
  code: string;
}
