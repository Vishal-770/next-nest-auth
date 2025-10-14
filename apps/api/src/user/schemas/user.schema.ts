import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export enum AuthType {
  EMAIL = 'email',
  GOOGLE = 'google',
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
}
export const UserSchema = SchemaFactory.createForClass(User);
