import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export enum AuthType {
  EMAIL = 'email',
  GOOGLE = 'google',
}
export enum Role {
  User = 'user',
  Admin = 'admin',
}
export type UserDocument = User & Document;
@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ default: false })
  verified: boolean;
  @Prop({ type: String, default: AuthType.EMAIL })
  authType: AuthType;
  @Prop({ required: true })
  verificationCode: string;
  @Prop({ type: String, default: Role.User })
  role: Role;
}
export const UserSchema = SchemaFactory.createForClass(User);
