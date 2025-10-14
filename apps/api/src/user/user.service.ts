import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { hash } from 'argon2';
import * as crypto from 'crypto';
@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  async create(createUserDto: CreateUserDto) {
    const { password, ...user } = createUserDto;
    const hashedPassword = await hash(password);
    const verificationCode = crypto.randomBytes(32).toString('hex');
    
    const newUser = new this.userModel({
      password: hashedPassword,
      ...user,
      verificationCode,
    });
    return newUser.save();
  }
  async findUserByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }
}
